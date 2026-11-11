import { useSyncExternalStore } from 'react';

export type PreviewDataState = 'data' | 'loading' | 'empty' | 'error';

const states: PreviewDataState[] = ['data', 'loading', 'empty', 'error'];
const changeEvent = 'preview-data-state-change';
let currentState: PreviewDataState | null = null;

function isPreviewState(value: string | null): value is PreviewDataState {
  return states.some((state) => state === value);
}

function readState(): PreviewDataState {
  if (!import.meta.env.DEV) return 'data';
  const queryValue = new URLSearchParams(window.location.search).get('previewState');
  if (isPreviewState(queryValue)) return queryValue;
  return 'data';
}

export function getPreviewState(): PreviewDataState {
  if (currentState === null) currentState = readState();
  return currentState;
}

export function setPreviewState(nextState: PreviewDataState): void {
  if (!import.meta.env.DEV) return;
  currentState = nextState;
  window.dispatchEvent(new Event(changeEvent));
}

function subscribe(callback: () => void): () => void {
  window.addEventListener(changeEvent, callback);
  return () => window.removeEventListener(changeEvent, callback);
}

export function usePreviewState(): PreviewDataState {
  return useSyncExternalStore(subscribe, getPreviewState, () => 'data');
}
