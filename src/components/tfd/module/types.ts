import type { FilterOptionsData } from '@/components/inputs/types';
import type { TiersType } from '@/utils/types';

export const socketImages = {
  Almandine: '/assets/images/module/almandine.png',
  Cerulean: '/assets/images/module/cerulean.png',
  Malachite: '/assets/images/module/malachite.png',
  Rutile: '/assets/images/module/rutile.png',
  Xantic: '/assets/images/module/xantic.png',
};

export const classImages = {
  Descendant: '/assets/images/descendant.png',
  'General Rounds': '/assets/images/rounds/general-rounds.png',
  'High-Power Rounds': '/assets/images/rounds/high-power-rounds.png',
  'Impact Rounds': '/assets/images/rounds/impact-rounds.png',
  'Special Rounds': '/assets/images/rounds/special-rounds.png',
};

export const kuiperCosts = {
  Standard: [300, 600, 1100, 2000, 3400, 5700, 9500, 15500, 25000, 40000],
  Rare: [600, 1200, 2200, 4000, 6800, 11400, 19000, 31000, 50000, 80000],
  Ultimate: [900, 1800, 3300, 6000, 10200, 17100, 28500, 46500, 75000, 120000],
  Transcendent: [1500, 3000, 5500, 10000, 17000, 28500, 47500, 77500, 125000, 200000],
} as const;

export const costTypes = ['Kuiper', 'Gold'] as const;
export const costSublabels = ['Cost', 'Total'] as const;

export const moduleTypes = [
  'None',
  'ATK',
  'Accuracy',
  'Arche Tech',
  'Attack',
  'Attribute ATK',
  'Battle',
  'Bullet Improvement',
  'Control',
  'Cooldown',
  'Defense',
  'Final Hand',
  'Fire Rate',
  'Firearm Critical Hit Damage',
  'Firearm Critical Hit Rate',
  'Fortitude',
  'Guard',
  'HP',
  'Luck',
  'MP',
  'Medical',
  'Range',
  'Recoil',
  'Reload Time Modifier',
  'Resource',
  'Rounds Conversion',
  'Rounds per Magazine',
  'Shield',
  'Special Mod',
  'Strike',
  'Sub-Attack',
  'Support Tech',
  'Weak Point Strike',
] as const;

export const transcendentMap = {
  Ajax: ['Void Explosion', 'Void Charge', 'Matrix Recomputation', 'Body Enhancement'],
  'Ultimate Ajax': ['Life Barrier', 'Void Barrier'],
  Blair: ['Incendiary Bomb', 'Truly Deadly Cuisine', 'Backdraft', 'Classic Chef'],
  Bunny: ['Electric Condense', 'Electric Transition', 'Superconductor', 'Bionic Fuel'],
  'Ultimate Bunny': ['Electric Charge', 'High-Voltage'],
  Enzo: ['Supply Tactical Armor', 'Supply Firearm Enhancer', 'Reinforce Front Line', 'Focus Fire'],
  Esiemo: ['Explosive Evade', 'Cluster Bomb', 'Explosive Propaganda', 'Creative Explosion'],
  Freyna: ['Contagion', 'Toxic Stimulation', 'Venom Synthesis', 'Neurotoxin Synthesis'],
  Gley: ['Super Senses', 'Massive Sanguification', 'Predator Instinct', 'Blood and Iron'],
  'Ultimate Gley': ['Explosive Life', 'Demonic Modification'],
  Jayber: ['Turret Engineering', 'Immediate Purge Code', 'Medical Compulsion', 'Attacking Compulsion'],
  Kyle: ['Collision Instinct', 'Self-Directed Eruption', 'Diamagnetic Bulwark', 'Superconductive Bombing'],
  Lepic: ['Increased Efficiency', 'Power Unit Change', 'Regenerative Braking', 'Nerve Infiltration'],
  'Ultimate Lepic': ['Explosive Stacks', 'Firearm Master'],
  Luna: ['Noise Surge', 'Nimble Footsteps', '', ''],
  Sharen: ['Release Cutting Force', 'Overcharged Edge', 'Void Domination', 'Battlesuit Melting Rounds'],
  Valby: ['Water Play', 'Supply Moisture', 'Tidal Wave', 'Singing Water'],
  'Ultimate Valby': ['Cold Cohesion', 'Spiral Tidal Wave'],
  Viessa: ['Glacial Cloud', 'Hypothermia', 'Cold Snap Watch', 'Cold-Bloodedness'],
  'Ultimate Viessa': ['Cold Cohesion', 'Absolute-Zero'],
  Yujin: ['First Aid Kit', 'Proliferating Allergy', 'Duty and Sacrifice', 'Efficient Treatment'],
} as Record<string, string[]>;

type TranscendentTypes = keyof typeof transcendentMap;
type ModuleSocketTypes = keyof typeof socketImages;
export type ModuleTiersType = TiersType | 'Transcendent';
export const moduleTiers = Object.keys(kuiperCosts) as ModuleTiersType[];
export const moduleSockets = Object.keys(socketImages) as ModuleSocketTypes[];
export const moduleClasses = Object.keys(classImages) as ModuleClassTypes[];
export const descendantNames = Object.keys(transcendentMap) as TranscendentTypes[];
export type ModuleTypes = (typeof moduleTypes)[number] | TranscendentTypes;
export type ModuleClassTypes = keyof typeof classImages;

type ModuleStat = {
  level: number;
  module_capacity: number;
  value: string;
};

export type ModuleAPIData = {
  module_name: string;
  module_id: string;
  image_url: string;
  module_type: ModuleTypes;
  module_tier: ModuleTiersType;
  module_socket_type: ModuleSocketTypes;
  module_class: ModuleClassTypes;
  module_stat: ModuleStat[];
};

export type ModuleFilterMap = Partial<
  Record<ModuleSocketTypes | ModuleClassTypes | ModuleTiersType | ModuleTypes, boolean | undefined>
>;

export const tierOptions: FilterOptionsData = {
  label: 'Tier',
  name: 'tier',
  data: moduleTiers.map(value => ({ value })),
};

export const classOptions: FilterOptionsData = {
  label: 'Class',
  name: 'class',
  data: Object.entries(classImages).map(([value, src]) => ({
    value,
    icon: {
      src,
      backgroundClass: 'diamond',
    },
  })),
};

export const socketOptions: FilterOptionsData = {
  label: 'Socket',
  name: 'socket',
  data: Object.entries(socketImages).map(([value, src]) => ({
    value,
    icon: {
      src,
      backgroundClass: 'rounded-square',
    },
  })),
};

export const typeOptions: FilterOptionsData = {
  label: 'Type',
  name: 'module-type',
  data: moduleTypes.map(value => ({ value })),
};

type SocketTypeData = Record<ModuleSocketTypes, ModuleAPIData[]>;
type ModuleTypeData = Record<ModuleTypes, SocketTypeData>;
export type TierTypeData = Record<ModuleTiersType, ModuleTypeData>;

export type FormattedModuleData = Record<ModuleClassTypes, TierTypeData>;

export const highPowerIds = {
  'Sniper Rifle': ['252041001', '252042014', '252042015', '252042016', '252042017', '252042018'],
  Shotgun: ['252041002', '252042019', '252042020', '252042021', '252042022', '252042023', '252041015'],
  Launcher: ['252041003', '252042024', '252042025', '252042026', '252042027', '252042028'],
} as Record<string, string[]>;

export const allHighPowerIds = Object.values(highPowerIds).flat();
