import { useCallback, useEffect, useRef, useState } from 'react';
import { Badge, Button, Card, Switch, Text, Title1, Title2 } from '@fluentui/react-components';
import { CubeRegular, LightbulbRegular, RulerRegular } from '@fluentui/react-icons';
import { Link } from 'react-router-dom';
import { buildings } from '../data/buildings';
import { InteractiveCampus3D } from '../components/InteractiveCampus3D';
import { PageTransition } from '../components/PageTransition';

type ViewMode = 'isometric' | 'plan';

const planBuildings = [
  { id: 'wellbeing-centre', x: 170, y: 145, width: 170, height: 100, color: '#b7d7ca', label: 'AI Wellbeing Centre' },
  { id: 'smart-classrooms', x: 405, y: 125, width: 195, height: 112, color: '#a9ced4', label: 'Smart Classrooms' },
  { id: 'healthy-lifestyle', x: 420, y: 282, width: 178, height: 100, color: '#e8d29b', label: 'Healthy Lifestyle Centre' },
  { id: 'relaxation-garden', x: 174, y: 286, width: 174, height: 102, color: '#a9c79d', label: 'Relaxation Garden' },
];

export function CampusModelPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('isometric');
  const [selectedId, setSelectedId] = useState('wellbeing-centre');
  const [screenMessage, setScreenMessage] = useState('Welcome. Press a button to explore.');
  const [motionDetected, setMotionDetected] = useState(false);
  const [isDim, setIsDim] = useState(true);
  const [windmillOn, setWindmillOn] = useState(true);
  const [servoAngle, setServoAngle] = useState(90);
  const [temperature, setTemperature] = useState(24);
  const [humidity, setHumidity] = useState(48);
  const [buzzerOn, setBuzzerOn] = useState(false);
  const [buzzerStatus, setBuzzerStatus] = useState('Ready');
  const buzzerTimerRef = useRef<number | null>(null);
  const selectedBuilding = buildings.find((building) => building.id === selectedId) ?? buildings[0];
  const handleSelectBuilding = useCallback((id: string) => setSelectedId(id), []);

  useEffect(() => () => {
    if (buzzerTimerRef.current !== null) window.clearTimeout(buzzerTimerRef.current);
  }, []);

  function testBuzzer(): void {
    if (buzzerTimerRef.current !== null) window.clearTimeout(buzzerTimerRef.current);
    setBuzzerOn(true);
    setBuzzerStatus('Buzzer chirp playing');

    const AudioContextConstructor = window.AudioContext;
    if (!AudioContextConstructor) {
      setBuzzerStatus('Visual buzzer signal (audio unavailable in this browser)');
      buzzerTimerRef.current = window.setTimeout(() => setBuzzerOn(false), 700);
      return;
    }

    try {
      const audioContext = new AudioContextConstructor();
      const oscillator = audioContext.createOscillator();
      const volume = audioContext.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = 880;
      volume.gain.setValueAtTime(0.08, audioContext.currentTime);
      volume.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.18);
      oscillator.connect(volume);
      volume.connect(audioContext.destination);
      oscillator.onended = () => {
        void audioContext.close();
        setBuzzerOn(false);
        setBuzzerStatus('Buzzer test complete');
      };
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.18);
    } catch (error) {
      console.error('Unable to play the browser buzzer demo.', error);
      setBuzzerOn(false);
      setBuzzerStatus('Audio could not play; check browser audio settings');
    }
  }

  return (
    <PageTransition>
      <div className="page-stack">
        <Card className="model-intro-card" appearance="filled-alternative">
          <Text className="eyebrow"><span aria-hidden="true" />Interactive campus model</Text>
          <Title1 as="h1">Explore the 3D Model</Title1>
          <Text className="model-intro-copy">Orbit around the 100 × 120 cm campus to explore detailed school buildings, a large side-mounted LCD, sensors, lights, servo, and windmill.</Text>
        </Card>

        <section className="model-viewer-section" aria-labelledby="model-viewer-heading">
          <div className="model-viewer-heading">
            <div>
              <Title2 as="h2" id="model-viewer-heading">School campus model</Title2>
              <Text className="muted-copy">Drag the model to rotate it, zoom with your wheel or pinch, and select a building to inspect it.</Text>
            </div>
            <Badge appearance="tint" color="brand" icon={<RulerRegular />}>100 × 120 cm base</Badge>
          </div>

          <Card className="model-viewer-card" appearance="outline">
            <div className="model-viewer-toolbar" role="group" aria-label="Model view options">
              <Button
                appearance={viewMode === 'isometric' ? 'primary' : 'outline'}
                icon={<CubeRegular />}
                aria-pressed={viewMode === 'isometric'}
                onClick={() => setViewMode('isometric')}
              >
                Isometric 3D
              </Button>
              <Button
                appearance={viewMode === 'plan' ? 'primary' : 'outline'}
                icon={<RulerRegular />}
                aria-pressed={viewMode === 'plan'}
                onClick={() => setViewMode('plan')}
              >
                Top-down plan
              </Button>
            </div>

            <div className="campus-model__canvas">
              {viewMode === 'isometric' ? (
                <InteractiveCampus3D
                  selectedId={selectedId}
                  onSelect={handleSelectBuilding}
                  screenMessage={screenMessage}
                  motionDetected={motionDetected}
                  isDim={isDim}
                  windmillOn={windmillOn}
                  servoAngle={servoAngle}
                  temperature={temperature}
                  humidity={humidity}
                  buzzerOn={buzzerOn}
                />
              ) : (
                <svg className="campus-model campus-model--plan" viewBox="0 0 900 520" role="group" aria-labelledby="plan-title plan-description">
                  <title id="plan-title">Top-down campus layout plan</title>
                  <desc id="plan-description">Top-down view of the 100 by 120 centimeter base with four labeled building footprints and the central path.</desc>
                  <rect x="90" y="70" width="720" height="380" rx="12" fill="#e5efdc" stroke="#577565" strokeWidth="4" />
                  <path d="M 100 255 H 800 M 450 80 V 440" stroke="#d1c9ad" strokeWidth="36" />
                  <path d="M 100 255 H 800 M 450 80 V 440" stroke="#fff8df" strokeWidth="3" strokeDasharray="14 12" />
                  {planBuildings.map((building) => (
                    <g
                      key={building.id}
                      className={`campus-model__plan-building${selectedId === building.id ? ' is-selected' : ''}`}
                      role="button"
                      tabIndex={0}
                      aria-label={`Select ${building.label}`}
                      aria-pressed={selectedId === building.id}
                      onClick={() => setSelectedId(building.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          setSelectedId(building.id);
                        }
                      }}
                    >
                      <rect x={building.x} y={building.y} width={building.width} height={building.height} rx="8" fill={building.color} stroke="#527267" strokeWidth="3" />
                      <rect x={building.x + 14} y={building.y + 14} width={building.width - 28} height={building.height - 28} rx="5" fill="rgba(255,255,255,.36)" />
                      <text x={building.x + building.width / 2} y={building.y + building.height / 2} textAnchor="middle" className="campus-model__plan-label">{building.label}</text>
                    </g>
                  ))}
                  <rect x="680" y="345" width="120" height="78" rx="7" fill="#315c48" stroke="#fff" strokeWidth="3" />
                  <text x="740" y="376" textAnchor="middle" className="campus-model__plan-control">Large LCD</text>
                  <text x="740" y="402" textAnchor="middle" className="campus-model__plan-control">Arduino</text>
                  <path d="M 90 470 H 810" stroke="#577565" strokeWidth="2" />
                  <text x="450" y="495" textAnchor="middle" className="campus-model__dimension">120 cm</text>
                  <path d="M 70 70 V 450" stroke="#577565" strokeWidth="2" />
                  <text x="53" y="266" textAnchor="middle" className="campus-model__dimension" transform="rotate(-90 53 266)">100 cm</text>
                </svg>
              )}
            </div>

            <div className="model-building-picker" role="group" aria-label="Select a campus zone">
              {buildings.map((building) => (
                <Button
                  key={building.id}
                  appearance={selectedId === building.id ? 'primary' : 'outline'}
                  aria-pressed={selectedId === building.id}
                  onClick={() => setSelectedId(building.id)}
                >
                  {building.name}
                </Button>
              ))}
            </div>
          </Card>

          <Card className="model-simulator-card" appearance="outline">
            <div className="model-simulator-heading">
              <div className="section-heading">
                <span className="section-heading__icon"><LightbulbRegular /></span>
                <div>
                  <Title2 as="h2">Try the model controls</Title2>
                  <Text className="muted-copy">These controls simulate the school electronics in your browser.</Text>
                </div>
              </div>
              <Badge appearance="tint" color="success">Browser simulation</Badge>
            </div>

            <div className="simulator-layout">
              <section className="simulator-block" aria-labelledby="lcd-controls-title">
                <Text weight="semibold" id="lcd-controls-title">LCD wellbeing assistant</Text>
                <Text className="muted-copy">Tap a prompt button to update the screen on the 3D control station.</Text>
                <div className="simulator-prompt-buttons">
                  <Button appearance="outline" onClick={() => setScreenMessage('Breathe in 4, out 4. Repeat for one minute.')}>Breathing prompt</Button>
                  <Button appearance="outline" onClick={() => setScreenMessage('Hydration break: take a sip of water.')}>Hydration reminder</Button>
                  <Button appearance="outline" onClick={() => setScreenMessage('Stand, stretch, and move for two minutes.')}>Healthy habit tip</Button>
                </div>
                <div className="simulator-screen-status" role="status" aria-live="polite">
                  LCD says: <strong>{screenMessage}</strong>
                </div>
              </section>

              <section className="simulator-block simulator-block--controls" aria-label="Sensor and motor controls">
                <Switch
                  label="Simulate PIR motion"
                  checked={motionDetected}
                  onChange={(_event, data) => setMotionDetected(data.checked)}
                />
                <Switch
                  label="Dim the room (LDR)"
                  checked={isDim}
                  onChange={(_event, data) => setIsDim(data.checked)}
                />
                <Switch
                  label="Spin garden windmill"
                  checked={windmillOn}
                  onChange={(_event, data) => setWindmillOn(data.checked)}
                />
                <label className="simulator-range" htmlFor="servo-angle">
                  <span>Servo position <output>{servoAngle}°</output></span>
                  <input id="servo-angle" type="range" min="0" max="180" step="5" value={servoAngle} onChange={(event) => setServoAngle(Number(event.currentTarget.value))} />
                </label>
                <label className="simulator-range" htmlFor="temperature">
                  <span>Temperature <output>{temperature}°C</output></span>
                  <input id="temperature" type="range" min="18" max="35" value={temperature} onChange={(event) => setTemperature(Number(event.currentTarget.value))} />
                </label>
                <label className="simulator-range" htmlFor="humidity">
                  <span>Humidity <output>{humidity}%</output></span>
                  <input id="humidity" type="range" min="30" max="80" value={humidity} onChange={(event) => setHumidity(Number(event.currentTarget.value))} />
                </label>
                <Button appearance="primary" onClick={testBuzzer}>Test buzzer</Button>
                <Text className="muted-copy" role="status" aria-live="polite">Buzzer: {buzzerStatus}</Text>
              </section>
            </div>

            <div className="simulator-live-status" role="status" aria-live="polite">
              <span>Path lights: <strong>{isDim || motionDetected ? 'ON' : 'OFF'}</strong></span>
              <span>PIR: <strong>{motionDetected ? 'Motion detected' : 'Clear'}</strong></span>
              <span>LDR: <strong>{isDim ? 'Dim' : 'Bright'}</strong></span>
              <span>Windmill: <strong>{windmillOn ? 'Spinning' : 'Stopped'}</strong></span>
              <span>Environment: <strong>{temperature}°C · {humidity}% RH</strong></span>
            </div>
            <Text className="model-disclaimer">No physical Arduino is connected. All sensor values and outputs are simulated; the wellbeing prompts are general, non-diagnostic suggestions.</Text>
          </Card>

          <div className="model-detail-grid">
            <Card className="model-detail-card" appearance="outline">
              <div className="section-heading">
                <span className="section-heading__icon"><CubeRegular /></span>
                <div>
                  <Title2 as="h2">{selectedBuilding.name}</Title2>
                  <Text className="muted-copy">{selectedBuilding.zone} · {selectedBuilding.area}</Text>
                </div>
              </div>
              <Text>{selectedBuilding.details}</Text>
              <Text className="muted-copy">{selectedBuilding.purpose}</Text>
              <Link className="text-link" to="/buildings">See building placement and details</Link>
            </Card>
            <Card className="model-detail-card model-electronics-card" appearance="outline">
              <div className="section-heading">
                <span className="section-heading__icon"><LightbulbRegular /></span>
                <div>
                  <Title2 as="h2">Electronics in the model</Title2>
                  <Text className="muted-copy">Interactive exhibit components</Text>
                </div>
              </div>
              <ul>
                <li>Side-mounted Arduino Uno station with a large updating LCD</li>
                <li>PIR, LDR, temperature, and humidity sensor demonstrations</li>
                <li>Automatic LED path lighting and an audible buzzer test</li>
                <li>Servo arm position control and rotating garden windmill</li>
              </ul>
              <Text className="model-disclaimer">This 3D scene is an illustrative exhibit simulator, not a fabrication-ready CAD drawing. Confirm physical dimensions and wiring against the build guide before construction.</Text>
            </Card>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
