const BookingModel = require('../models/Booking');
const { getServicePrice, getServiceDuration } = require('../data/servicePrices');
const User = require('../models/User');
const { staffData } = require('../data/staffData');
const transporter = require('../config/mailer');
const Payment = require('../models/Payment');

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

// Helper: determine primary service category from free-text service
function getServiceCategory(service) {
  const keywordsByCategory = {
    hair: ['hair', 'braid', 'loc', 'wig', 'cut', 'dye', 'style', 'perm', 'weave', 'trim', 'blowdry'],
    nails: ['nail', 'manicure', 'pedicure', 'polish', 'gel', 'acrylic'],
    spa: ['massage', 'facial', 'scrub', 'body', 'therapy', 'treat', 'stone', 'hydra', 'microderm', 'peel'],
    waxing: ['wax', 'thread', 'hair removal', 'eyebrow', 'brazilian', 'underarm'],
    makeup: ['makeup', 'lash', 'brow', 'face', 'glam', 'contour', 'airbrush'],
    barber: ['beard', 'shave', 'trim', 'fade', 'cut', 'lineup'],
    piercing: ['pierce', 'earring', 'nose', 'navel', 'belly', 'septum'],
    tattoo: ['tattoo', 'ink', 'design', 'sleeve'],
  };

  const lower = (service || '').toLowerCase();
  for (const [category, words] of Object.entries(keywordsByCategory)) {
    if (words.some(w => lower.includes(w))) return category;
  }
  return null;
}

// Helper: get eligible staff (basic match by category keywords)
function getEligibleStaff(service) {
  const category = getServiceCategory(service);
  if (!category) return [];
  return staffData.filter(s => (s.specialties || '').toLowerCase().includes(category));
}

