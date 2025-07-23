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
  }
};
