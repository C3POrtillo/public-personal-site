import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';

import type { FormattedWeaponData } from '@/components/tfd/weapon/types';
import type { FC } from 'react';

import Container from '@/components/container/Container';
import Button from '@/components/inputs/Button/Button';
import BaseStatsCard from '@/components/tfd/builds/BaseStatsCard';
import BuildModuleCardGrid from '@/components/tfd/builds/BuildModuleCardGrid';
import { useBuild } from '@/components/tfd/builds/BuildProvider';
import ModuleStatsCard from '@/components/tfd/builds/ModuleStatsCard';
import UpvoteButtons from '@/components/tfd/builds/UpvoteButtons';
import { getBuildDPS } from '@/components/tfd/builds/utils';
import WeaponBuildCard from '@/components/tfd/builds/weapons/WeaponBuildCard';
import WeaponPerk from '@/components/tfd/builds/weapons/WeaponPerk';
import { joinStrings } from '@/utils/utils';

interface WeaponBuildProps {
  weapon: FormattedWeaponData;
}

const WeaponBuild: FC<WeaponBuildProps> = ({ weapon }) => {
  const { stats, setModules, updated_at, modules, title, id, upvotes, downvotes, username, description } = useBuild();
  const [cardPanel, setCardPanel] = useState<'modifiers' | 'stats'>('modifiers');
  const [cardTab, setCardTab] = useState<'modules' | 'guide'>('modules');
  const isStats = cardPanel === 'modifiers';
  const isModuleTab = cardTab === 'modules';
  const date = new Date(updated_at || Date.now()).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });

  useEffect(() => {
    setModules(modules);
  }, []);
  const dps = getBuildDPS(stats, { ...weapon });

  return (
    // eslint-disable-next-line tailwindcss/no-arbitrary-value
    <Container className="attributes zones tiers rounds 2xl:max-w-[95vw]">
      {/* eslint-disable-next-line tailwindcss/no-arbitrary-value */}
      <div className="flex w-full flex-col overflow-hidden rounded-xl border-2 border-black bg-neutral-900 shadow-lg shadow-black xl:max-w-[1618px] xl:flex-row">
        <div className="flex flex-col gap-4 px-4 py-2 lg:min-w-96 lg:pr-2">
          <div className="flex flex-row gap-2">
            <Button size="button-sm" onClick={() => setCardTab('modules')} selected={isModuleTab}>
              Modules
            </Button>
            <Button size="button-sm" onClick={() => setCardTab('guide')} selected={!isModuleTab}>
              Guide
            </Button>
          </div>
          <WeaponBuildCard {...weapon} />
          <div className="flex flex-row gap-2">
            <Button size="button-sm" onClick={() => setCardPanel('modifiers')} selected={isStats}>
              Modifiers
            </Button>
            <Button size="button-sm" onClick={() => setCardPanel('stats')} selected={!isStats}>
              Stats
            </Button>
          </div>
          <div className="flex w-full flex-row items-center justify-center gap-2 self-center overflow-hidden whitespace-pre-wrap rounded-lg border-2 border-black bg-neutral-700 p-2 text-lg shadow-inner shadow-black">
            <span>
              {'DPS:'} {`${dps['DPS']}`}
            </span>
            <span>|</span>
            <span className="text-yellow-200">Weak Point: {`${dps['Weak Point DPS']}`}</span>
          </div>
          {isStats ? <ModuleStatsCard /> : <BaseStatsCard baseStats={weapon.base_stat} />}
        </div>
        <div
          className={joinStrings([
            'flex h-[712px] w-full overflow-auto xl:items-center',
            isModuleTab ? undefined : 'hidden',
          ])}
        >
          <BuildModuleCardGrid disabled />
        </div>
        <div className={joinStrings(['flex h-[712px] w-full flex-col gap-2 p-2', isModuleTab ? 'hidden' : undefined])}>
          <div>
            <div className="flex flex-row justify-between">
              <h2 className="flex items-center p-1 text-2xl lg:p-0">{title}</h2>
              <UpvoteButtons buildId={id} upvotes={upvotes || 0} downvotes={downvotes || 0} isRow />
            </div>
            <span>
              By: {username} | {date}
            </span>
          </div>
          {/* eslint-disable-next-line tailwindcss/no-arbitrary-value */}
          <div className="custom-html-style h-full overflow-auto rounded-lg border-2 border-black bg-neutral-700 p-4 shadow-inner shadow-black md:max-h-[600px]">
            {description && <Markdown>{description}</Markdown>}
            <WeaponPerk {...weapon} />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default WeaponBuild;
