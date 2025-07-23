const BookingModel = require('../models/Booking');
const { getServicePrice } = require('../data/servicePrices');
const User = require('../models/User');
const staffData = require('../data/staffData');

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

    if (!status || !['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
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

    // Update all pending bookings for this user
    const result = await BookingModel.updateMany(
      { 
        userId: userObjectId, 
        status: 'pending'  // Only update pending bookings
      },
      { 
        $set: { 
          status: status,
          dateTime: status === 'confirmed' ? new Date() : undefined
        } 
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'No pending bookings found for this user' });
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
    // Hair services
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
    
    // Nail services
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
    
    // Spa services
    'massage': 'spa',
    'bodymassage': 'spa',
    'fullbodymassage': 'spa',
    'backrub': 'spa',
    'facial': 'spa',
    'facemask': 'spa',
    'bodywrap': 'spa',
    'bodyscrub': 'spa',
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
    
    // Waxing services
    'wax': 'waxing',
    'legwax': 'waxing',
    'armwax': 'waxing',
    'facialwax': 'waxing',
    'bodywax': 'waxing',
    'bikini': 'waxing',
    'brazilian': 'waxing',
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
    
    // Piercing services
    'piercing': 'piercing',
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
      
      return false;
    });
    console.log(`${staff.name} eligible:`, isEligible);
    return isEligible;
  });
  
  console.log('Eligible staff:', eligible.map(staff => staff.name));
  
  if (eligible.length === 0) return null;
  return eligible[Math.floor(Math.random() * eligible.length)].name;

}
// POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    console.log('Received booking request:', req.body);
    const { fullName, phone, service, dateTime, userId, category } = req.body;
    
    if (!service) {
      return res.status(400).json({ message: 'Service is required' });
    }
    
    if (!fullName || !phone || !dateTime) {
      return res.status(400).json({ message: 'Name, phone, and date/time are required' });
    }
    
    if (!userId) {
      return res.status(400).json({ message: 'Please login to make a booking' });
    }
    
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    // Convert string userId to ObjectId if it's a string
    let userObjectId;
    try {
      const mongoose = require('mongoose');
      userObjectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
    } catch (error) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    console.log('Looking for staff with service:', service);
    const staff = assignRandomStaff(service);
    console.log('Assigned staff:', staff);
    
    if (!staff) return res.status(400).json({ message: 'No staff available for this service.' });
    
    const price = getServicePrice(service) || 1000; // Default price if not found


    const bookingData = { 
      fullName, 
      phone, 
      service, 
      staff, 
      dateTime: new Date(dateTime),
      price,

      category,
      userId: userObjectId
    };
    
    console.log('Creating booking with data:', bookingData);
    const booking = new BookingModel(bookingData);
    await booking.save();
    
    console.log('Booking created successfully:', booking);
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

// GET /api/bookings/cart?userId=...
exports.getCartBookings = async (req, res) => {
  try {
    const { userId } = req.query;

    const bookings = await BookingModel.find({ userId, status: 'pending' });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart bookings', error: err.message });
  }
};

// Delete a booking
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