// Helper: seedable PRNG (mulberry32) for deterministic-but-natural schedules
function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function stringSeed(...parts) {
  const s = parts.join('|');
  let h = 2166136261 >>> 0; // FNV-1a
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function randInt(prng, min, max) {
  return Math.floor(prng() * (max - min + 1)) + min;
}

function minutes(ms) { return ms * 60000; }

function isWithin(ts, start, end) {
  const t = ts.getTime();
  return t >= start.getTime() && t < end.getTime();
}

// More realistic per-staff schedule: variable hours, offsets, and intervals
function generateRealisticSlotsForStaff(dateStr, staffName, service, durationMinutes = 60) {
  const base = new Date(dateStr);
  if (Number.isNaN(base.getTime())) return [];
  const seed = stringSeed(dateStr, staffName, service);
  const prng = mulberry32(seed);

  // Working hours vary per staff/day
  const startHour = randInt(prng, 8, 10);
  const endHour = randInt(prng, 17, 20);
  // Start minute offset to avoid :00 every time
  const possibleOffsets = [0, 5, 10, 15, 20];
  const offset = possibleOffsets[randInt(prng, 0, possibleOffsets.length - 1)];

  // Lunch break between 12:00-14:00, 45–75 minutes
  const lunchStartHour = randInt(prng, 12, 13);
  const lunchLen = randInt(prng, 45, 75);

  const dayStart = new Date(base);
  dayStart.setHours(startHour, offset, 0, 0);
  const dayEnd = new Date(base);
  dayEnd.setHours(endHour, 0, 0, 0);

  const lunchStart = new Date(base);
  lunchStart.setHours(lunchStartHour, randInt(prng, 0, 20) * 3, 0, 0); // minute 0,3,6,... up to ~60
  const lunchEnd = new Date(lunchStart.getTime() + minutes(lunchLen));

  const slots = [];
  let cursor = new Date(dayStart);
  while (cursor < dayEnd) {
    // Skip into post-lunch if cursor falls within lunch
    if (isWithin(cursor, lunchStart, lunchEnd)) {
      cursor = new Date(lunchEnd);
      continue;
    }
    // Ensure the slot fits within working hours and not inside lunch
    const slotEnd = new Date(cursor.getTime() + minutes(durationMinutes));
    if (slotEnd > dayEnd) break;
    if (!(isWithin(cursor, lunchStart, lunchEnd) || isWithin(slotEnd, lunchStart, lunchEnd))) {
      slots.push(new Date(cursor));
    }
    // Advance by a realistic interval based on service duration
    // Minimum 1 hour difference for all services, with longer gaps for longer services
    let step;
    if (durationMinutes >= 180) { // 3+ hours (tattoos, long hair services)
      step = randInt(prng, 240, 360); // 4-6 hours between slots
    } else if (durationMinutes >= 120) { // 2+ hours (hair coloring, treatments)
      step = randInt(prng, 180, 240); // 3-4 hours between slots
    } else if (durationMinutes >= 90) { // 1.5+ hours (makeup, spa)
      step = randInt(prng, 120, 180); // 2-3 hours between slots
    } else if (durationMinutes >= 60) { // 1+ hours (nails, waxing)
      step = randInt(prng, 90, 120); // 1.5-2 hours between slots
    } else { // Short services (barber, quick services) - minimum 1 hour
      step = randInt(prng, 60, 90); // 1-1.5 hours between slots (minimum 1 hour)
    }
    cursor = new Date(cursor.getTime() + minutes(step));
  }
  return slots;
}

// GET /api/bookings/availability?service=...&date=YYYY-MM-DD
exports.getAvailability = async (req, res) => {
  try {
    const { service, date, durationMinutes } = req.query;
    if (!service) return res.status(400).json({ message: 'Service is required' });
    if (!date) return res.status(400).json({ message: 'Date (YYYY-MM-DD) is required' });

    const eligible = getEligibleStaff(service);
    if (eligible.length === 0) {
      return res.json({ service, date, durationMinutes: Number(durationMinutes) || 60, staff: [] });
    }

    // Use service-specific duration or provided duration, default to 60 minutes
    const slotLen = Number(durationMinutes) || getServiceDuration(service) || 60; // minutes

    // Compute day bounds
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    // Find existing bookings for eligible staff on that date
    const staffNames = eligible.map(s => s.name);
    const existing = await BookingModel.find({
      staff: { $in: staffNames },
      dateTime: { $gte: dayStart, $lt: dayEnd },
    }).select('staff dateTime');

    const bookingsByStaff = new Map();
    for (const s of staffNames) bookingsByStaff.set(s, []);
    for (const b of existing) {
      bookingsByStaff.get(b.staff)?.push(new Date(b.dateTime));
    }

    // For each staff, generate realistic slots and filter out collisions (assume booking occupies slotLen)
    const result = eligible.map(s => {
      const taken = bookingsByStaff.get(s.name) || [];
      const rawSlots = generateRealisticSlotsForStaff(date, s.name, service, slotLen);
      const availableSlots = rawSlots.filter(slot => {
        // Check collision with any taken slot (within duration)
        return !taken.some(t => Math.abs(slot.getTime() - t.getTime()) < slotLen * 60000);
      });
      return {
        name: s.name,
        avatar: s.avatar || null,
        specialties: s.specialties || '',
        slots: availableSlots.map(d => d.toISOString()),
      };
    });

    res.json({ service, date, durationMinutes: slotLen, staff: result });
  } catch (err) {
    console.error('Error fetching availability:', err);
    res.status(500).json({ message: 'Error fetching availability' });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { service, fullName, phone, dateTime, userId } = req.body;

    if (!service || !fullName || !phone || !dateTime) {
      return res.status(400).json({ 
        message: 'Service, full name, phone number, and date/time are required' 
      });
    }

    if (!userId) {
      return res.status(400).json({ message: 'Please login to make a booking' });
    }

    // Convert string userId to ObjectId
    const mongoose = require('mongoose');
    let userObjectId;
    try {
      userObjectId = new mongoose.Types.ObjectId(userId);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    // Get price based on service
    const price = getServicePrice(service);
    if (!price) {
      return res.status(400).json({ message: 'Invalid service' });
    }
    
    // Default category to 'makeup' for now since this is from makeup page
    const category = 'makeup';

    const newBooking = new BookingModel({
      service,
      price,
      category,
      status: 'pending',
      fullName,
      phone,
      dateTime: dateTime ? new Date(dateTime) : undefined,
      userId: userObjectId  // Use the converted ObjectId
    });

    // Assign staff based on service type
    newBooking.staff = assignRandomStaff(service);

    await newBooking.save();
    console.log('Booking created successfully:', {
      id: newBooking._id,
      service: newBooking.service,
      status: newBooking.status,
      userId: newBooking.userId,
      dateTime: newBooking.dateTime
    });
    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Error adding service to cart' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'UserId is required' });
    }

    if (!status || !['pending', 'paid', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    // Convert string userId to ObjectId
    const mongoose = require('mongoose');
    let userObjectId;
    try {
      userObjectId = new mongoose.Types.ObjectId(userId);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    // Find all pending bookings for this user (to email after update)
    const bookingsToUpdate = await BookingModel.find({
      userId: userObjectId,
      status: 'pending'
    });

    // Update all pending bookings for this user
    const result = await BookingModel.updateMany(
      { 
        userId: userObjectId, 
        status: 'pending'  // Only update pending bookings
      },
      { 
        $set: { 
          status: status,
          dateTime: status === 'confirmed' ? new Date() : undefined,
          // Note: paidAmount updated per-record below to also log Payment
        } 
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'No pending bookings found for this user' });
    }

    // Send emails based on new status
    try {
      const dbUser = await User.findById(userObjectId).lean();
      if (dbUser && dbUser.email && bookingsToUpdate.length > 0) {
        for (const b of bookingsToUpdate) {
          const base = b.toObject();
          const effectiveDate = status === 'confirmed' ? new Date() : (base.dateTime ? new Date(base.dateTime) : new Date());
          let paidAmount = base.paidAmount || 0;
          if (status === 'paid' && paidAmount === 0) {
            paidAmount = Math.round((base.price / 2) * 100) / 100;
            // persist on booking and log Payment (deposit)
            await BookingModel.updateOne({ _id: b._id }, { $set: { paidAmount, status: 'paid' } });
            await Payment.updateOne(
              { bookingId: b._id, type: 'deposit' },
              { $setOnInsert: { bookingId: b._id, userId: userObjectId, amount: paidAmount, type: 'deposit', method: 'manual' } },
              { upsert: true }
            );
          }
          if (status === 'completed' && paidAmount < base.price) {
            const finalAmount = Math.round((base.price - paidAmount) * 100) / 100;
            paidAmount = base.price;
            await BookingModel.updateOne({ _id: b._id }, { $set: { paidAmount, status: 'completed' } });
            await Payment.updateOne(
              { bookingId: b._id, type: 'final' },
              { $setOnInsert: { bookingId: b._id, userId: userObjectId, amount: finalAmount, type: 'final', method: 'manual' } },
              { upsert: true }
            );
          }
          const updatedBooking = { ...base, status, dateTime: effectiveDate, paidAmount };
          if (status === 'confirmed') {
            await sendBookingConfirmationEmail(dbUser, updatedBooking);
            scheduleBookingReminderEmail(dbUser, updatedBooking);
          } else if (status === 'completed') {
            await sendBookingCompletionEmail(dbUser, updatedBooking);
          }
        }
      }
    } catch (mailErr) {
      console.error('Status email dispatch error:', mailErr.message);
    }

    res.status(200).json({ 
      message: 'Booking status updated successfully',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ 
      message: 'Error updating booking status',
      error: error.message
    });
  }
};

// Helper: assign random staff who offers the service
function assignRandomStaff(service) {
  console.log('Original service:', service);
  
  // Check if the service directly contains 'tattoo' or 'sleeve'
  if (service.toLowerCase().includes('tattoo') || service.toLowerCase().includes('sleeve')) {
    const tattooStaff = staffData.filter(staff => 
      staff.specialties.toLowerCase().includes('tattoo')
    );
    if (tattooStaff.length > 0) {
      return tattooStaff[Math.floor(Math.random() * tattooStaff.length)].name;
    }
  }
  
  // Default categories for ambiguous services
  const defaultCategories = {
    'eyebrow': 'waxing',     // Default eyebrow to waxing unless specified as piercing
    'facial': 'spa',         // Default facial to spa unless specified as waxing
    'lip': 'waxing',         // Default lip to waxing unless specified as piercing
    'massage': 'spa',        // Default massage to spa
    'belly': 'piercing',     // Default belly/navel to piercing
    'bellybutton': 'piercing', // Alternative name for navel piercing
    'navel': 'piercing',     // Another name for belly piercing
    'body': 'spa',           // Default body treatments to spa unless specified
    'face': 'spa',           // Default face treatments to spa
    'ear': 'piercing',       // Default ear services to piercing
    'nose': 'piercing',      // Default nose services to piercing
    'brow': 'waxing',        // Alternative for eyebrow
    'hand': 'nails',         // Default hand treatments to nails
    'foot': 'nails',         // Default foot treatments to nails
    'feet': 'nails',         // Plural of foot
    'hair': 'hair',          // Default hair treatments to hair service
    'beard': 'barber',       // Default beard services to barber
    'skin': 'spa',          // Default skin treatments to spa
    'sleeve': 'tattoo',     // Sleeve tattoo
    'arm': 'tattoo',        // Arm tattoo
    'leg': 'tattoo',        // Leg tattoo
    'back': 'tattoo',       // Back tattoo
    'chest': 'tattoo',      // Chest tattoo
    'small': 'tattoo',      // Small tattoo
    'medium': 'tattoo',     // Medium tattoo
    'large': 'tattoo',      // Large tattoo
    'custom': 'tattoo'      // Custom tattoo
  };

      // Map specific services to general categories
    const serviceCategories = {
      // Makeup services
      'softglam': 'makeup',
      'glam': 'makeup',
      'naturalmakeup': 'makeup',
      'bridalmakeup': 'makeup',
      'eveningmakeup': 'makeup',
      'partymakeup': 'makeup',
      'makeupapplication': 'makeup',
      'makeupconsultation': 'makeup',
      'makeupremoval': 'makeup',
      'specialeffects': 'makeup',
      'airbrush': 'makeup',
      'lashes': 'makeup',
      'lashlift': 'makeup',
      'lashextensions': 'makeup',
      'browlamination': 'makeup',
      'browtint': 'makeup',
      'lashtint': 'makeup',
      'photoready': 'makeup',
      'stagemakeup': 'makeup',
      'halloween': 'makeup',
      'cosplay': 'makeup',
      'contour': 'makeup',
      
      // Hair services
      'hair': 'hair',
      'braids': 'hair',
      'haircut': 'hair',
      'coloring': 'hair',
      'styling': 'hair',
      'cornrows': 'hair',
      'dreadlocks': 'hair',
      'weaving': 'hair',
      'extensions': 'hair',
      'blowdry': 'hair',
      'trim': 'hair',
      'boxbraids': 'hair',
      'twistbraids': 'hair',
      'senegalese': 'hair',
      'fulseweave': 'hair',
      'closure': 'hair',
      'frontal': 'hair',
      'highlights': 'hair',
      'balayage': 'hair',
      'ombre': 'hair',
      'relaxer': 'hair',
      'perm': 'hair',
      'keratin': 'hair',
      'deepconditioning': 'hair',
      'silkpress': 'hair',
      'naturalhair': 'hair',
      'crochetbraids': 'hair',
      'microbraids': 'hair',
      'passion': 'hair',
      'knotless': 'hair',
      'goddessbraids': 'hair',
      'feedinbraids': 'hair',
      'protectivestyling': 'hair',
      'haircutting': 'hair',
      'haircoloring': 'hair',
      'hairstyling': 'hair',
      'hairtreatment': 'hair',
      'haircare': 'hair',
      'hairwash': 'hair',
      'hairblowdry': 'hair',
      'hairtrim': 'hair',
    
    // Nail services
    'nails': 'nails',
    'nail': 'nails',
    'manicure': 'nails',
    'pedicure': 'nails',
    'nailart': 'nails',
    'gelnails': 'nails',
    'acrylicnails': 'nails',
    'naildesign': 'nails',
    'nailpolish': 'nails',
    'nailremoval': 'nails',
    'shellac': 'nails',
    'dippowder': 'nails',
    'nailfill': 'nails',
    'nailrepair': 'nails',
    'frenchmani': 'nails',
    'frenchpedi': 'nails',
    'gelpolish': 'nails',
    'polygel': 'nails',
    'pressons': 'nails',
    'nailextensions': 'nails',
    'acrylicfill': 'nails',
    'nailsoak': 'nails',
    'nailtreatment': 'nails',
    'handcare': 'nails',
    'footcare': 'nails',
    'nailcare': 'nails',
    'nailservice': 'nails',
    'nailservices': 'nails',
    'nailartdesign': 'nails',
    'nailartwork': 'nails',
    'naildesigns': 'nails',
    'nailpolishing': 'nails',
    'nailfilling': 'nails',
    'nailrepairing': 'nails',
    'nailsoaking': 'nails',
    'nailtreating': 'nails',
    'handcaring': 'nails',
    'footcaring': 'nails',
    'nailcaring': 'nails',
    
    // Spa services
    'spa': 'spa',
    'massage': 'spa',
    'bodymassage': 'spa',
    'fullbodymassage': 'spa',
    'backrub': 'spa',
    'facial': 'spa',
    'facemask': 'spa',
    'bodywrap': 'spa',
    'bodyscrub': 'spa',
    'spatreatment': 'spa',
    'spatreatments': 'spa',
    'spaservice': 'spa',
    'spaservices': 'spa',
    'spacare': 'spa',
    'spatherapy': 'spa',
    'spatherapies': 'spa',
    'spamassage': 'spa',
    'spafacial': 'spa',
    'spabody': 'spa',
    'spatreatment': 'spa',
    'spatreatments': 'spa',
    'spaservice': 'spa',
    'spaservices': 'spa',
    'spacare': 'spa',
    'spatherapy': 'spa',
    'spatherapies': 'spa',
    'spamassage': 'spa',
    'spafacial': 'spa',
    'spabody': 'spa',
    'deepcleansing': 'spa',
    'hotstone': 'spa',
    'aromatherapy': 'spa',
    'reflexology': 'spa',
    'swedishmassage': 'spa',
    'deeptissue': 'spa',
    'sportsmassage': 'spa',
    'prenatal': 'spa',
    'couples': 'spa',
    'hydrafacial': 'spa',
    'microdermabrasion': 'spa',
    'chemicalpeel': 'spa',
    'acnetreatment': 'spa',
    'antiaging': 'spa',
    'led': 'spa',
    'oxygen': 'spa',
    'lymphatic': 'spa',
    'cupping': 'spa',
    'scrub': 'spa',
    'mud': 'spa',
    'seaweed': 'spa',
    'collagen': 'spa',
    'microneedling': 'spa',
    
    // Makeup services
    'makeup': 'makeup',
    'beauty': 'makeup',
    'cosmetic': 'makeup',
    'cosmetics': 'makeup',
    'beautymakeup': 'makeup',
    'beautymakeupapplication': 'makeup',
    'beautymakeupconsultation': 'makeup',
    'beautymakeupremoval': 'makeup',
    'beautymakeuptreatment': 'makeup',
    'beautymakeupservice': 'makeup',
    'beautymakeupservices': 'makeup',
    'makeupapplication': 'makeup',
    'bridalmakeup': 'makeup',
    'makeupconsultation': 'makeup',
    'eveningmakeup': 'makeup',
    'partymakeup': 'makeup',
    'makeupremoval': 'makeup',
    'specialeffects': 'makeup',
    'airbrush': 'makeup',
    'lashes': 'makeup',
    'lashlift': 'makeup',
    'lashextensions': 'makeup',
    'browlamination': 'makeup',
    'browtint': 'makeup',
    'lashtint': 'makeup',
    'naturalmakeup': 'makeup',
    'glammakeup': 'makeup',
    'photoready': 'makeup',
    'stagemakeup': 'makeup',
    'halloween': 'makeup',
    'cosplay': 'makeup',
    'contour': 'makeup',
    
    // Barber services
    'barber': 'barber',
    'fade': 'barber',
    'beardtrim': 'barber',
    'lineup': 'barber',
    'shave': 'barber',
    'hairtrim': 'barber',
    'buzzcut': 'barber',
    'taperfade': 'barber',
    'skinfade': 'barber',
    'design': 'barber',
    'mohawk': 'barber',
    'fauxhawk': 'barber',
    'crewcut': 'barber',
    'highfade': 'barber',
    'lowfade': 'barber',
    'midfade': 'barber',
    'templefade': 'barber',
    'hotshave': 'barber',
    'razorshave': 'barber',
    'beardshape': 'barber',
    'bearddesign': 'barber',
    'neckline': 'barber',
    'edgeup': 'barber',
    'pompadour': 'barber',
    'texturecut': 'barber',
    'barberservice': 'barber',
    'barberservices': 'barber',
    'barbercut': 'barber',
    'barbercuts': 'barber',
    'barbertrim': 'barber',
    'barbertrims': 'barber',
    'barbershave': 'barber',
    'barbershaves': 'barber',
    'barberfade': 'barber',
    'barberfades': 'barber',
    'barberlineup': 'barber',
    'barberlineups': 'barber',
    'barberdesign': 'barber',
    'barberdesigns': 'barber',
    'barberstyle': 'barber',
    'barberstyles': 'barber',
    'barbercutting': 'barber',
    'barbertrimming': 'barber',
    'barbershaving': 'barber',
    'barberfading': 'barber',
    'barberlining': 'barber',
    'barberdesigning': 'barber',
    'barberstyling': 'barber',
    
    // Waxing services
    'wax': 'waxing',
    'waxing': 'waxing',
    'legwax': 'waxing',
    'armwax': 'waxing',
    'facialwax': 'waxing',
    'bodywax': 'waxing',
    'bikini': 'waxing',
    'brazilian': 'waxing',
    'manzilian': 'waxing',
    'manscaping': 'waxing',
    'malebrazilian': 'waxing',
    'malebrazilianwax': 'waxing',
    'malebrazilianwaxing': 'waxing',
    'malebodywax': 'waxing',
    'malebodywaxing': 'waxing',
    'malewax': 'waxing',
    'malewaxing': 'waxing',
    'eyebrow': 'waxing',
    'eyebrows': 'waxing',
    'eyebrowwax': 'waxing',
    'browwax': 'waxing',
    'eyebrowshaping': 'waxing',
    'eyebrowtinting': 'waxing',
    'eyebrowthreading': 'waxing',
    'lipwax': 'waxing',
    'fullbodywax': 'waxing',
    'backwax': 'waxing',
    'chestwax': 'waxing',
    'underarm': 'waxing',
    'hollywood': 'waxing',
    'stripwax': 'waxing',
    'hotwax': 'waxing',
    'sugarwax': 'waxing',
    'threading': 'waxing',
    'leg': 'waxing',
    'arm': 'waxing',
    'chest': 'waxing',
    'back': 'waxing',
    'stomach': 'waxing',
    'abdomen': 'waxing',
    'belly': 'waxing',
    'stomachwax': 'waxing',
    'abdomenwax': 'waxing',
    'bellywax': 'waxing',
    'chesthair': 'waxing',
    'backhair': 'waxing',
    'stomachhair': 'waxing',
    'abdomenhair': 'waxing',
    'bellyhair': 'waxing',
    'bodyhair': 'waxing',
    'bodyhairremoval': 'waxing',
    'hairremoval': 'waxing',
    'unwantedhair': 'waxing',
    'hairremovalwax': 'waxing',
    'waxingremoval': 'waxing',
    'hairwaxing': 'waxing',
    'bodywaxing': 'waxing',
    'facialwaxing': 'waxing',
    'legwaxing': 'waxing',
    'armwaxing': 'waxing',
    'chestwaxing': 'waxing',
    'backwaxing': 'waxing',
    'stomachwaxing': 'waxing',
    'abdomenwaxing': 'waxing',
    'bellywaxing': 'waxing',
    
    // Piercing services
    'piercing': 'piercing',
    'pierce': 'piercing',
    'earpiercing': 'piercing',
    'nosepiercing': 'piercing',
    'navelpiercing': 'piercing',
    'bellybutton': 'piercing',
    'bellypiercing': 'piercing',
    'bellyringpiercing': 'piercing',
    'naveljewelry': 'piercing',
    'bellyring': 'piercing',
    'navel': 'piercing',
    'navelring': 'piercing',
    'eyebrowpiercing': 'piercing',
    'browpiercing': 'piercing',
    'lippiercing': 'piercing',
    'tonguepierce': 'piercing',
    'industrial': 'piercing',
    'helix': 'piercing',
    'tragus': 'piercing',
    'rook': 'piercing',
    'conch': 'piercing',
    'daith': 'piercing',
    'septum': 'piercing',
    'monroe': 'piercing',
    'madonna': 'piercing',
    'snakebites': 'piercing',
    'bridge': 'piercing',
    'dermal': 'piercing',
    'surface': 'piercing',
    'piercingservice': 'piercing',
    'piercingservices': 'piercing',
    'piercingjewelry': 'piercing',
    'piercingjewelries': 'piercing',
    'piercingring': 'piercing',
    'piercingrings': 'piercing',
    'piercingstud': 'piercing',
    'piercingstuds': 'piercing',
    'piercingbarbell': 'piercing',
    'piercingbarbells': 'piercing',
    'piercinghoop': 'piercing',
    'piercinghoops': 'piercing',
    'piercingjewelry': 'piercing',
    'piercingjewelries': 'piercing',
    'piercingring': 'piercing',
    'piercingrings': 'piercing',
    'piercingstud': 'piercing',
    'piercingstuds': 'piercing',
    'piercingbarbell': 'piercing',
    'piercingbarbells': 'piercing',
    'piercinghoop': 'piercing',
    'piercinghoops': 'piercing',
    
    // Tattoo services
    'tattoo': 'tattoo',
    'customtattoo': 'tattoo',
    'tattoodesign': 'tattoo',
    'tattooremoval': 'tattoo',
    'coverup': 'tattoo',
    'smalltattoo': 'tattoo',
    'largetattoo': 'tattoo',
    'blackwork': 'tattoo',
    'colortattoo': 'tattoo',
    'traditional': 'tattoo',
    'japanese': 'tattoo',
    'tribal': 'tattoo',
    'realism': 'tattoo',
    'watercolor': 'tattoo',
    'minimalist': 'tattoo',
    'geometric': 'tattoo',
    'portraittattoo': 'tattoo',
    'lettering': 'tattoo',
    'scripttattoo': 'tattoo',
    'tattooservice': 'tattoo',
    'tattooservices': 'tattoo',
    'tattooart': 'tattoo',
    'tattooartist': 'tattoo',
    'tattooartists': 'tattoo',
    'tattooshop': 'tattoo',
    'tattooshops': 'tattoo',
    'tattoostudio': 'tattoo',
    'tattoostudios': 'tattoo',
    'tattooparlor': 'tattoo',
    'tattooparlors': 'tattoo',
    'tattoodesign': 'tattoo',
    'tattoodesigns': 'tattoo',
    'tattooremoval': 'tattoo',
    'tattooremovals': 'tattoo',
    'tattoocoverup': 'tattoo',
    'tattoocoverups': 'tattoo',
    'tattoosmall': 'tattoo',
    'tattoolarge': 'tattoo',
    'tattooblackwork': 'tattoo',
    'tattoocolor': 'tattoo',
    'tattootraditional': 'tattoo',
    'tattoojapanese': 'tattoo',
    'tattootribal': 'tattoo',
    'tattoorealism': 'tattoo',
    'tattoowatercolor': 'tattoo',
    'tattoominimalist': 'tattoo',
    'tattoogeometric': 'tattoo',
    'tattooportrait': 'tattoo',
    'tattoolettering': 'tattoo',
    'tattooscript': 'tattoo',
    'floraltattoo': 'tattoo',
    'mandala': 'tattoo',
    'sacredgeometry': 'tattoo',
    'handpoked': 'tattoo',
    'lasertattooremoval': 'tattoo'
  };

  // Normalize the service name by removing spaces and converting to lowercase
  const normalizedService = service.toLowerCase().replace(/\s+/g, '');
  console.log('Normalized service:', normalizedService);
  
  // Find all potential base services that match
  const baseServices = Object.keys(defaultCategories)
    .filter(key => normalizedService.includes(key))
    .sort((a, b) => b.length - a.length); // Sort by length to get most specific match first
  
  // Check if service directly exists in serviceCategories
  const directMatch = serviceCategories[normalizedService];
  
  // Get the general category if it exists, or use default category, or use normalized service
  const serviceToMatch = directMatch || 
                        (baseServices.length > 0 && defaultCategories[baseServices[0]]) || 
                        normalizedService;
                        
  console.log('Base services found:', baseServices);
  console.log('Direct match found:', directMatch);
  console.log('Service to match:', serviceToMatch);
  
  // Log all available specialties
  console.log('Available staff and their specialties:');
  staffData.forEach(staff => {
    console.log(`${staff.name}: ${staff.specialties}`);
  });
  
  const eligible = staffData.filter(staff => {
    // Normalize specialties by removing spaces and converting to lowercase
    const specialties = staff.specialties.split(',').map(s => s.trim().toLowerCase().replace(/\s+/g, ''));
    console.log(`Checking staff ${staff.name} with specialties:`, specialties);
    
    const isEligible = specialties.some(specialty => {
      // Try exact match first
      if (specialty === serviceToMatch) return true;
      
      // Then check if the specialty contains the service or vice versa
      if (specialty.includes(serviceToMatch) || serviceToMatch.includes(specialty)) return true;
      
      // Finally check if it's a plural form (e.g., 'nails' matches 'nail' services)
      if (specialty.endsWith('s') && serviceToMatch.startsWith(specialty.slice(0, -1))) return true;
      if (serviceToMatch.endsWith('s') && specialty.startsWith(serviceToMatch.slice(0, -1))) return true;
      
      // Additional matching for common variations
      if (specialty === 'makeup' && (serviceToMatch === 'makeup' || serviceToMatch.includes('glam'))) return true;
      if (specialty === 'hair' && serviceToMatch === 'hair') return true;
      if (specialty === 'nails' && serviceToMatch === 'nails') return true;
      if (specialty === 'spa' && serviceToMatch === 'spa') return true;
      if (specialty === 'waxing' && serviceToMatch === 'waxing') return true;
      if (specialty === 'piercing' && serviceToMatch === 'piercing') return true;
      if (specialty === 'tattoo' && serviceToMatch === 'tattoo') return true;
      if (specialty === 'barber' && serviceToMatch === 'barber') return true;
      
      return false;
    });
    console.log(`${staff.name} eligible:`, isEligible);
    return isEligible;
  });
  
  console.log('Eligible staff:', eligible.map(staff => staff.name));
  
  if (eligible.length === 0) {
    // Fallback: try to find any staff that might be suitable based on the category
    console.log('No exact match found, trying fallback assignment...');
    
    // Try to find staff based on the service category
    const categoryMappings = {
      'makeup': ['makeup', 'glam', 'beauty'],
      'hair': ['hair', 'styling', 'cutting'],
      'nails': ['nails', 'manicure', 'pedicure'],
      'spa': ['spa', 'massage', 'facial', 'body'],
      'waxing': ['waxing', 'wax', 'hair removal'],
      'piercing': ['piercing', 'pierce'],
      'tattoo': ['tattoo', 'ink'],
      'barber': ['barber', 'cut', 'trim', 'shave']
    };
    
    // Find the category for this service
    let serviceCategory = null;
    for (const [category, keywords] of Object.entries(categoryMappings)) {
      if (keywords.some(keyword => 
        normalizedService.includes(keyword) || 
        serviceToMatch.includes(keyword) ||
        service.toLowerCase().includes(keyword)
      )) {
        serviceCategory = category;
        break;
      }
    }
    
    console.log('Detected service category:', serviceCategory);
    
    if (serviceCategory) {
      // Find staff with this category
      const categoryStaff = staffData.filter(staff => 
        staff.specialties.toLowerCase().includes(serviceCategory)
      );
      
      if (categoryStaff.length > 0) {
        console.log(`Found ${serviceCategory} staff via fallback:`, categoryStaff.map(s => s.name));
        return categoryStaff[Math.floor(Math.random() * categoryStaff.length)].name;
      }
    }
    
    // Last resort: find any staff that might be suitable
    const allStaff = staffData.filter(staff => 
      staff.specialties.toLowerCase().includes(serviceToMatch) ||
      staff.specialties.toLowerCase().includes(normalizedService) ||
      staff.specialties.toLowerCase().includes(service.toLowerCase())
    );
    
    if (allStaff.length > 0) {
      console.log('Found staff via last resort fallback:', allStaff.map(s => s.name));
      return allStaff[Math.floor(Math.random() * allStaff.length)].name;
    }
    
    console.log('No staff found even with fallback');
    return null;
  }
  
  return eligible[Math.floor(Math.random() * eligible.length)].name;
}// POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    console.log('Received booking request:', req.body);
    const { fullName, phone, service, dateTime, userId, category, staff: requestedStaff } = req.body;
    
    if (!service) {
      return res.status(400).json({ message: 'Service is required' });
    }
    
    if (!fullName || !phone || !dateTime) {
      return res.status(400).json({ message: 'Name, phone, and date/time are required' });
    }
    
    if (!userId) {
      return res.status(400).json({ message: 'Please login to make a booking' });
    }
    
    // Convert string userId to ObjectId if it's a string
    let userObjectId;
    try {
      const mongoose = require('mongoose');
      userObjectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
    } catch (error) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    let staff = requestedStaff;
    if (staff) {
      // Validate requested staff is eligible and not double-booked at that time
      const eligible = getEligibleStaff(service).map(s => s.name);
      if (!eligible.includes(staff)) {
        return res.status(400).json({ message: 'Selected staff is not available for this service.' });
      }
      // Check for booking conflict using service-specific duration
      const desired = new Date(dateTime);
      const serviceDuration = getServiceDuration(service);
      const conflict = await BookingModel.findOne({
        staff,
        dateTime: {
          $gte: new Date(desired.getTime() - serviceDuration * 60000),
          $lt: new Date(desired.getTime() + serviceDuration * 60000)
        }
      });
      if (conflict) {
        return res.status(409).json({ message: 'Selected time is no longer available. Please pick another slot.' });
      }
    } else {
      console.log('Looking for staff with service:', service);
      staff = assignRandomStaff(service);
      console.log('Assigned staff (auto):', staff);
      if (!staff) return res.status(400).json({ message: 'No staff available for this service.' });
    }
    
    const price = getServicePrice(service) || 1000; // Default price if not found
    const serviceCategory = category || 'general';
    
    const bookingData = { 
      fullName, 
      phone, 
      service, 
      staff, 
      dateTime: new Date(dateTime),
      price,
      category: serviceCategory,
      userId: userObjectId
    };
    
    console.log('Creating booking with data:', bookingData);
    const booking = new BookingModel(bookingData);
    await booking.save();
    
    console.log('Booking created successfully:', booking);
    // Send confirmation email and schedule reminder
    try {
      const dbUser = await User.findById(userObjectId).lean();
      if (dbUser && dbUser.email) {
        await sendBookingConfirmationEmail(dbUser, booking);
        scheduleBookingReminderEmail(dbUser, booking);
      }
    } catch (mailErr) {
      console.error('Email dispatch error (booking):', mailErr.message);
    }
    res.status(201).json({
      booking,
      message: 'Booking successful! You can view your booking in the cart.',
      success: true
    });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ message: 'Error creating booking', error: err.message });
  }
};

