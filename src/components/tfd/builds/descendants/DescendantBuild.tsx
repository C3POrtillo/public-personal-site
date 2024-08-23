import { useState } from 'react';
import Markdown from 'react-markdown';

import type { FormattedDescendantData } from '@/components/tfd/descendants/types';
import type { FC } from 'react';

import Container from '@/components/container/Container';
import Button from '@/components/inputs/Button/Button';
import BaseStatsCard from '@/components/tfd/builds/BaseStatsCard';
import BuildModuleCardGrid from '@/components/tfd/builds/BuildModuleCardGrid';
import { useBuild } from '@/components/tfd/builds/BuildProvider';
import ModuleStatsCard from '@/components/tfd/builds/ModuleStatsCard';
import UpvoteButtons from '@/components/tfd/builds/UpvoteButtons';
import DescendantBuildCard from '@/components/tfd/builds/descendants/DescendantBuildCard';
import EquipmentCardGrid from '@/components/tfd/builds/descendants/EquipmentCardGrid';
import SetData from '@/components/tfd/builds/descendants/SetData';
import { joinStrings } from '@/utils/utils';

interface BuilderProps {
  descendant: FormattedDescendantData;
}

const DescendantBuild: FC<BuilderProps> = ({ descendant }) => {
  const { equippedComponents, updated_at, title, id, upvotes, downvotes, username, description } = useBuild();
  const [cardPanel, setCardPanel] = useState<'modifiers' | 'stats'>('modifiers');
  const [cardTab, setCardTab] = useState<'modules' | 'guide'>('modules');
  const isStats = cardPanel === 'modifiers';
  const isModuleTab = cardTab === 'modules';
  const date = new Date(updated_at || Date.now()).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });

  return (
    // eslint-disable-next-line tailwindcss/no-arbitrary-value
    <Container className="attributes tiers zones 2xl:max-w-[95vw]">
      {/* eslint-disable-next-line tailwindcss/no-arbitrary-value */}
      <div className="flex w-full flex-col overflow-hidden rounded-xl border-2 border-black bg-neutral-900 shadow-lg shadow-black xl:max-w-[1618px] xl:flex-row">
        <div className="flex flex-col gap-4 px-4 py-2 lg:pr-2">
          <div className="flex flex-row gap-2">
            <Button size="button-sm" onClick={() => setCardTab('modules')} selected={isModuleTab}>
              Modules
            </Button>
            <Button size="button-sm" onClick={() => setCardTab('guide')} selected={!isModuleTab}>
              Equipment/Guide
            </Button>
          </div>
          <DescendantBuildCard {...descendant} disabled />
          <div className="flex flex-row gap-2">
            <Button size="button-sm" onClick={() => setCardPanel('modifiers')} selected={isStats}>
              Modifiers
            </Button>
            <Button size="button-sm" onClick={() => setCardPanel('stats')} selected={!isStats}>
              Stats
            </Button>
          </div>
          {isStats ? <ModuleStatsCard /> : <BaseStatsCard baseStats={descendant.descendant_stat.stat_detail} />}
        </div>
        <div
          className={joinStrings([
            'flex h-[692px] w-full overflow-auto xl:items-center',
            isModuleTab ? undefined : 'hidden',
          ])}
        >
          <BuildModuleCardGrid disabled />
        </div>
        <div
          className={joinStrings([
            'flex w-full flex-col gap-2 overflow-auto p-2 md:h-[692px] md:justify-center',
            isModuleTab ? 'hidden' : undefined,
          ])}
        >
          <div>
            <div className="flex flex-row justify-between">
              <h2 className="flex items-center p-1 text-2xl lg:p-0">{title}</h2>
              <UpvoteButtons buildId={id} upvotes={upvotes || 0} downvotes={downvotes || 0} isRow />
            </div>
            <span>
              By: {username} | {date}
            </span>
          </div>
          <div className="flex h-full flex-col gap-2 md:flex-row">
            <EquipmentCardGrid disabled />
            {/* eslint-disable-next-line tailwindcss/no-arbitrary-value */}
            <div className="custom-html-style h-full overflow-auto rounded-lg border-2 border-black bg-neutral-700 p-4 shadow-inner shadow-black md:max-h-[600px]">
              {description && <Markdown>{description}</Markdown>}
              <SetData components={equippedComponents} />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default DescendantBuild;
