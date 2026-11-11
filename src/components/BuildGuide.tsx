import { useState, type FormEvent } from 'react';
import {
  Badge,
  Body1,
  Button,
  Card,
  Divider,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  Tab,
  TabList,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  Title3,
  Toolbar,
  ToolbarButton,
} from '@fluentui/react-components';
import {
  ArrowDownloadRegular,
  CheckmarkCircleRegular,
  ClipboardTaskRegular,
  CodeRegular,
  DocumentBulletListRegular,
  PrintRegular,
  ShieldCheckmarkRegular,
  WarningRegular,
} from '@fluentui/react-icons';
import { buildStages, constructionSequence, materials, starterSketch, troubleshooting } from '../data/buildGuide';

type GuideTab = 'sequence' | 'materials' | 'electronics' | 'testing';

const tabLabels: { value: GuideTab; label: string }[] = [
  { value: 'sequence', label: 'Build sequence' },
  { value: 'materials', label: 'AED materials' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'testing', label: 'Test & troubleshoot' },
];

function StageTable() {
  return (
    <div className="table-scroll">
      <Table aria-label="Construction checklist">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Stage</TableHeaderCell>
            <TableHeaderCell>Task</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {buildStages.map((stage) => (
            <TableRow key={stage.stage}>
              <TableCell><Text weight="semibold">{stage.stage.toString().padStart(2, '0')}</Text></TableCell>
              <TableCell>{stage.task}</TableCell>
              <TableCell>
                <Badge appearance="tint" color={stage.status === 'Ready' ? 'success' : stage.status === 'Planned' ? 'warning' : 'informative'}>
                  {stage.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function MaterialsTable() {
  const total = materials.reduce((sum, item) => sum + item.estimate, 0);
  return (
    <>
      <div className="table-scroll">
        <Table aria-label="AED-estimated bill of materials">
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Material</TableHeaderCell>
              <TableHeaderCell>Qty.</TableHeaderCell>
              <TableHeaderCell>Estimate</TableHeaderCell>
              <TableHeaderCell>Planning note</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials.map((item) => (
              <TableRow key={item.name}>
                <TableCell><Text weight="semibold">{item.name}</Text></TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.estimate} AED</TableCell>
                <TableCell>{item.note}</TableCell>
              </TableRow>
            ))}
            <TableRow className="table-total-row">
              <TableCell colSpan={2}><Text weight="semibold">Estimated total</Text></TableCell>
              <TableCell><Text weight="semibold">{total} AED</Text></TableCell>
              <TableCell>Planning estimate; confirm local supplier prices before purchase.</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <MessageBar intent="warning" className="guide-note">
        <MessageBarBody>Prices are approximate AED planning estimates and may change by supplier. Reuse safe, available materials where possible.</MessageBarBody>
      </MessageBar>
    </>
  );
}

function ElectronicsPanel() {
  const [copied, setCopied] = useState(false);

  async function copySketch(): Promise<void> {
    try {
      await navigator.clipboard.writeText(starterSketch);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="electronics-layout">
      <Card className="wiring-card" appearance="outline">
        <div className="section-heading">
          <span className="section-heading__icon"><ShieldCheckmarkRegular /></span>
          <div><Title3 as="h3">Compatible 5V wiring</Title3><Text className="muted-copy">A safe, modular demonstration circuit</Text></div>
        </div>
        <ol className="wiring-list">
          <li><strong>Inputs:</strong> PIR signal to D2, push button to D4 (using internal pull-up), and LDR divider to A0.</li>
          <li><strong>Output:</strong> LED on D9 through a suitable current-limiting resistor; buzzer signal on D8.</li>
          <li><strong>Power:</strong> Keep logic at 5V. Power servos from a separate regulated supply sized for their load.</li>
          <li><strong>Common reference:</strong> Join the external supply ground to Arduino GND; insulate exposed conductors.</li>
        </ol>
        <MessageBar intent="warning">
          <MessageBarBody>Disconnect power before changing wires. Do not power servos from the Arduino 5V pin; secure all moving parts.</MessageBarBody>
        </MessageBar>
      </Card>
      <Card className="sketch-card" appearance="outline">
        <div className="section-heading">
          <span className="section-heading__icon"><CodeRegular /></span>
          <div><Title3 as="h3">Arduino starter sketch</Title3><Text className="muted-copy">Motion lighting + a button-triggered hydration prompt</Text></div>
        </div>
        <pre className="code-block"><code>{starterSketch}</code></pre>
        <Button appearance="secondary" icon={<ArrowDownloadRegular />} onClick={() => void copySketch()}>
          Copy starter sketch
        </Button>
        {copied && <Text role="status" className="copy-confirmation">Starter sketch copied.</Text>}
        <Text size={200} className="muted-copy sketch-caption">
          This small starting point uses standard Arduino functions; extend it one tested module at a time for the LCD and servo demonstrations.
        </Text>
      </Card>
    </div>
  );
}

function TestingPanel() {
  return (
    <div className="testing-layout">
      <Card appearance="outline" className="test-card">
        <div className="section-heading">
          <span className="section-heading__icon"><CheckmarkCircleRegular /></span>
          <div><Title3 as="h3">Exhibition test plan</Title3><Text className="muted-copy">Test each module independently before the full demonstration.</Text></div>
        </div>
        <ul className="check-list">
          <li><CheckmarkCircleRegular /> Confirm the base is stable and all four campus zones are secured.</li>
          <li><CheckmarkCircleRegular /> Check LCD text and button-triggered prompts.</li>
          <li><CheckmarkCircleRegular /> Verify PIR, LDR, and temperature/humidity sensor readings.</li>
          <li><CheckmarkCircleRegular /> Test LED, buzzer, and guarded servo movement at 5V.</li>
          <li><CheckmarkCircleRegular /> Recheck wiring, cable insulation, and privacy/safety explanation.</li>
        </ul>
      </Card>
      <Card appearance="outline" className="troubleshooting-card">
        <div className="section-heading">
          <span className="section-heading__icon"><WarningRegular /></span>
          <div><Title3 as="h3">Troubleshooting notes</Title3><Text className="muted-copy">Power off before adjusting connections.</Text></div>
        </div>
        <dl className="troubleshooting-list">
          {troubleshooting.map((item) => (
            <div key={item.symptom}>
              <dt>{item.symptom}</dt>
              <dd>{item.check}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  );
}

function BuildNoteForm() {
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  function saveNote(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!note.trim()) return;
    setSaved(true);
  }

  return (
    <Card className="build-note-card" appearance="filled-alternative">
      <div className="section-heading">
        <span className="section-heading__icon"><DocumentBulletListRegular /></span>
        <div><Title3 as="h3">Session-only build note</Title3><Text className="muted-copy">This note stays in page memory only and clears when you leave or reload.</Text></div>
      </div>
      <form className="build-note-form" onSubmit={saveNote}>
        <Field
          label="Build note"
          validationState="warning"
          validationMessage="Do not include student names or personal wellbeing details."
        >
          <Input
            value={note}
            onChange={(_event, data) => {
              setNote(data.value);
              setSaved(false);
            }}
            placeholder="For example: Stage 1 base layout measured and checked."
            maxLength={240}
          />
        </Field>
        <Button type="submit" appearance="primary" icon={<CheckmarkCircleRegular />} disabled={!note.trim()}>
          Keep note for this session
        </Button>
        {saved && <Text role="status" className="copy-confirmation">Note kept in this page session only; nothing was stored.</Text>}
      </form>
    </Card>
  );
}

export function BuildGuide() {
  const [selectedTab, setSelectedTab] = useState<GuideTab>('sequence');

  return (
    <section className="build-guide-content">
      <Toolbar className="guide-toolbar" aria-label="Build guide actions">
        <Text weight="semibold"><ClipboardTaskRegular /> Exhibition workbench</Text>
        <div className="guide-toolbar__actions">
          <ToolbarButton icon={<PrintRegular />} onClick={() => window.print()}>Print build guide</ToolbarButton>
        </div>
      </Toolbar>
      <TabList
        className="guide-tabs"
        aria-label="Build guide sections"
        selectedValue={selectedTab}
        onTabSelect={(_event, data) => setSelectedTab(data.value as GuideTab)}
      >
        {tabLabels.map((tab) => <Tab key={tab.value} value={tab.value}>{tab.label}</Tab>)}
      </TabList>
      <div className="guide-tab-panel" role="tabpanel">
        {selectedTab === 'sequence' && (
          <div className="guide-sequence">
            <Card id="construction-checklist" className="stage-card" appearance="outline">
              <div className="section-heading">
                <span className="section-heading__icon"><ClipboardTaskRegular /></span>
                <div><Title3 as="h3">Construction checklist</Title3><Text className="muted-copy">Five milestones from model layout to a safety review</Text></div>
              </div>
              <StageTable />
            </Card>
            <Card className="sequence-card" appearance="outline">
              <div className="section-heading">
                <span className="section-heading__icon"><CheckmarkCircleRegular /></span>
                <div><Title3 as="h3">Build sequence</Title3><Text className="muted-copy">A practical order for assembling the physical model</Text></div>
              </div>
              <ol className="sequence-list">
                {constructionSequence.map((step, index) => (
                  <li key={step}><span>{String(index + 1).padStart(2, '0')}</span><Body1>{step}</Body1></li>
                ))}
              </ol>
            </Card>
          </div>
        )}
        {selectedTab === 'materials' && (
          <Card className="materials-card" appearance="outline">
            <div className="section-heading">
              <span className="section-heading__icon"><DocumentBulletListRegular /></span>
              <div><Title3 as="h3">AED bill of materials</Title3><Text className="muted-copy">Quantities and planning estimates for a classroom-scale model</Text></div>
            </div>
            <MaterialsTable />
          </Card>
        )}
        {selectedTab === 'electronics' && <ElectronicsPanel />}
        {selectedTab === 'testing' && <TestingPanel />}
      </div>
      <Divider className="guide-divider" />
      <BuildNoteForm />
    </section>
  );
}
