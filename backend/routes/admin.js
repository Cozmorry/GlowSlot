const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const Booking = require('../models/Booking');
const User = require('../models/User');
const transporter = require('../config/mailer');
const Payment = require('../models/Payment');
const PDFDocument = require('pdfkit');

// Helper function to calculate balance for a booking
const calculateBookingBalance = (booking) => {
  const totalPrice = booking.price || 0;
  const paidAmount = booking.paidAmount || 0;
  const balance = Math.max(0, totalPrice - paidAmount);
  return {
    totalPrice,
    paidAmount,
    balance
  };
};

// Get all appointments (except cancelled)
router.get('/appointments', adminAuth, async (req, res) => {
  try {
    const { filter = 'all' } = req.query;
    
    let query = { status: { $ne: 'cancelled' } };
    
    // Apply filters based on query parameter
    if (filter === 'upcoming') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query.dateTime = { $gte: today };
      query.status = { $in: ['pending', 'paid', 'confirmed'] };
    } else if (filter === 'completed') {
      query.status = 'completed';
    } else if (filter === 'pending') {
      query.status = { $in: ['pending', 'paid', 'confirmed'] };
    }
    
    const appointments = await Booking.find(query).sort({ dateTime: 1 });
    
    // Add balance information to each appointment
    const appointmentsWithBalance = appointments.map(appointment => {
      const balanceInfo = calculateBookingBalance(appointment);
      return {
        ...appointment.toObject(),
        ...balanceInfo
      };
    });
    
    res.json(appointmentsWithBalance);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update appointment status
router.put('/appointments/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['pending', 'paid', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required' });
    }
    
    let appointment = await Booking.findById(id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    // Update paidAmount logic
    if (status === 'paid' && (!appointment.paidAmount || appointment.paidAmount === 0)) {
      const deposit = Math.round((appointment.price / 2) * 100) / 100;
      appointment.paidAmount = deposit;
      await Payment.updateOne(
        { bookingId: appointment._id, type: 'deposit' },
        { $setOnInsert: { bookingId: appointment._id, userId: appointment.userId, amount: deposit, type: 'deposit', method: 'manual' } },
        { upsert: true }
      );
    }
    if (status === 'completed' && appointment.paidAmount < appointment.price) {
      const finalAmount = Math.round((appointment.price - appointment.paidAmount) * 100) / 100;
      appointment.paidAmount = appointment.price;
      await Payment.updateOne(
        { bookingId: appointment._id, type: 'final' },
        { $setOnInsert: { bookingId: appointment._id, userId: appointment.userId, amount: finalAmount, type: 'final', method: 'manual' } },
        { upsert: true }
      );
    }
    appointment.status = status;
    await appointment.save();
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Send emails on status change
    try {
      const user = await User.findById(appointment.userId).lean();
      if (user && user.email) {
        if (status === 'confirmed') {
          await sendBookingConfirmationEmail(user, appointment);
          scheduleBookingReminderEmail(user, appointment);
        } else if (status === 'completed') {
          await sendBookingCompletionEmail(user, appointment);
        }
      }
    } catch (mailErr) {
      console.error('Admin status email error:', mailErr.message);
    }

    res.json(appointment);
  } catch (err) {
    console.error('Error updating appointment:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get booking statistics
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const paidBookings = await Booking.countDocuments({ status: 'paid' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcomingBookings = await Booking.countDocuments({
      dateTime: { $gte: today },
      status: { $in: ['pending', 'paid', 'confirmed'] }
    });
    
    const totalUsers = await User.countDocuments({ role: 'customer' });
    
    // Revenue = sum of paidAmount
    const revenueData = await Booking.aggregate([
      { $group: { _id: null, total: { $sum: '$paidAmount' } } }
    ]);
    
    const revenue = revenueData.length > 0 ? revenueData[0].total : 0;
    
    // Get bookings by category with paid amounts
    const bookingsByCategory = await Booking.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, revenue: { $sum: '$paidAmount' } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      totalBookings,
      pendingBookings,
      paidBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      upcomingBookings,
      totalUsers,
      revenue,
      bookingsByCategory
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get user listing
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

// Reports: export PDF for a date range
router.get('/reports/pdf', adminAuth, async (req, res) => {
  try {
    const { start, end } = req.query; // YYYY-MM-DD
    const startDate = start ? new Date(start + 'T00:00:00') : new Date('2000-01-01');
    const endDate = end ? new Date(end + 'T23:59:59') : new Date();

    // Aggregate revenue and bookings in range
    const revenueAgg = await Payment.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const revenue = revenueAgg[0]?.total || 0;

    const bookings = await Booking.find({ createdAt: { $gte: startDate, $lte: endDate } }).sort({ createdAt: 1 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="glowslot-report-${start || 'all'}-to-${end || 'now'}.pdf"`);
    const doc = new PDFDocument({ margin: 36 });
    doc.pipe(res);

    // Helpers & theme
    const brand = '#e91e63';
    const text = '#2d3748';
    const subText = '#4a5568';
    const border = '#e9ecef';
    const light = '#fce4ec';
    const money = (n) => `KSH ${Number(n || 0).toFixed(2)}`;

    const drawHeader = () => {
      const { width } = doc.page;
      doc.save();
      doc.rect(0, 0, width, 60).fill(light);
      doc.fillColor(brand).font('Helvetica-Bold').fontSize(22).text('GlowSlot Report', 36, 18);
      doc.fillColor(subText).font('Helvetica').fontSize(10)
        .text(`Period: ${start || 'All time'} to ${end || new Date().toISOString().slice(0,10)}`, 36, 40)
        .text(`Generated: ${new Date().toLocaleString()}`, 300, 40);
      doc.restore();
      doc.moveDown(2);
    };

    const drawFooter = () => {
      const range = doc.bufferedPageRange();
      // Apply to current page only
      const { width, height } = doc.page;
      doc.save();
      doc.moveTo(36, height - 36).lineTo(width - 36, height - 36).strokeColor(border).stroke();
      doc.fillColor(subText).fontSize(9).text('© 2025 GlowSlot', 36, height - 30);
      doc.fillColor(subText).fontSize(9).text(`Page ${doc.page.number} of ${range.count}`, width - 140, height - 30);
      doc.restore();
    };

    doc.on('pageAdded', () => {
      drawHeader();
      drawFooter();
    });

    // First page header
    drawHeader();

    // Summary cards
    const yStart = doc.y + 6;
    const cardW = (doc.page.width - 36 * 2 - 16 * 2) / 3; // three columns
    const cardH = 64;
    const drawCard = (x, y, title, value, color = brand) => {
      doc.save();
      doc.roundedRect(x, y, cardW, cardH, 8).fill('#ffffff').strokeColor(border).lineWidth(1).stroke();
      doc.fillColor(subText).font('Helvetica').fontSize(10).text(title, x + 12, y + 10);
      doc.fillColor(color).font('Helvetica-Bold').fontSize(16).text(value, x + 12, y + 28);
      doc.restore();
    };

    const completed = bookings.filter(b => b.status === 'completed').length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const paid = bookings.filter(b => b.status === 'paid').length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;

    drawCard(36, yStart, 'Total Revenue (received)', money(revenue), '#10B981');
    drawCard(36 + cardW + 16, yStart, 'Bookings Created', String(bookings.length), brand);
    drawCard(36 + (cardW + 16) * 2, yStart, 'Status: C / Conf / Paid / Pend', `${completed} / ${confirmed} / ${paid} / ${pending}`, '#2196F3');

    doc.moveDown(6);

    // Section: Bookings table
    doc.fillColor(text).font('Helvetica-Bold').fontSize(14).text('Bookings');
    doc.moveDown(0.5);

    // Table header
    const startX = 36;
    let y = doc.y;
    const widths = [80, 150, 120, 90, 70, 70];
    const headers = ['Date', 'Service', 'Staff', 'Status', 'Price', 'Paid'];

    doc.save();
    doc.rect(startX, y - 2, widths.reduce((a,b)=>a+b,0), 20).fill(light);
    doc.fillColor(brand).font('Helvetica-Bold').fontSize(10);
    let x = startX + 6;
    headers.forEach((h, i) => {
      doc.text(h, x, y + 2, { width: widths[i] - 12, align: 'left' });
      x += widths[i];
    });
    doc.restore();
    y += 22;

    // Rows
    doc.font('Helvetica').fontSize(10).fillColor(text);
    bookings.forEach((b, idx) => {
      if (y > doc.page.height - 72) {
        drawFooter();
        doc.addPage();
        y = doc.y;
        // redraw table header on new page
        doc.save();
        doc.rect(startX, y - 2, widths.reduce((a,b)=>a+b,0), 20).fill(light);
        doc.fillColor(brand).font('Helvetica-Bold').fontSize(10);
        let hx = startX + 6;
        headers.forEach((h, i) => { doc.text(h, hx, y + 2, { width: widths[i] - 12 }); hx += widths[i]; });
        doc.restore();
        y += 22;
        doc.font('Helvetica').fontSize(10).fillColor(text);
      }

      if (idx % 2 === 0) {
        doc.save();
        doc.rect(startX, y - 2, widths.reduce((a,b)=>a+b,0), 18).fill('#fafafa');
        doc.restore();
      }

      let cx = startX + 6;
      const cells = [
        new Date(b.createdAt).toLocaleDateString(),
        b.service || '-',
        b.staff || '-',
        (b.status || '-'),
        money(b.price),
        money(b.paidAmount)
      ];
      cells.forEach((val, i) => {
        doc.fillColor(text).text(String(val), cx, y, { width: widths[i] - 12, align: i >= 4 ? 'right' : 'left' });
        cx += widths[i];
      });
      y += 18;
    });

    // Totals row
    if (y > doc.page.height - 72) { drawFooter(); doc.addPage(); y = doc.y; }
    doc.save();
    doc.moveTo(startX, y).lineTo(startX + widths.reduce((a,b)=>a+b,0), y).strokeColor(border).stroke();
    doc.font('Helvetica-Bold').fillColor(text).text('Totals', startX + 6, y + 6, { width: widths[0] + widths[1] + widths[2] + widths[3] - 12 });
    doc.text(money(bookings.reduce((a,b)=>a + (b.price || 0), 0)), startX + widths[0] + widths[1] + widths[2] + widths[3] + 6, y + 6, { width: widths[4] - 12, align: 'right' });
    doc.text(money(bookings.reduce((a,b)=>a + (b.paidAmount || 0), 0)), startX + widths[0] + widths[1] + widths[2] + widths[3] + widths[4] + 6, y + 6, { width: widths[5] - 12, align: 'right' });
    doc.restore();

    // Footer for last page & end
    drawFooter();
    doc.end();
  } catch (err) {
    console.error('Error generating PDF:', err);
    res.status(500).json({ message: 'Failed to generate report' });
  }
});

// Helpers (kept local to admin route for now)
async function sendBookingConfirmationEmail(user, booking) {
  const when = new Date(booking.dateTime);
  const prettyWhen = when.toLocaleString();
  const html = `
    <!DOCTYPE html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Booking Confirmed - GlowSlot</title>
    <style>body{font-family:Segoe UI,Tahoma,Verdana,sans-serif;line-height:1.6;color:#333;background:#f8f9fa;padding:20px}.container{max-width:640px;margin:0 auto;background:#fff;border-radius:12px;box-shadow:0 4px 10px rgba(0,0,0,0.06);padding:28px}.logo{font-size:24px;font-weight:800;color:#e91e63;margin-bottom:10px}.title{font-size:20px;font-weight:700;color:#2d3748;margin:10px 0}.pill{display:inline-block;background:#e91e63;color:#fff;border-radius:999px;padding:6px 12px;font-weight:600}.meta div{margin:6px 0}.footer{margin-top:24px;color:#718096;font-size:13px}</style>
    </head><body><div class="container">
    <div class="logo">✨ GlowSlot</div><div class="title">Your booking is confirmed</div>
    <p>Hi ${user.name || 'there'},</p>
    <div class="meta">
      <div><strong>Service:</strong> ${booking.service}</div>
      <div><strong>Staff:</strong> ${booking.staff}</div>
      <div><strong>Date & Time:</strong> ${prettyWhen}</div>
      <div><span class="pill">Status: ${booking.status}</span></div>
    </div>
    <p>You will receive a reminder before your appointment.</p>
    <div class="footer">© 2025 GlowSlot. All rights reserved.</div>
    </div></body></html>`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'GlowSlot - Booking confirmed',
    html,
  });
}

function scheduleBookingReminderEmail(user, booking, leadMs = 2 * 60 * 60 * 1000) {
  const when = new Date(booking.dateTime).getTime();
  const now = Date.now();
  const delay = when - now - leadMs;
  if (delay > 0 && delay < 30 * 24 * 60 * 60 * 1000) {
    setTimeout(async () => {
      try {
        const html = `<!DOCTYPE html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Appointment Reminder - GlowSlot</title><style>body{font-family:Segoe UI,Tahoma,Verdana,sans-serif;line-height:1.6;color:#333;background:#f8f9fa;padding:20px}.container{max-width:640px;margin:0 auto;background:#fff;border-radius:12px;box-shadow:0 4px 10px rgba(0,0,0,0.06);padding:28px}.logo{font-size:24px;font-weight:800;color:#e91e63;margin-bottom:10px}.title{font-size:20px;font-weight:700;color:#2d3748;margin:10px 0}.meta div{margin:6px 0}.footer{margin-top:24px;color:#718096;font-size:13px}</style></head><body><div class="container"><div class="logo">✨ GlowSlot</div><div class="title">Appointment Reminder</div><p>Hi ${user.name || 'there'}, this is a friendly reminder for your upcoming appointment:</p><div class="meta"><div><strong>Service:</strong> ${booking.service}</div><div><strong>Staff:</strong> ${booking.staff}</div><div><strong>Date & Time:</strong> ${new Date(booking.dateTime).toLocaleString()}</div></div><p>Please arrive a few minutes early. We look forward to seeing you!</p><div class="footer">© 2025 GlowSlot. All rights reserved.</div></div></body></html>`;
        await transporter.sendMail({ from: process.env.EMAIL_USER, to: user.email, subject: 'GlowSlot - Appointment reminder', html });
      } catch (e) {
        console.error('Reminder email error:', e.message);
      }
    }, delay);
  }
}

async function sendBookingCompletionEmail(user, booking) {
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Thank You - GlowSlot</title><style>body{font-family:Segoe UI,Tahoma,Verdana,sans-serif;line-height:1.6;color:#333;background:#f8f9fa;padding:20px}.container{max-width:640px;margin:0 auto;background:#fff;border-radius:12px;box-shadow:0 4px 10px rgba(0,0,0,0.06);padding:28px}.logo{font-size:24px;font-weight:800;color:#e91e63;margin-bottom:10px}.title{font-size:20px;font-weight:700;color:#2d3748;margin:10px 0}.meta div{margin:6px 0}.footer{margin-top:24px;color:#718096;font-size:13px}</style></head><body><div class="container"><div class="logo">✨ GlowSlot</div><div class="title">Thanks for visiting!</div><p>Hi ${user.name || 'there'},</p><p>Your ${booking.service} appointment with ${booking.staff} is now marked as <strong>completed</strong>. We hope you enjoyed the service!</p><div class="meta"><div><strong>Date & Time:</strong> ${new Date(booking.dateTime).toLocaleString()}</div><div><strong>Service:</strong> ${booking.service}</div></div><p>We’d love your feedback — please leave a review on the Reviews page to help others.</p><div class="footer">© 2025 GlowSlot. All rights reserved.</div></div></body></html>`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'GlowSlot - Thank you for your visit',
    html,
  });
}