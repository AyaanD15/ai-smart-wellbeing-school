import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { FluentProvider } from '@fluentui/react-components';
import { lightTheme } from '../src/app/theme';

export function renderWithApp(element: ReactElement) {
  return render(
    <FluentProvider theme={lightTheme}>
      {element}
    </FluentProvider>,
  );
}
