import { Badge, Body1, Button, Card, CardFooter, CardHeader, CardPreview, Text } from '@fluentui/react-components';
import { ArrowRightRegular, LocationRegular } from '@fluentui/react-icons';
import type { Building } from '../data/buildings';

interface BuildingCardProps {
  building: Building;
}

export function BuildingCard({ building }: BuildingCardProps) {
  return (
    <Card id={building.id} className="building-card" appearance="outline">
      <CardPreview className="building-card__preview">
        <img src={building.image} alt={building.imageAlt} loading="lazy" />
        <Badge className="building-card__badge" appearance="filled" color="brand">{building.area}</Badge>
      </CardPreview>
      <CardHeader
        header={<Text weight="semibold">{building.name}</Text>}
        description={<span className="building-card__zone"><LocationRegular aria-hidden="true" />{building.zone}</span>}
      />
      <div className="building-card__body">
        <Body1>{building.purpose}</Body1>
        <Text size={200} className="muted-copy">{building.details}</Text>
      </div>
      <CardFooter className="building-card__footer">
        <Badge appearance="tint" color="warning">{building.status}</Badge>
        <Button
          as="a"
          href={`/buildings#${building.id}`}
          appearance="subtle"
          icon={<ArrowRightRegular />}
          aria-label={`Explore ${building.name}`}
        >
          Explore zone
        </Button>
      </CardFooter>
    </Card>
  );
}
