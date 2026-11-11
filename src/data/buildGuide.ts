export interface BuildStage {
  stage: number;
  task: string;
  status: 'Ready' | 'Planned' | 'Pending';
}

export const buildStages: BuildStage[] = [
  {
    stage: 1,
    task: 'Mark the 100 × 120 cm base and dimensioned four-zone campus placement',
    status: 'Ready',
  },
  {
    stage: 2,
    task: 'Build multi-storey structures, interiors, roads, paths, and landscaping',
    status: 'Planned',
  },
  {
    stage: 3,
    task: 'Install LCDs, sensors, LEDs, buttons, buzzer, and moving mechanisms using compatible 5V wiring',
    status: 'Pending',
  },
  {
    stage: 4,
    task: 'Load Arduino source and test each sensor, display, light, and moving feature',
    status: 'Pending',
  },
  {
    stage: 5,
    task: 'Verify safety, document troubleshooting, and prepare the AED bill of materials',
    status: 'Pending',
  },
];

export interface Material {
  name: string;
  quantity: string;
  estimate: number;
  note: string;
}

export const materials: Material[] = [
  { name: 'Arduino Uno-compatible board', quantity: '1', estimate: 65, note: 'Controller for the 5V model demonstrations' },
  { name: '16×2 LCD with I²C adapter', quantity: '1', estimate: 18, note: 'Short wellbeing and project prompts' },
  { name: 'PIR, LDR, and temperature/humidity sensors', quantity: '1 set', estimate: 35, note: 'Environmental inputs for safe demonstrations' },
  { name: 'LEDs, resistors, push buttons, and buzzer', quantity: '1 set', estimate: 18, note: 'Use a current-limiting resistor with every LED' },
  { name: 'SG90 micro servos', quantity: '2', estimate: 22, note: 'Keep moving parts guarded and use a separate regulated 5V supply' },
  { name: 'Regulated 5V USB supply', quantity: '1', estimate: 25, note: 'Size for the connected loads; share ground with the controller' },
  { name: 'Foam board, paint, and landscaping', quantity: '1 set', estimate: 55, note: 'Campus buildings, paths, and garden details' },
  { name: 'Breadboard, jumper wires, and connectors', quantity: '1 set', estimate: 28, note: 'Insulate exposed conductors and label connections' },
];

export const constructionSequence = [
  'Mark the 100 × 120 cm base and place the four dimensioned campus zones, roads, and garden.',
  'Construct building frames and interior features with clear doors, windows, and landscaping.',
  'Install LCDs, PIR/LDR/temperature-humidity sensors, LEDs, buttons, buzzer, and servo-driven features with compatible 5V wiring.',
  'Upload the Arduino sketch and test display content, sensors, lighting, button triggers, buzzer, and moving mechanisms.',
  'Prepare dimensioned architecture and circuit diagrams, an AED materials budget, calibration notes, and troubleshooting steps.',
  "Check electrical safety and explain the wellbeing assistant's non-diagnostic and privacy-preserving limits.",
];

export const troubleshooting = [
  { symptom: 'LCD is blank', check: 'Check the 5V and GND connections, I²C wiring, contrast adjustment, and display address.' },
  { symptom: 'Sensor reading is unstable', check: 'Secure the sensor, keep signal wires short, verify the shared ground, and test one input at a time.' },
  { symptom: 'LED does not light', check: 'Confirm LED polarity, series resistor, pin assignment, and the common ground.' },
  { symptom: 'Servo jitters or resets the board', check: 'Use a separate regulated 5V supply sized for the servo and connect its ground to Arduino GND.' },
];

export const starterSketch = `const int motionPin = 2;
const int lightPin = 9;
const int buttonPin = 4;
const int buzzerPin = 8;

void setup() {
  pinMode(motionPin, INPUT);
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(lightPin, OUTPUT);
  pinMode(buzzerPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  const bool motionDetected = digitalRead(motionPin) == HIGH;
  const bool reminderPressed = digitalRead(buttonPin) == LOW;
  const int ambientLight = analogRead(A0);

  digitalWrite(lightPin, motionDetected && ambientLight < 500 ? HIGH : LOW);
  if (reminderPressed) {
    tone(buzzerPin, 880, 120);
    Serial.println("Take a water break.");
    delay(250);
  }
  delay(50);
}`;
