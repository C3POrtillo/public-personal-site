import type { FormattedReactorDataMap, ReactorAPIData, ReactorAttributesType } from '@/components/tfd/reactor/types';

import { reactorAttributes } from '@/components/tfd/reactor/types';

export const formatStat = (stat: string) => {
  switch (true) {
    case /.*Power.*/.test(stat):
      return stat.split(' Power').join('\nPower');
    case /.*When.*/.test(stat):
      return stat.split(' When Attacking ').join('\nWhen Attacking\n');
    case /.*Critical.*/.test(stat):
      return stat.split('Critical ').join('Critical\n');
    case /.*Skill.*/.test(stat):
      return stat.split('Skill ').join('Skill\n');
    case /.*Modifier.*/.test(stat):
      return stat.split(' Modifier').join('\nModifier');
    default:
      return stat;
  }
};

const baseReactorRegex = /^(Frozen|Burning|Tingling|Materialized|Toxic) (Mechanics|Mixture|Phase|Singularity) Reactor$/;

export const formatReactorData = (data: ReactorAPIData[]) => {
  const seenAttributes = new Set<string>();

  return data
    .filter(reactor => {
      if (reactor.reactor_tier === 'Ultimate' && baseReactorRegex.test(reactor.reactor_name)) {
        const firstWord = reactor.reactor_name.split(' ')[0];
        if (!seenAttributes.has(firstWord)) {
          seenAttributes.add(firstWord);

          return true;
        }
      }

      return false;
    })
    .reduce((acc, { reactor_name, reactor_skill_power, ...props }) => {
      const words = reactor_name.split(' ');
      const attribute = words[0] as ReactorAttributesType;

      acc[attribute] ??= {
        attribute,
        ...props,
        ...reactor_skill_power[99],
      };

      return acc;
    }, {} as FormattedReactorDataMap);
};

const priorityOrder = Object.keys(reactorAttributes);

export const getSortedReactors = (data: FormattedReactorDataMap) =>
  Object.values(data).sort(
    (a, b) =>
      priorityOrder.findIndex(priority => a.attribute === priority) -
      priorityOrder.findIndex(priority => b.attribute === priority),
  );
