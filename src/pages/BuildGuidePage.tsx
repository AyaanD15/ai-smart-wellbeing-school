import { Text } from '@fluentui/react-components';
import { ClipboardTaskRegular } from '@fluentui/react-icons';
import { BuildGuide } from '../components/BuildGuide';
import { DataStateView } from '../components/DataStateView';
import { HeroSection } from '../components/HeroSection';
import { PageTransition } from '../components/PageTransition';

export function BuildGuidePage() {
  return (
    <PageTransition>
      <div className="page-stack">
        <HeroSection
          eyebrow="Plan · Build · Test"
          title="Build Guide"
          description="A practical path from the 100 × 120 cm base to a tested, safe, and exhibition-ready school model."
          primaryLabel="Review the construction checklist"
          primaryTo="/build-guide#construction-checklist"
          secondaryLabel="Explore campus buildings"
          secondaryTo="/buildings"
        />
        <DataStateView
          emptyTitle="Your build guide is ready"
          emptyDescription="Construction stages, materials, wiring, and tests are bundled locally in this guide."
          emptyAction="Show the build guide"
        >
          <BuildGuide />
        </DataStateView>
        <div className="safety-footnote">
          <ClipboardTaskRegular aria-hidden="true" />
          <Text size={200}>Build with adult supervision. Disconnect power before wiring, and keep moving parts guarded.</Text>
        </div>
      </div>
    </PageTransition>
  );
}
