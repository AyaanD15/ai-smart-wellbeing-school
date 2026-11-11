export interface Building {
  id: string;
  name: string;
  purpose: string;
  area: string;
  status: 'Planned';
  image: string;
  imageAlt: string;
  zone: string;
  details: string;
}

export const buildings: Building[] = [
  {
    id: 'wellbeing-centre',
    name: 'AI Wellbeing Centre',
    purpose: 'LCD wellbeing assistant, breathing prompts, and calm support space',
    area: '1,400 cm²',
    status: 'Planned',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Bright, calm shared learning space with natural light',
    zone: 'Wellbeing and support',
    details: 'A quiet, welcoming space for non-diagnostic breathing prompts and supportive wellbeing guidance.',
  },
  {
    id: 'smart-classrooms',
    name: 'Smart Classrooms',
    purpose: 'Interactive learning, central status display, and environmental sensors',
    area: '1,600 cm²',
    status: 'Planned',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Sunlit classroom arranged for collaborative learning',
    zone: 'Learning and discovery',
    details: 'A central display and safe environmental sensors support an interactive learning demonstration.',
  },
  {
    id: 'healthy-lifestyle',
    name: 'Healthy Lifestyle Centre',
    purpose: 'Hydration reminders, healthy routines, and activity prompts',
    area: '1,300 cm²',
    status: 'Planned',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Quiet green outdoor space for healthy routines and movement',
    zone: 'Healthy routines',
    details: 'Gentle reminders encourage hydration, movement, and healthy day-to-day routines.',
  },
  {
    id: 'relaxation-garden',
    name: 'Relaxation Garden',
    purpose: 'Rest area with landscaping and safe moving demonstration features',
    area: '1,200 cm²',
    status: 'Planned',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Green garden path with plants and a restful atmosphere',
    zone: 'Outdoor calm',
    details: 'Landscaping and carefully guarded moving features make a restful outdoor showcase.',
  },
];
