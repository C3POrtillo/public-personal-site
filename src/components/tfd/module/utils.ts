import type {
  FormattedModuleData,
  ModuleAPIData,
  ModuleClassTypes,
  ModuleTiersType,
  ModuleTypes,
} from '@/components/tfd/module/types';

import { transcendentMap } from '@/components/tfd/module/types';

export const formatModules = (modules: ModuleAPIData[]): FormattedModuleData =>
  modules.reduce((acc, module) => {
    const { module_name, module_stat, module_tier } = module;
    if (!module.module_type) {
      module.module_type = 'None';
    }
    if (module_stat[0].module_capacity === 0) {
      module.module_stat = module_stat.map((stat, index) => {
        stat.module_capacity = index;

        return stat;
      });
      module.module_type = 'Sub-Attack';
    }
    if (module_tier === 'Transcendent') {
      Object.entries(transcendentMap).every(([descendant, mods]) => {
        if (mods.includes(module_name)) {
          module.module_type = descendant as ModuleTypes;

          return false;
        }

        return true;
      });
    }

    const { module_class, module_socket_type, module_type } = module;

    ((acc[module_class] ??= {} as FormattedModuleData[ModuleClassTypes])[module_tier] ??=
      {} as FormattedModuleData[ModuleClassTypes][ModuleTiersType])[module_type] ??=
      {} as FormattedModuleData[ModuleClassTypes][ModuleTiersType][ModuleTypes];

    (acc[module_class][module_tier][module_type][module_socket_type] ??= [] as ModuleAPIData[]).push(module);

    return acc;
  }, {} as FormattedModuleData);

export const flattenModules = <T>(obj: Record<string, unknown>): ModuleAPIData[] =>
  Object.values(obj).flatMap(value =>
    value !== null && typeof value === 'object' && (value as Array<T>).length === undefined
      ? flattenModules<T>(value as Record<string, unknown>)
      : value,
  ) as ModuleAPIData[];

export const filterModules = (
  obj: Record<string, unknown>,
  filter: Record<string, boolean | undefined>,
  search: string,
  except?: ModuleAPIData[],
): ModuleAPIData[] =>
  Object.entries(obj).flatMap(([key, value]) => {
    if (value !== null && typeof value === 'object') {
      if (filter[key]) {
        if ((value as ModuleAPIData[]).length === undefined) {
          return filterModules(value as Record<string, unknown>, filter, search, except);
        }

        return (value as ModuleAPIData[]).filter(({ module_name, module_type, module_stat }) => {
          const regex = new RegExp(search, 'i');
          const noOverlap = !except?.length || except.every(compare => module_name !== compare.module_name);
          const validSearch =
            !search || regex.test(module_name) || regex.test(module_type) || regex.test(module_stat?.[0]?.value);

          return noOverlap && validSearch;
        });
      }
    }

    return [];
  });