// Send immediate confirmation email
async function sendBookingConfirmationEmail(user, booking) {
  const when = new Date(booking.dateTime);
  const prettyWhen = when.toLocaleString();
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Booking Confirmed - GlowSlot</title>
      <style>
        body{font-family:Segoe UI,Tahoma,Verdana,sans-serif;line-height:1.6;color:#333;background:#f8f9fa;padding:20px}
        .container{max-width:640px;margin:0 auto;background:#fff;border-radius:12px;box-shadow:0 4px 10px rgba(0,0,0,0.06);padding:28px}
        .logo{font-size:24px;font-weight:800;color:#e91e63;margin-bottom:10px}
        .title{font-size:20px;font-weight:700;color:#2d3748;margin:10px 0}
        .pill{display:inline-block;background:#e91e63;color:#fff;border-radius:999px;padding:6px 12px;font-weight:600}
        .meta{margin:14px 0}
        .meta div{margin:6px 0}
        .footer{margin-top:24px;color:#718096;font-size:13px}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">✨ GlowSlot</div>
        <div class="title">Your booking is confirmed</div>
        <p>Hi ${user.name || 'there'},</p>
        <p>Thanks for booking with GlowSlot. Here are your appointment details:</p>
        <div class="meta">
          <div><strong>Service:</strong> ${booking.service}</div>
          <div><strong>Staff:</strong> ${booking.staff}</div>
          <div><strong>Date & Time:</strong> ${prettyWhen}</div>
          <div><strong>Price:</strong> KSH ${booking.price}</div>
          <div><span class="pill">Status: ${booking.status || 'pending'}</span></div>
        </div>
        <p>You will receive a reminder before your appointment.</p>
        <div class="footer">© 2025 GlowSlot. All rights reserved.</div>
      </div>
    </body>
    </html>`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'GlowSlot - Booking confirmed',
    html,
  });
}

// Schedule reminder email ~2 hours before the appointment (in-memory timer)
function scheduleBookingReminderEmail(user, booking, leadMs = 2 * 60 * 60 * 1000) {
  const when = new Date(booking.dateTime).getTime();
  const now = Date.now();
  const delay = when - now - leadMs;
  // Only schedule if delay is in the future and less than 30 days
  if (delay > 0 && delay < 30 * 24 * 60 * 60 * 1000) {
    setTimeout(async () => {
      try {
        const html = `
          <!DOCTYPE html>
          <html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Appointment Reminder - GlowSlot</title>
          <style>body{font-family:Segoe UI,Tahoma,Verdana,sans-serif;line-height:1.6;color:#333;background:#f8f9fa;padding:20px}.container{max-width:640px;margin:0 auto;background:#fff;border-radius:12px;box-shadow:0 4px 10px rgba(0,0,0,0.06);padding:28px}.logo{font-size:24px;font-weight:800;color:#e91e63;margin-bottom:10px}.title{font-size:20px;font-weight:700;color:#2d3748;margin:10px 0}.meta div{margin:6px 0}.footer{margin-top:24px;color:#718096;font-size:13px}</style>
          </head><body>
          <div class="container">
            <div class="logo">✨ GlowSlot</div>
            <div class="title">Appointment Reminder</div>
            <p>Hi ${user.name || 'there'}, this is a friendly reminder for your upcoming appointment:</p>
            <div class="meta">
              <div><strong>Service:</strong> ${booking.service}</div>
              <div><strong>Staff:</strong> ${booking.staff}</div>
              <div><strong>Date & Time:</strong> ${new Date(booking.dateTime).toLocaleString()}</div>
            </div>
            <p>Please arrive a few minutes early. We look forward to seeing you!</p>
            <div class="footer">© 2025 GlowSlot. All rights reserved.</div>
          </div>
          </body></html>`;

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'GlowSlot - Appointment reminder',
          html,
        });
      } catch (e) {
        console.error('Reminder email error:', e.message);
      }
    }, delay);
  }
}

// Send completion/thank-you email
async function sendBookingCompletionEmail(user, booking) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Thank You - GlowSlot</title>
      <style>
        body{font-family:Segoe UI,Tahoma,Verdana,sans-serif;line-height:1.6;color:#333;background:#f8f9fa;padding:20px}
        .container{max-width:640px;margin:0 auto;background:#fff;border-radius:12px;box-shadow:0 4px 10px rgba(0,0,0,0.06);padding:28px}
        .logo{font-size:24px;font-weight:800;color:#e91e63;margin-bottom:10px}
        .title{font-size:20px;font-weight:700;color:#2d3748;margin:10px 0}
        .meta div{margin:6px 0}
        .footer{margin-top:24px;color:#718096;font-size:13px}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">✨ GlowSlot</div>
        <div class="title">Thanks for visiting!</div>
        <p>Hi ${user.name || 'there'},</p>
        <p>Your ${booking.service} appointment with ${booking.staff} is now marked as <strong>completed</strong>. We hope you enjoyed the service!</p>
        <div class="meta">
          <div><strong>Date & Time:</strong> ${new Date(booking.dateTime).toLocaleString()}</div>
          <div><strong>Service:</strong> ${booking.service}</div>
        </div>
        <p>We’d love your feedback — please leave a review on the Reviews page to help others.</p>
        <div class="footer">© 2025 GlowSlot. All rights reserved.</div>
      </div>
    </body>
    </html>`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'GlowSlot - Thank you for your visit',
    html,
  });
}

// GET /api/bookings/cart?userId=...
exports.getCartBookings = async (req, res) => {
  try {
    const { userId } = req.query;
    const bookings = await BookingModel.find({ userId, status: 'pending' });
    
    // Add balance information to each booking
    const bookingsWithBalance = bookings.map(booking => {
      const balanceInfo = calculateBookingBalance(booking);
      return {
        ...booking.toObject(),
        ...balanceInfo
      };
    });
    
    res.json(bookingsWithBalance);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart bookings', error: err.message });
  }
};

// Delete a booking (for pending bookings only)
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await BookingModel.findByIdAndDelete(id);
    
    if (!result) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error cancelling booking', error: err.message });
  }
};

// Cancel an appointment (for confirmed/paid appointments)
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // Convert string userId to ObjectId
    const mongoose = require('mongoose');
    let userObjectId;
    try {
      userObjectId = new mongoose.Types.ObjectId(userId);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    // Find the booking and verify ownership
    const booking = await BookingModel.findById(id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Verify the user owns this booking
    if (booking.userId.toString() !== userObjectId.toString()) {
      return res.status(403).json({ message: 'You can only cancel your own appointments' });
    }
    
    // Check if the appointment can be cancelled
    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed appointments' });
    }
    
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Appointment is already cancelled' });
    }
    
    // Update the status to cancelled
    booking.status = 'cancelled';
    await booking.save();
    
    // Send cancellation email if user has email
    try {
      const user = await User.findById(userObjectId).lean();
      if (user && user.email) {
        await sendCancellationEmail(user, booking);
      }
    } catch (mailErr) {
      console.error('Cancellation email error:', mailErr.message);
    }
    
    res.status(200).json({ 
      message: 'Appointment cancelled successfully',
      booking: {
        ...booking.toObject(),
        ...calculateBookingBalance(booking)
      }
    });
  } catch (err) {
    console.error('Error cancelling appointment:', err);
    res.status(500).json({ message: 'Error cancelling appointment', error: err.message });
  }
};



// Get order history for a user (all non-pending bookings)
exports.getOrderHistory = async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // Convert string userId to ObjectId
    const mongoose = require('mongoose');
    let userObjectId;
    try {
      userObjectId = new mongoose.Types.ObjectId(userId);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    // Get all bookings except pending ones (paid, confirmed, completed, cancelled)
    const orderHistory = await BookingModel.find({ 
      userId: userObjectId, 
      status: { $ne: 'pending' } 
    }).sort({ createdAt: -1 }); // Sort by newest first
    
    // Add balance information to each booking
    const orderHistoryWithBalance = orderHistory.map(booking => {
      const balanceInfo = calculateBookingBalance(booking);
      return {
        ...booking.toObject(),
        ...balanceInfo
      };
    });
    
    res.json(orderHistoryWithBalance);
  } catch (err) {
    console.error('Error fetching order history:', err);
    res.status(500).json({ message: 'Error fetching order history', error: err.message });
  }
};

