export interface WellbeingFeature {
  id: string;
  feature: string;
  example: string;
  status: 'Planned' | 'Ready';
  image: string;
  imageAlt: string;
  category: 'Guidance' | 'Healthy habits' | 'Environment' | 'Safety';
}

export const wellbeingFeatures: WellbeingFeature[] = [
  {
    id: 'wellbeing-display',
    feature: 'Wellbeing display',
    example: 'LCD shows breathing exercises, stress-management suggestions, and healthy lifestyle tips',
    status: 'Planned',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Digital screen used for a calm, supportive learning prompt',
    category: 'Guidance',
  },
  {
    id: 'hydration-reminder',
    feature: 'Hydration reminder',
    example: 'Button- or timer-triggered hydration suggestions',
    status: 'Planned',
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Glass of water representing a gentle hydration reminder',
    category: 'Healthy habits',
  },
  {
    id: 'sensor-automation',
    feature: 'Sensor automation',
    example: 'PIR, LDR, and temperature/humidity sensors drive safe environmental demonstrations',
    status: 'Planned',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Electronic circuit board representing sensor-based demonstrations',
    category: 'Environment',
  },
  {
    id: 'moving-features',
    feature: 'Moving features',
    example: 'Servo mechanisms and rotating windmills operate from a safe 5V supply',
    status: 'Planned',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Small electronic components for a moving model demonstration',
    category: 'Environment',
  },
  {
    id: 'privacy-protection',
    feature: 'Privacy protection',
    example: 'Non-diagnostic wellbeing information; no student data collection',
    status: 'Ready',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Abstract connected network representing responsible technology',
    category: 'Safety',
  },
];
