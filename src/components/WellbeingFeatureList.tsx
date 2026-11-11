import {
  Badge,
  Body1,
  Card,
  CardFooter,
  CardHeader,
  CardPreview,
  Text,
} from '@fluentui/react-components';
import { ShieldCheckmarkRegular } from '@fluentui/react-icons';
import type { WellbeingFeature } from '../data/wellbeing';

interface WellbeingFeatureListProps {
  features: WellbeingFeature[];
}

export function WellbeingFeatureList({ features }: WellbeingFeatureListProps) {
  return (
    <div className="feature-grid">
      {features.map((feature) => (
        <Card key={feature.id} className="feature-card" appearance="outline">
          <CardPreview className="feature-card__preview">
            <img src={feature.image} alt={feature.imageAlt} loading="lazy" />
          </CardPreview>
          <CardHeader
            header={<Text weight="semibold">{feature.feature}</Text>}
            description={<Badge appearance="tint" color="brand">{feature.category}</Badge>}
          />
          <div className="feature-card__body"><Body1>{feature.example}</Body1></div>
          <CardFooter className="feature-card__footer">
            <Badge appearance="tint" color={feature.status === 'Ready' ? 'success' : 'warning'}>
              {feature.status}
            </Badge>
            {feature.id === 'privacy-protection' && (
              <Text size={200} className="privacy-cue"><ShieldCheckmarkRegular aria-hidden="true" />Privacy first</Text>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
