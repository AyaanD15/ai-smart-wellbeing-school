export interface CampusSummary {
  section: string;
  details: string;
  status: 'Ready' | 'Planned' | 'Pending';
}

export const campusSummary: CampusSummary[] = [
  {
    section: 'Campus concept',
    details: 'AI Smart Wellbeing School with four connected learning zones',
    status: 'Ready',
  },
  {
    section: 'Model size',
    details: '100 x 120 cm physical exhibition base with dimensioned campus layout',
    status: 'Ready',
  },
  {
    section: 'Demonstrations',
    details: 'Arduino Uno, LCD guidance, sensor-triggered lighting, buttons, buzzer, servo motion, and rotating features',
    status: 'Planned',
  },
  {
    section: 'Focus areas',
    details: 'Learning, wellbeing, healthy lifestyle, and safe technology integration',
    status: 'Ready',
  },
  {
    section: 'Safety model',
    details: 'Non-diagnostic guidance, student privacy, and safe 5V electronics',
    status: 'Ready',
  },
];

export const campusMetrics = [
  { value: '100 × 120', label: 'cm model base' },
  { value: '4', label: 'major zones' },
  { value: 'AI', label: 'wellbeing centre' },
];
