import { Button, Card, Text, Title1 } from '@fluentui/react-components';
import { ArrowRightRegular, BookOpenRegular } from '@fluentui/react-icons';

interface HeroSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryTo: string;
  secondaryLabel: string;
  secondaryTo: string;
}

export function HeroSection({
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryTo,
  secondaryLabel,
  secondaryTo,
}: HeroSectionProps) {
  return (
    <Card className="hero-panel" appearance="filled-alternative">
      <svg className="hero-mesh" aria-hidden="true" viewBox="0 0 800 400" preserveAspectRatio="none">
        <defs>
          <radialGradient id="hero-accent" cx="0%" cy="0%" r="80%">
            <stop offset="0%" stopColor="var(--brand-accent)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--brand-accent)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hero-brand" cx="100%" cy="100%" r="80%">
            <stop offset="0%" stopColor="var(--brand-primary)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--brand-primary)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="800" height="400" fill="url(#hero-accent)" />
        <rect width="800" height="400" fill="url(#hero-brand)" />
      </svg>
      <div className="hero-panel__content">
        <Text className="eyebrow"><span aria-hidden="true" />{eyebrow}</Text>
        <Title1 as="h1" className="hero-panel__title">{title}</Title1>
        <Text className="hero-panel__description">{description}</Text>
        <div className="hero-panel__actions">
          <Button
            as="a"
            href={primaryTo}
            appearance="primary"
            icon={<ArrowRightRegular />}
            iconPosition="after"
          >
            {primaryLabel}
          </Button>
          <Button
            as="a"
            href={secondaryTo}
            appearance="outline"
            icon={<BookOpenRegular />}
          >
            {secondaryLabel}
          </Button>
        </div>
      </div>
      <div className="hero-panel__aside" aria-label="Project dimensions and zones">
        <Text className="hero-panel__aside-kicker">Project focus</Text>
        <Text className="hero-panel__aside-title">Student wellbeing support</Text>
        <Text className="hero-panel__aside-copy">
          Blending working Arduino demonstrations, safe wellbeing guidance, and healthy lifestyle education into one physical showcase.
        </Text>
        <div className="hero-panel__metrics">
          <div><strong>100 × 120</strong><span>cm model base</span></div>
          <div><strong>4</strong><span>connected zones</span></div>
          <div><strong>5V</strong><span>safe demos</span></div>
        </div>
      </div>
    </Card>
  );
}
