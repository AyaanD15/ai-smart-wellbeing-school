import {
  Badge,
  Body1,
  Card,
  CardHeader,
  CardPreview,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  Title2,
} from '@fluentui/react-components';
import {
  BookOpenRegular,
  HeartPulseRegular,
  LightbulbRegular,
  ShieldCheckmarkRegular,
} from '@fluentui/react-icons';
import { Link } from 'react-router-dom';
import { campusMetrics, campusSummary } from '../data/campus';
import { buildings } from '../data/buildings';
import { BuildingCard } from '../components/BuildingCard';
import { DataStateView } from '../components/DataStateView';
import { HeroSection } from '../components/HeroSection';
import { PageTransition } from '../components/PageTransition';

const metricIcons = [BookOpenRegular, LightbulbRegular, HeartPulseRegular];

export function CampusOverview() {
  return (
    <PageTransition>
      <div className="page-stack">
        <HeroSection
          eyebrow="AI Smart Wellbeing School"
          title="Campus Overview"
          description="A complete Grade 10 exhibition concept for a healthier, safer, and smarter school environment."
          primaryLabel="Explore the campus zones"
          primaryTo="/buildings"
          secondaryLabel="Open the build guide"
          secondaryTo="/build-guide"
        />
        <DataStateView
          emptyTitle="Your campus plan is ready to explore"
          emptyDescription="The local project overview will show the campus zones and exhibition details."
          emptyAction="Show campus overview"
        >
          <div className="overview-metrics">
            {campusMetrics.map((metric, index) => {
              const MetricIcon = metricIcons[index];
              return (
                <Card key={metric.label} appearance="outline" className="metric-card">
                  <span className="metric-card__icon"><MetricIcon aria-hidden="true" /></span>
                  <Text className="metric-card__value">{metric.value}</Text>
                  <Text className="metric-card__label">{metric.label}</Text>
                </Card>
              );
            })}
          </div>
          <div className="model-preview-callout">
            <div>
              <Text weight="semibold">Want to look around the campus?</Text>
              <Text className="muted-copy">Open the interactive isometric model and select any zone to inspect it.</Text>
            </div>
            <Link className="model-preview-callout__link" to="/3d-model">Open the 3D model <span aria-hidden="true">→</span></Link>
          </div>
          <section className="content-section">
            <div className="section-title-row">
              <div className="section-heading">
                <span className="section-heading__icon"><HeartPulseRegular /></span>
                <div>
                  <Title2 as="h2">Four zones, one healthier campus</Title2>
                  <Text className="muted-copy">A physical school model with safe, student-first technology.</Text>
                </div>
              </div>
              <Link className="text-link" to="/buildings">View all building details</Link>
            </div>
            <div className="building-grid">
              {buildings.map((building) => <BuildingCard key={building.id} building={building} />)}
            </div>
          </section>
          <div className="overview-lower-grid">
            <Card className="overview-summary-card" appearance="outline">
              <CardHeader
                header={<Text weight="semibold">Campus concept at a glance</Text>}
                description="The complete school-model summary"
              />
              <div className="table-scroll">
                <Table aria-label="Campus concept summary">
                  <TableHeader>
                    <TableRow>
                      <TableHeaderCell>Section</TableHeaderCell>
                      <TableHeaderCell>Details</TableHeaderCell>
                      <TableHeaderCell>Status</TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campusSummary.map((item) => (
                      <TableRow key={item.section}>
                        <TableCell><Text weight="semibold">{item.section}</Text></TableCell>
                        <TableCell>{item.details}</TableCell>
                        <TableCell>
                          <Badge appearance="tint" color={item.status === 'Ready' ? 'success' : 'warning'}>{item.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
            <Card className="privacy-card" appearance="filled-alternative">
              <CardPreview className="privacy-card__image">
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=960&q=85"
                  alt="A calm digital learning environment"
                  loading="lazy"
                />
              </CardPreview>
              <CardHeader
                header={<Text weight="semibold">A thoughtful technology boundary</Text>}
                description="Safety is part of the design"
              />
              <div className="privacy-card__body">
                <ShieldCheckmarkRegular aria-hidden="true" />
                <Body1>Wellbeing content is non-diagnostic. The demonstration uses safe 5V electronics and does not collect student data.</Body1>
              </div>
              <Link className="text-link" to="/wellbeing">Explore wellbeing features</Link>
            </Card>
          </div>
        </DataStateView>
      </div>
    </PageTransition>
  );
}
