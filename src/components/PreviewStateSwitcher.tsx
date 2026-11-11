import { Button, Card, Text } from '@fluentui/react-components';
import { usePreviewState, setPreviewState, type PreviewDataState } from '../app/previewState';

const previewOptions: { state: PreviewDataState; label: string }[] = [
  { state: 'data', label: 'Data' },
  { state: 'loading', label: 'Loading' },
  { state: 'empty', label: 'Empty' },
  { state: 'error', label: 'Error' },
];

export function PreviewStateSwitcher() {
  const selectedState = usePreviewState();

  if (!import.meta.env.DEV) return null;

  return (
    <Card className="preview-switcher" appearance="filled-alternative">
      <Text size={200} weight="semibold">Preview state</Text>
      <div className="preview-switcher__buttons" role="group" aria-label="Preview data state">
        {previewOptions.map(({ state, label }) => (
          <Button
            key={state}
            size="small"
            appearance={selectedState === state ? 'primary' : 'subtle'}
            aria-pressed={selectedState === state}
            onClick={() => setPreviewState(state)}
          >
            {label}
          </Button>
        ))}
      </div>
    </Card>
  );
}
