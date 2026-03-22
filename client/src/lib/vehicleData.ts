/*
 * King & Carter Fleet — Vehicle Data
 */

export interface Vehicle {
  id: string;
  name: string;
  description: string;
  passengers: string;
  luggage: string;
  amenities: string[];
  category: string;
  image: string;
}

const CDN = "/images";

export const vehicles: Vehicle[] = [
  {
    id: "suburban",
    name: "2026 Chevrolet Suburban",
    description:
      "Generous space meets quiet composure. The Suburban delivers a commanding presence paired with the kind of interior comfort that makes every mile feel unhurried — ideal for executive groups and seamless airport transfers.",
    passengers: "6",
    luggage: "Up to 6",
    amenities: ["Complimentary Wi-Fi", "Bottled Water", "Climate Control", "Privacy Windows"],
    category: "Executive SUV",
    image: `${CDN}/fleet-suburban.jpg`,
  },
  {
    id: "escalade",
    name: "2026 Cadillac Escalade",
    description:
      "The definitive luxury SUV. With its signature lighting and whisper-quiet cabin, the Escalade cocoons passengers in handcrafted comfort — transforming every journey into a first-class experience.",
    passengers: "6",
    luggage: "Up to 6",
    amenities: ["Complimentary Wi-Fi", "Bottled Water", "Climate Control", "Privacy Windows"],
    category: "Executive SUV",
    image: `${CDN}/fleet-escalade-ext.jpg`,
  },
  {
    id: "maybach",
    name: "2026 Mercedes-Maybach S-Class",
    description:
      "The pinnacle of chauffeured luxury. An extended wheelbase creates a rear cabin of extraordinary space and serenity, where reclining executive seats and hand-finished materials transform every journey into a private retreat.",
    passengers: "3",
    luggage: "3",
    amenities: ["Executive Seats with Calf Rests", "Complimentary Wi-Fi", "Bottled Water", "Rear Privacy Partition"],
    category: "Ultra-Luxury Sedan",
    image: `${CDN}/fleet-maybach.webp`,
  },
  {
    id: "sprinter",
    name: "Mercedes-Benz Executive Sprinter",
    description:
      "Group travel, redefined. A bespoke cabin designed for comfort and productivity — whether coordinating a corporate delegation or hosting a private celebration, every guest travels with distinction.",
    passengers: "12",
    luggage: "10–12",
    amenities: ["Flat-Screen TVs", "Dining Tables", "Complimentary Wi-Fi", "Privacy Partition"],
    category: "Executive Coach",
    image: `${CDN}/fleet-sprinter.jpg`,
  },
  {
    id: "ghost",
    name: "Rolls-Royce Ghost",
    description:
      "The art of simplicity. Extraordinary presence delivered with absolute discretion — the handcrafted interior wraps passengers in an atmosphere of calm, unhurried elegance that makes every journey feel effortless.",
    passengers: "3",
    luggage: "3",
    amenities: ["Complimentary Wi-Fi", "Bottled Water", "Handcrafted Interior", "Rear Privacy Curtains"],
    category: "Ultra-Luxury Sedan",
    image: `${CDN}/fleet-ghost.jpg`,
  },
  {
    id: "cullinan",
    name: "Rolls-Royce Cullinan",
    description:
      "Uncompromising luxury meets extraordinary capability. An elevated seating position, whisper-quiet cabin, and effortless power create a sanctuary that moves with purpose — whether navigating city streets or venturing beyond.",
    passengers: "4",
    luggage: "4",
    amenities: ["Complimentary Wi-Fi", "Bottled Water", "Handcrafted Interior", "Panoramic Views"],
    category: "Ultra-Luxury SUV",
    image: `${CDN}/fleet-cullinan.jpg`,
  },
];

export const fleetHeroImage = `/images/fleet-hero.webp`;