// Send cancellation email
async function sendCancellationEmail(user, booking) {
  const when = new Date(booking.dateTime);
  const prettyWhen = when.toLocaleString();
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>GlowSlot - Appointment Cancelled</title>
      <style>
        body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;margin:0;padding:20px;background:#f7fafc}
        .container{max-width:640px;margin:0 auto;background:#fff;border-radius:12px;box-shadow:0 4px 10px rgba(0,0,0,0.06);padding:28px}
        .logo{font-size:24px;font-weight:800;color:#e91e63;margin-bottom:10px}
        .title{font-size:20px;font-weight:700;color:#2d3748;margin:10px 0}
        .meta div{margin:6px 0}
        .footer{margin-top:24px;color:#718096;font-size:13px}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">✨ GlowSlot</div>
        <div class="title">Appointment Cancelled</div>
        <p>Hi ${user.name || 'there'},</p>
        <p>Your ${booking.service} appointment with ${booking.staff} has been <strong>cancelled</strong> as requested.</p>
        <div class="meta">
          <div><strong>Original Date & Time:</strong> ${new Date(booking.dateTime).toLocaleString()}</div>
          <div><strong>Service:</strong> ${booking.service}</div>
          <div><strong>Staff:</strong> ${booking.staff}</div>
        </div>
        <p>If you'd like to reschedule, please visit our website to book a new appointment.</p>
        <p>Thank you for choosing GlowSlot!</p>
        <div class="footer">© 2025 GlowSlot. All rights reserved.</div>
      </div>
    </body>
    </html>`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'GlowSlot - Appointment Cancelled',
    html,
  });
} 
