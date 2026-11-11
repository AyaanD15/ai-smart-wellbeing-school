import { useMemo, useState } from 'react';
import {
  Badge,
  Card,
  CardHeader,
  Tab,
  TabList,
  Text,
  Title2,
} from '@fluentui/react-components';
import {
  HeartPulseRegular,
  ShieldCheckmarkRegular,
  WaterRegular,
  WeatherSunnyRegular,
} from '@fluentui/react-icons';
import { DataStateView } from '../components/DataStateView';
import { HeroSection } from '../components/HeroSection';
import { PageTransition } from '../components/PageTransition';
import { WellbeingFeatureList } from '../components/WellbeingFeatureList';
import { wellbeingFeatures } from '../data/wellbeing';

type WellbeingTab = 'all' | 'habits' | 'environment' | 'privacy';

const tabCategories: Record<WellbeingTab, string | null> = {
  all: 'All features',
  habits: 'Healthy habits',
  environment: 'Environment',
  privacy: 'Safety',
};

export function WellbeingDashboard() {
  const [selectedTab, setSelectedTab] = useState<WellbeingTab>('all');
  const visibleFeatures = useMemo(() => {
    const category = tabCategories[selectedTab];
    return category === 'All features'
      ? wellbeingFeatures
      : wellbeingFeatures.filter((feature) => feature.category === category);
  }, [selectedTab]);

  return (
    <PageTransition>
      <div className="page-stack">
        <HeroSection
          eyebrow="Supportive by design"
          title="Wellbeing Dashboard"
          description="A small school-model demonstration of healthy routines, supportive guidance, and thoughtful sensor use."
          primaryLabel="Explore wellbeing features"
          primaryTo="/wellbeing#wellbeing-features"
          secondaryLabel="Read the safe build guide"
          secondaryTo="/build-guide"
        />
        <DataStateView
          emptyTitle="Wellbeing features are ready to explore"
          emptyDescription="The dashboard will show non-diagnostic prompts, healthy habits, and privacy-first automation."
          emptyAction="Show wellbeing features"
        >
          <section className="content-section" id="wellbeing-features">
            <div className="section-title-row">
              <div className="section-heading">
                <span className="section-heading__icon"><HeartPulseRegular /></span>
                <div><Title2 as="h2">Small prompts, clear boundaries</Title2><Text className="muted-copy">Supportive information only—never a diagnosis or student profile.</Text></div>
              </div>
              <Badge appearance="tint" color="success" icon={<ShieldCheckmarkRegular />}>No student data collection</Badge>
            </div>
            <TabList
              className="wellbeing-tabs"
              aria-label="Filter wellbeing features"
              selectedValue={selectedTab}
              onTabSelect={(_event, data) => setSelectedTab(data.value as WellbeingTab)}
            >
              <Tab value="all" icon={<HeartPulseRegular />}>All features</Tab>
              <Tab value="habits" icon={<WaterRegular />}>Healthy habits</Tab>
              <Tab value="environment" icon={<WeatherSunnyRegular />}>Environment</Tab>
              <Tab value="privacy" icon={<ShieldCheckmarkRegular />}>Privacy</Tab>
            </TabList>
            <div className="wellbeing-tab-panel" role="tabpanel">
              <WellbeingFeatureList features={visibleFeatures} />
            </div>
          </section>
          <Card className="wellbeing-boundary-card" appearance="filled-alternative">
            <CardHeader
              header={<Text weight="semibold">A clear wellbeing boundary</Text>}
              description="This is an educational model, not a medical or monitoring device."
            />
            <div className="boundary-points">
              <div><ShieldCheckmarkRegular /><Text>Non-diagnostic suggestions only</Text></div>
              <div><HeartPulseRegular /><Text>Supportive prompts, never a judgment</Text></div>
              <div><WaterRegular /><Text>No personal wellbeing data stored</Text></div>
            </div>
          </Card>
        </DataStateView>
      </div>
    </PageTransition>
  );
}
