import { useRouter } from 'next/router';
import { createContext, useContext, useState } from 'react';

import type { BuildData, LiveModuleData } from '@/components/tfd/builds/types';
import type { FormattedExternalComponent } from '@/components/tfd/externalComponents/types';
import type { FormattedReactorData } from '@/components/tfd/reactor/types';
import type { Dispatch, FC, PropsWithChildren, SetStateAction } from 'react';

import { useAuth } from '@/components/tfd/accounts/AuthProvider';
import { averageComponentSubstats, componentMap } from '@/components/tfd/builds/types';
import { getModuleCost } from '@/components/tfd/builds/utils';
import { kebabCase } from '@/utils/utils';

interface BuildContextType extends Partial<BuildData> {
  build: 'descendant' | 'weapon';
  activator: boolean;
  setActivator: Dispatch<SetStateAction<boolean>>;
  currentCost: number;
  maxCost: number;
  modules: (LiveModuleData | null)[];
  setModules: Dispatch<SetStateAction<(LiveModuleData | null)[]>>;
  stats: Record<string, number>;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
  buildFor: string;
  save: () => void;
  isValid: boolean;
  reactor: FormattedReactorData | null;
  setReactor: Dispatch<SetStateAction<FormattedReactorData | null>>;
  equippedComponents: (FormattedExternalComponent | null)[];
  setEquippedComponents: Dispatch<SetStateAction<(FormattedExternalComponent | null)[]>>;
}

const BuildContext = createContext<BuildContextType | undefined>(undefined);

interface BuildProviderProps extends Partial<BuildData>, PropsWithChildren {
  build: 'descendant' | 'weapon';
  buildFor: string;
}

export const BuildProvider: FC<BuildProviderProps> = ({
  children,
  build,
  buildFor,
  description: importDescription,
  modules: importModules,
  equipment,
  title: importTitle,
  activator: importActivator,
  ...props
}) => {
  const isDescendant = build === 'descendant';
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [title, setTitle] = useState(importTitle ?? '');
  const [description, setDescription] = useState(importDescription ?? '');
  const [activator, setActivator] = useState(importActivator ?? true);
  const [modules, setModules] = useState<(LiveModuleData | null)[]>(
    importModules ?? Array(isDescendant ? 12 : 10).fill(null),
  );
  const [reactor, setReactor] = useState<FormattedReactorData | null>(equipment?.reactor ?? null);
  const [equippedComponents, setEquippedComponents] = useState<(FormattedExternalComponent | null)[]>(
    equipment?.equippedComponents ?? Array(4).fill(null),
  );

  const baseCost = isDescendant ? 40 : 50;
  const activatorBonus = activator ? 30 : 0;
  const subAttack = isDescendant ? modules[6] : null;
  const subAttackBonus = subAttack ? getModuleCost(subAttack, subAttack.level, subAttack.catalyst, true) : 0;
  const maxCost = baseCost + activatorBonus + subAttackBonus;

  const { cost, ...stats } = modules.reduce((acc, module) => {
    if (module && module.module_type !== 'Sub-Attack') {
      const { level, catalyst, module_tier, module_stat } = module;
      if (['Standard', 'Rare'].includes(module_tier)) {
        module_stat[level].value.split(', ').forEach(stat => {
          const match = stat.match(/ ([-+])/);
          if (match) {
            const sign = match[1] === '+' ? 1 : -1;
            const [key, value] = stat.split(match[0]);
            const formattedKey = value.includes('%') ? `${key}%` : key;
            acc[formattedKey] ??= 0;
            acc[formattedKey] += parseFloat(value) * sign;
            acc[formattedKey] = Number(acc[formattedKey].toFixed(2));
          }
        });
      }
      acc['cost'] = (acc['cost'] || 0) + getModuleCost(module, level, catalyst);
    }

    return acc;
  }, {} as Record<string, number>);

  if (reactor) {
    reactor.skill_power_coefficient.forEach(({ coefficient_stat_id, coefficient_stat_value }) => {
      stats[coefficient_stat_id] = coefficient_stat_value;
    });
    stats['Skill Power'] = reactor.skill_atk_power;
    stats['Sub-Attack Power'] = reactor.sub_skill_atk_power;
    stats['Optimization Skill Power Multiplier%'] = reactor.tier === 'Ultimate' ? 160 : 140;
  }

  equippedComponents.forEach(component => {
    if (component) {
      const { stat, external_component_name } = component;
      const statKey = Object.keys(componentMap).find(componentName =>
        external_component_name.includes(componentName),
      ) as keyof typeof componentMap;

      if (statKey) {
        const key = componentMap[statKey];
        stats[key] ??= 0;
        stats[key] += averageComponentSubstats[key];
      }

      const { stat_id, stat_value } = stat;
      if (stat_id) {
        const key = stat_id.match(/HP|Shield/) ? `Max ${stat_id}` : stat_id;
        stats[key] ??= 0;
        stats[key] += stat_value;
      }
    }
  });

  const currentCost = cost || 0;

  const isValid = !!(
    isAuthenticated &&
    currentCost <= maxCost &&
    title &&
    modules.length &&
    (!isDescendant || (reactor && equippedComponents.every(component => component)))
  );

  const save = async () => {
    if (!isValid) {
      return;
    }

    const url = '/api/exportBuildData';
    const buildData = {
      id: props.id || null,
      user_id: isAuthenticated.id,
      title,
      description,
      modules,
      equipment: { reactor, equippedComponents },
      activator,
      build,
      buildFor,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }

      router.push(`/tfd/builds/${build}s/${kebabCase(buildFor)}/`);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  return (
    <BuildContext.Provider
      value={{
        buildFor,
        build,
        activator,
        setActivator,
        currentCost,
        maxCost,
        modules,
        setModules,
        stats,
        title,
        setTitle,
        description,
        setDescription,
        save,
        isValid,
        reactor,
        setReactor,
        equippedComponents,
        setEquippedComponents,
        ...props,
      }}
    >
      {children}
    </BuildContext.Provider>
  );
};

export const useBuild = (): BuildContextType => {
  const context = useContext(BuildContext);
  if (!context) {
    throw new Error('useBuild must be used within an BuildProvider');
  }

  return context;
};
