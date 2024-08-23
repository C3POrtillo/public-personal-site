import { useEffect, useState } from 'react';

import type { FilterOptionsData } from '@/components/inputs/types';
import type { ModuleFilterMap, TierTypeData } from '@/components/tfd/module/types';
import type { FormattedWeaponData } from '@/components/tfd/weapon/types';
import type { FC } from 'react';

import Container from '@/components/container/Container';
import Button from '@/components/inputs/Button/Button';
import FilterOptions from '@/components/inputs/Checkbox/FilterOptions';
import MarkdownEditor from '@/components/inputs/Markdown/MarkdownEditor';
import Text from '@/components/inputs/Text/Text';
import { useAuth } from '@/components/tfd/accounts/AuthProvider';
import BaseStatsCard from '@/components/tfd/builds/BaseStatsCard';
import BuildModuleCardGrid from '@/components/tfd/builds/BuildModuleCardGrid';
import { useBuild } from '@/components/tfd/builds/BuildProvider';
import ModuleStatsCard from '@/components/tfd/builds/ModuleStatsCard';
import { getBuildDPS, isValidModule } from '@/components/tfd/builds/utils';
import WeaponBuildCard from '@/components/tfd/builds/weapons/WeaponBuildCard';
import WeaponPerk from '@/components/tfd/builds/weapons/WeaponPerk';
import ModuleCard from '@/components/tfd/module/ModuleCard';
import { socketOptions, tierOptions } from '@/components/tfd/module/types';
import { filterModules, flattenModules } from '@/components/tfd/module/utils';
import { joinStrings } from '@/utils/utils';

interface WeaponBuilderProps {
  modules: TierTypeData;
  filterMap: ModuleFilterMap;
  weapon: FormattedWeaponData;
  typeOptions: FilterOptionsData;
}

const WeaponBuilder: FC<WeaponBuilderProps> = ({ modules, filterMap, weapon, typeOptions }) => {
  const {
    stats,
    modules: buildModules,
    setModules,
    title,
    setTitle,
    description,
    setDescription,
    save,
    isValid,
  } = useBuild();
  const { isAuthenticated } = useAuth();
  const [selected, setSelected] = useState<number | undefined>(undefined);
  const [filteredModules, setFilteredModules] = useState(flattenModules(modules));
  const [searchFilter, setSearchFilter] = useState('');
  const [filter, setFilter] = useState(filterMap);
  const [cardTab, setCardTab] = useState<'modules' | 'guide'>('modules');
  const [cardPanel, setCardPanel] = useState<'modifiers' | 'stats'>('modifiers');
  const isModuleTab = cardTab === 'modules';
  const isStats = cardPanel === 'modifiers';
  const cannotSave = !isAuthenticated || !isValid;
  const dps = getBuildDPS(stats, { ...weapon });

  useEffect(() => {
    const except = buildModules.filter(module => !!module);
    setFilteredModules(filterModules(modules, filter, searchFilter, except));
  }, [filter, searchFilter, buildModules]);

  const moduleCards = filteredModules.map(module => {
    const canAdd = isModuleTab && selected !== undefined && isValidModule(module, buildModules, buildModules[selected]);
    const onClick =
      canAdd &&
      (() => {
        const liveModule = {
          ...module,
          level: module.module_stat.length - 1,
        };
        buildModules[selected] = liveModule;
        setModules([...buildModules]);
        setSelected(selected < buildModules.length - 1 ? selected + 1 : 0);
      });
    const cursorClass = canAdd ? 'cursor-pointer' : undefined;

    return (
      <div className={cursorClass} key={module.module_id}>
        <ModuleCard {...module} onClick={onClick || undefined} isMaxLevel={true} />
      </div>
    );
  });

  return (
    <>
      {/* eslint-disable-next-line tailwindcss/no-arbitrary-value */}
      <Container className="attributes zones tiers rounds 2xl:max-w-[95vw]">
        {/* eslint-disable-next-line tailwindcss/no-arbitrary-value */}
        <div className="flex w-full flex-col overflow-hidden rounded-xl border-2 border-black bg-neutral-900 shadow-lg shadow-black xl:max-w-[1618px] xl:flex-row">
          <div className="flex flex-col gap-4 px-4 py-2 lg:min-w-96 lg:pr-2">
            <div className="flex flex-row gap-2">
              <Button size="button-sm" onClick={() => setCardTab('modules')} selected={isModuleTab}>
                Modules
              </Button>
              <Button size="button-sm" onClick={() => setCardTab('guide')} selected={!isModuleTab}>
                Save
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
            <BuildModuleCardGrid selected={selected} setSelected={setSelected} />
          </div>
          <div
            className={joinStrings(['flex h-[712px] w-full flex-col gap-2 p-2', isModuleTab ? 'hidden' : undefined])}
          >
            <div className="flex w-full flex-row items-center justify-between gap-2">
              <Text label="Title" value={title} setState={setTitle} placeholder="Build Title" labelHidden required />
              <div>
                <Button size="button-sm" onClick={save} error={cannotSave}>
                  Post Build
                </Button>
              </div>
            </div>
            <MarkdownEditor value={description} onChange={setDescription}>
              <WeaponPerk {...weapon} />
            </MarkdownEditor>
          </div>
        </div>
      </Container>
      <Container className="rounds tiers mt-4">
        <div className="flex w-full flex-col justify-center gap-4 2xl:flex-row">
          <div className="2xl:sticky-below-header flex h-min flex-row justify-center gap-4 2xl:w-1/6 2xl:flex-col">
            {/* eslint-disable-next-line tailwindcss/no-arbitrary-value */}
            <div className="2xl:scroll-bar-left scroll-bar-thin flex flex-row flex-wrap items-start justify-center gap-4 2xl:max-h-[90vh] 2xl:overflow-auto 2xl:px-2 2xl:pb-2">
              <div className="w-full rounded-md border-2 border-black bg-neutral-900 p-2 shadow-md shadow-black">
                <Text label="Name/Stats/Type" setState={setSearchFilter} placeholder="Search..." value={searchFilter} />
              </div>
              {selected !== 0 && (
                <FilterOptions filterOptions={[tierOptions]} filter={filter} setFilter={setFilter} type="accordion" />
              )}
              <FilterOptions filterOptions={[socketOptions]} filter={filter} setFilter={setFilter} type="accordion" />
              {selected !== 0 && selected !== 6 && (
                <FilterOptions
                  checkboxContainerClasses="grid-cols-1 md:grid-cols-4 2xl:grid-cols-1"
                  filterOptions={[typeOptions]}
                  filter={filter}
                  setFilter={setFilter}
                  type="accordion"
                />
              )}
            </div>
          </div>
          <div className="mt-4 flex flex-row flex-wrap justify-center gap-x-4 gap-y-8 2xl:mt-0 2xl:w-5/6">
            {moduleCards}
          </div>
        </div>
      </Container>
    </>
  );
};

export default WeaponBuilder;
