const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const Booking = require('../models/Booking');
const User = require('../models/User');
const transporter = require('../config/mailer');

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
    
    res.json(appointments);
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
    
    const appointment = await Booking.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );
    
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
    
    // Get revenue (sum of booking prices for completed bookings)
    const revenueData = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);
    
    const revenue = revenueData.length > 0 ? revenueData[0].total : 0;
    
    // Get bookings by category
    const bookingsByCategory = await Booking.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
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