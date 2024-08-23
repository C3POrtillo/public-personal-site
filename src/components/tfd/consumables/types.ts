import type { ZonesTypes } from '@/components/tfd/void-fragments/types';

export const basicMaterials = {
  Kingston: {
    'Monad Shard': {
      source: 'Resource Boxes/Munitions',
    },
    Repton: {
      source: 'Resource Boxes/Munitions',
    },
    'Insulated Metallic Foil': {
      source: 'Infiltration Elites',
      notes: 'Magister Lab - Hard\nReset after first Elite',
    },
    'Organic Biogel': {
      source: 'Battlefield Elites',
      notes: 'Grand Square - Kingston Surveillance Radar\nThe Destruction - Kingston Communications Repeater',
    },
    'Low-Carbon Activator': {
      source: 'Outpost Elites',
    },
  },
  'Sterile Land': {
    'Metal Accelerant': {
      source: 'Resource Boxes/Munitions',
    },
    Superfluid: {
      source: 'Resource Boxes/Munitions',
    },
    'Murky Energy Residue': {
      source: 'Infiltration Elites',
    },
    'Negative Ion Particle': {
      source: 'Encrypted Vaults',
    },
    'Artificial Biometal': {
      source: 'Battlefield Elites',
      notes: 'Rockfall - Anticipated Ambush Point',
    },
    'Fusion Plasma Battery': {
      source: 'Outpost Elites',
    },
  },
  Vespers: {
    Hardener: {
      source: 'Resource Boxes/Munitions',
    },
    'Semi-permanent Plasma': {
      source: 'Resource Boxes/Munitions',
    },
    'Common Carbon Activators': {
      source: 'Infiltration Elites',
      notes: 'The Shelter, Sepulcher - Normal\nReset after first Elite',
    },
    'Conductive Metallic Foil': {
      source: 'Encrypted Vaults',
    },
    'Data Processing Neural Circuit': {
      source: 'Battlefield Elites',
      notes: 'The Lumber Yard - Frontline Base',
    },
    'Inorganic Biogel': {
      source: 'Outpost Elites',
    },
  },
  'Echo Swamp': {
    'Compound Coating Material': {
      source: 'Resource Boxes/Munitions',
    },
    Silicon: {
      source: 'Resource Boxes/Munitions',
    },
    'Complex Carbon Activator': {
      source: 'Infiltration Elites',
      notes: 'Seed Vault - Hard\nReset after first 2 elites',
    },
    'Thermal Metallic Foil': {
      source: 'Encrypted Vaults',
    },
    'Encrypted Neural Circuit': {
      source: 'Battlefield Elites',
      notes: 'Misty Woods - Hazy Swamp',
    },
    'Macromolecule Biogel': {
      source: 'Outpost Elites',
    },
  },
  'Agna Desert': {
    'Monomolecular Extractor': {
      source: 'Resource Boxes/Munitions',
    },
    Nanopolymers: {
      source: 'Resource Boxes/Munitions',
    },
    'Divided Plasma Battery': {
      source: 'Infiltration Elites',
      notes: 'The Asylum - Normal\nReset after first Elite',
    },
    'Mixed Energy Residue': {
      source: 'Encrypted Vaults',
    },
    'Positive Ion Particle': {
      source: 'Battlefield Elites',
      notes: 'Miragestone - Commanding Ground',
    },
    'Synthesized Artificial Biometal': {
      source: 'Outpost Elites',
    },
  },
  'White-Night Gulch': {
    'Ceramic Composite': {
      source: 'Resource Boxes/Munitions',
    },
    Flectorite: {
      source: 'Resource Boxes/Munitions',
    },
    'Compound Carbon Activator': {
      source: 'Infiltration Elites',
      notes: "Mystery's End - Normal\nReset after first Elite",
    },
    'Cooling Metallic Foil': {
      source: 'Encrypted Vaults',
    },
    'Advanced Neural Circuit': {
      source: 'Battlefield Elites',
      notes: 'The Mountaintops - Border Line of Truth',
    },
    'Crystal Biogel': {
      source: 'Outpost Elites',
    },
  },
  Hagios: {
    'Carbon Crystal': {
      source: 'Resource Boxes/Munitions',
    },
    'Shape Memory Alloy': {
      source: 'Resource Boxes/Munitions',
    },
    'Heat Plasma Battery': {
      source: 'Infiltration Elites',
      notes:
        'Old Mystery - Hard\nReset after 5 elites at Kuiper objective.\n(Might be outdated after Season Patch changing timed objectives',
    },
    'Highly-concentrated Energy Residue': {
      source: 'Encrypted Vaults',
    },
    'Anode Ion Particle': {
      source: 'Battlefield Elites',
      notes: 'Forward Base - Broadband Fleet Beacon\nThe Corrupted Zone - Deep Digger',
    },
    'Specialized Biometal': {
      source: 'Outpost Elites',
      notes: 'EXCEPT The Corrupted Zone',
    },
  },
  Fortress: {
    Hellion: {
      source: 'Resource Boxes/Munitions',
    },
    'Reverse Charging Coil': {
      source: 'Resource Boxes/Munitions',
    },
    'Balanced Plasma Energy': {
      source: 'Infiltration Elites',
      notes: 'Quarantine Zone - Hard\n2 elites during sample objective',
    },
    'Pure Energy Residue': {
      source: 'Encrypted Vaults',
    },
    'Polyatomic Ion Particle': {
      source: 'Battlefield Elites',
      notes: 'Frozen Valley - Command Relay',
    },
    'Deformed Biometal': {
      source: 'Outpost Elites',
    },
  },
} as const;

export type Source = {
  source: string;
  notes?: string;
};

export type MaterialName = {
  [K in ZonesTypes]: keyof (typeof basicMaterials)[K];
}[ZonesTypes];

type BasicMaterial = Record<MaterialName, Source>;

export type BasicMaterialZoneData = Record<ZonesTypes, BasicMaterial>;
