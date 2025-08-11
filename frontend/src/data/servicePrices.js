// Service durations in minutes for frontend use
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

export const getServiceDuration = (service) => {
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
};
