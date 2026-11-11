import {
  Badge,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  Title2,
} from '@fluentui/react-components';
import { BuildingRegular, RulerRegular } from '@fluentui/react-icons';
import { buildings } from '../data/buildings';
import { BuildingCard } from '../components/BuildingCard';
import { DataStateView } from '../components/DataStateView';
import { HeroSection } from '../components/HeroSection';
import { PageTransition } from '../components/PageTransition';

export function BuildingDetail() {
  return (
    <PageTransition>
      <div className="page-stack">
        <HeroSection
          eyebrow="Campus architecture"
          title="Building Detail"
          description="Explore the purpose, area, and placement intent for each of the four connected campus zones."
          primaryLabel="Review the building plan"
          primaryTo="/buildings#building-layout"
          secondaryLabel="See construction stages"
          secondaryTo="/build-guide"
        />
        <DataStateView
          emptyTitle="The building plan is ready"
          emptyDescription="Four planned campus zones will appear here with their areas and purpose."
          emptyAction="Show building plan"
        >
          <section className="content-section" id="building-layout">
            <div className="section-title-row">
              <div className="section-heading">
                <span className="section-heading__icon"><BuildingRegular /></span>
                <div><Title2 as="h2">Four connected learning zones</Title2><Text className="muted-copy">Areas below are the planned model footprints.</Text></div>
              </div>
              <Badge appearance="tint" color="brand" icon={<RulerRegular />}>100 × 120 cm base</Badge>
            </div>
            <div className="building-grid building-grid--detail">
              {buildings.map((building) => <BuildingCard key={building.id} building={building} />)}
            </div>
          </section>
          <Card className="building-table-card" appearance="outline">
            <CardHeader
              header={<Text weight="semibold">Campus building layout</Text>}
              description="Reference table for the dimensioned model plan"
            />
            <div className="table-scroll">
              <Table aria-label="Campus building layout">
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell>Building</TableHeaderCell>
                    <TableHeaderCell>Purpose</TableHeaderCell>
                    <TableHeaderCell>Area</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {buildings.map((building) => (
                    <TableRow key={building.id}>
                      <TableCell><Text weight="semibold">{building.name}</Text></TableCell>
                      <TableCell>{building.purpose}</TableCell>
                      <TableCell>{building.area}</TableCell>
                      <TableCell><Badge appearance="tint" color="warning">{building.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </DataStateView>
      </div>
    </PageTransition>
  );
}
