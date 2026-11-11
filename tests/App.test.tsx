import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from '../src/app/App';
import { setPreviewState } from '../src/app/previewState';
import { renderWithApp } from './test-utils';

describe('AI Smart Wellbeing School app', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/');
    setPreviewState('data');
  });

  it('renders the campus summary and the four photographed campus zones', () => {
    renderWithApp(<App />);

    expect(screen.getByRole('heading', { name: 'Campus Overview' })).toBeInTheDocument();
    expect(screen.getByText(/Website by Ayaan Dongre/)).toBeInTheDocument();
    expect(screen.getByText('AI Smart Wellbeing School with four connected learning zones')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Bright, calm shared learning space with natural light' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Sunlit classroom arranged for collaborative learning' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Green garden path with plants and a restful atmosphere' })).toBeInTheDocument();
  });

  it('navigates to building details and shows the approved area records', async () => {
    const user = userEvent.setup();
    renderWithApp(<App />);

    await user.click(screen.getByRole('tab', { name: 'Buildings' }));

    expect(await screen.findByRole('heading', { name: 'Building Detail' })).toBeInTheDocument();
    expect(screen.getAllByText('1,400 cm²')).toHaveLength(2);
    expect(screen.getAllByText('1,600 cm²')).toHaveLength(2);
    expect(screen.getAllByText('AI Wellbeing Centre')).toHaveLength(2);
  });

  it('opens the interactive model and switches its view and selected zone', async () => {
    const user = userEvent.setup();
    renderWithApp(<App />);

    await user.click(screen.getByRole('tab', { name: '3D model' }));

    expect(await screen.findByRole('heading', { name: 'Explore the 3D Model' })).toBeInTheDocument();
    expect(screen.getByText(/large side-mounted LCD/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Isometric 3D' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('group', { name: 'Accessible 3D camera controls' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Rotate left' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Top-down plan' }));
    expect(screen.getByRole('group', { name: /Top-down campus layout plan/ })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Smart Classrooms' }));
    expect(screen.getByRole('heading', { name: 'Smart Classrooms' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Hydration reminder' }));
    expect(screen.getByText('Hydration break: take a sip of water.')).toBeInTheDocument();

    await user.click(screen.getByRole('switch', { name: 'Dim the room (LDR)' }));
    expect(screen.getByText('OFF')).toBeInTheDocument();
    await user.click(screen.getByRole('switch', { name: 'Simulate PIR motion' }));
    expect(screen.getByText('Motion detected')).toBeInTheDocument();
    expect(screen.getByText('ON')).toBeInTheDocument();

    await user.click(screen.getByRole('switch', { name: 'Spin garden windmill' }));
    expect(screen.getByText('Stopped')).toBeInTheDocument();
  });

  it('switches between live preview data states and recovers from error', async () => {
    const user = userEvent.setup();
    renderWithApp(<App />);

    await user.click(screen.getByRole('button', { name: 'Loading' }));
    expect(screen.getByLabelText('Loading project information')).toHaveAttribute('aria-busy', 'true');

    await user.click(screen.getByRole('button', { name: 'Error' }));
    expect(screen.getByText(/Project information could not be loaded/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Reload project information' }));
    expect(screen.getByRole('heading', { name: 'Four zones, one healthier campus' })).toBeInTheDocument();
  });
});
