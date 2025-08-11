const servicePrices = {
  // Hair Services
  'Haircut': 1000,
  'Hair Styling': 1500,
  'Hair Coloring': 3000,
  'Hair Treatment': 2000,

  // Nail Services
  'Manicure': 800,
  'Pedicure': 1000,
  'Nail Art': 500,
  'Gel Polish': 1200,

  // Spa Services
  'Full body massage': 2500,
  'Facial': 1500,
  'Body Scrub': 2000,
  'Hot Stone Massage': 3000,

  // Waxing Services
  'Full Body Wax': 3500,
  'Leg Waxing': 1000,
  'Arm Waxing': 800,
  'Face Waxing': 500,

  // Makeup Services
  'Full Face Makeup': 2000,
  'Bridal Makeup': 5000,
  'Eye Makeup': 800,

  // Barber Services
  'Beard Grooming': 500,
  'Men\'s Haircut': 800,
  'Shave': 400,

  // Piercing Services
  'Ear Piercing': 1000,
  'Nose Piercing': 1500,
  'Navel Piercing': 2000,

  // Tattoo Services
  'Small Tattoo': 2000,
  'Medium Tattoo': 4000,
  'Large Tattoo': 8000,

  // Default prices for general categories
  'Hair': 1500,
  'Nails': 1000,
  'Spa': 2500,
  'Waxing': 1500,
  'Makeup': 2000,
  'Barber': 800,
  'Piercing': 1500,
  'Tattoo': 4000
};

// Service durations in minutes
const serviceDurations = {
  // Hair Services - longer durations
  'Haircut': 60,
  'Hair Styling': 90,
  'Hair Coloring': 180, // 3 hours
  'Hair Treatment': 120, // 2 hours

  // Nail Services - moderate durations
  'Manicure': 45,
  'Pedicure': 60,
  'Nail Art': 30,
  'Gel Polish': 75,

  // Spa Services - longer durations
  'Full body massage': 90,
  'Facial': 60,
  'Body Scrub': 75,
  'Hot Stone Massage': 120,

  // Waxing Services - moderate durations
  'Full Body Wax': 120,
  'Leg Waxing': 45,
  'Arm Waxing': 30,
  'Face Waxing': 20,

  // Makeup Services - longer durations
  'Full Face Makeup': 90,
  'Bridal Makeup': 180, // 3 hours
  'Eye Makeup': 30,

  // Barber Services - shorter durations
  'Beard Grooming': 30,
  'Men\'s Haircut': 45,
  'Shave': 20,

  // Piercing Services - moderate durations
  'Ear Piercing': 30,
  'Nose Piercing': 45,
  'Navel Piercing': 60,

  // Tattoo Services - longest durations
  'Small Tattoo': 60,
  'Medium Tattoo': 180, // 3 hours
  'Large Tattoo': 300, // 5 hours

  // Default durations for general categories
  'Hair': 120, // 2 hours average
  'Nails': 60, // 1 hour average
  'Spa': 90, // 1.5 hours average
  'Waxing': 60, // 1 hour average
  'Makeup': 90, // 1.5 hours average
  'Barber': 45, // 45 minutes average
  'Piercing': 45, // 45 minutes average
  'Tattoo': 180 // 3 hours average
};

module.exports = {
  getServicePrice: (service) => {
    // Try to find exact match first
    if (servicePrices[service]) {
      return servicePrices[service];
    }

    // If no exact match, try to match with a category
    const serviceLower = service.toLowerCase();
    for (const [key, price] of Object.entries(servicePrices)) {
      if (serviceLower.includes(key.toLowerCase())) {
        return price;
      }
    }

    // Default price if no match found
    return 1000;
  },

  getServiceDuration: (service) => {
    // Try to find exact match first
    if (serviceDurations[service]) {
      return serviceDurations[service];
    }

    // If no exact match, try to match with a category
    const serviceLower = service.toLowerCase();
    for (const [key, duration] of Object.entries(serviceDurations)) {
      if (serviceLower.includes(key.toLowerCase())) {
        return duration;
      }
    }

    // Default duration if no match found
    return 60;
  }
};
