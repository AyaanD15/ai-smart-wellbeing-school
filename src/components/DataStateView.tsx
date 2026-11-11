import {
  Body1,
  Button,
  Card,
  MessageBar,
  MessageBarBody,
  Skeleton,
  SkeletonItem,
  Title3,
} from '@fluentui/react-components';
import { ArrowClockwiseRegular, BookOpenRegular, WarningRegular } from '@fluentui/react-icons';
import type { ReactNode } from 'react';
import { setPreviewState, usePreviewState } from '../app/previewState';

interface DataStateViewProps {
  children: ReactNode;
  emptyTitle: string;
  emptyDescription: string;
  emptyAction: string;
}

export function DataStateView({
  children,
  emptyTitle,
  emptyDescription,
  emptyAction,
}: DataStateViewProps) {
  const state = usePreviewState();

  if (state === 'loading') {
    return (
      <section className="state-surface" aria-label="Loading project information" aria-busy="true">
        <Skeleton>
          <SkeletonItem className="state-skeleton-title" />
          <SkeletonItem className="state-skeleton-row" />
          <SkeletonItem className="state-skeleton-row" />
          <SkeletonItem className="state-skeleton-row" />
        </Skeleton>
      </section>
    );
  }

  if (state === 'error') {
    return (
      <MessageBar intent="error" className="state-message">
        <MessageBarBody>
          <span>Project information could not be loaded. Your locally bundled exhibition content is still available.</span>
          <Button
            appearance="subtle"
            icon={<ArrowClockwiseRegular />}
            onClick={() => setPreviewState('data')}
          >
            Reload project information
          </Button>
        </MessageBarBody>
      </MessageBar>
    );
  }

  if (state === 'empty') {
    return (
      <Card className="empty-state" appearance="outline">
        <BookOpenRegular className="empty-state__icon" aria-hidden="true" />
        <Title3 as="h3">{emptyTitle}</Title3>
        <Body1>{emptyDescription}</Body1>
        <Button
          appearance="primary"
          icon={<WarningRegular />}
          onClick={() => setPreviewState('data')}
        >
          {emptyAction}
        </Button>
      </Card>
    );
  }

  return <>{children}</>;
}
