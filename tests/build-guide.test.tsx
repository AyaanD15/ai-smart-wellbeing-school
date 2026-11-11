import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from '../src/app/App';
import { setPreviewState } from '../src/app/previewState';
import { renderWithApp } from './test-utils';

describe('Build guide', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/build-guide');
    setPreviewState('data');
  });

  it('shows the approved construction stages and status values', () => {
    renderWithApp(<App />);

    expect(screen.getByRole('heading', { name: 'Build Guide' })).toBeInTheDocument();
    expect(screen.getByText('Mark the 100 × 120 cm base and dimensioned four-zone campus placement')).toBeInTheDocument();
    expect(screen.getByText('Install LCDs, sensors, LEDs, buttons, buzzer, and moving mechanisms using compatible 5V wiring')).toBeInTheDocument();
    expect(screen.getAllByText('Pending')).toHaveLength(3);
  });

  it('calculates and displays the AED planning estimate', async () => {
    const user = userEvent.setup();
    renderWithApp(<App />);

    await user.click(screen.getByRole('tab', { name: 'AED materials' }));

    expect(screen.getByRole('heading', { name: 'AED bill of materials' })).toBeInTheDocument();
    expect(screen.getByText('266 AED')).toBeInTheDocument();
    expect(screen.getByText(/Prices are approximate AED planning estimates/)).toBeInTheDocument();
  });

  it('keeps a build note in page memory only', async () => {
    const user = userEvent.setup();
    renderWithApp(<App />);

    await user.type(screen.getByRole('textbox', { name: 'Build note' }), 'Base measurements verified.');
    await user.click(screen.getByRole('button', { name: 'Keep note for this session' }));

    expect(screen.getByRole('status')).toHaveTextContent('Note kept in this page session only; nothing was stored.');
    expect(window.localStorage.getItem('wellbeing-school-build-note')).toBeNull();
  });
});
