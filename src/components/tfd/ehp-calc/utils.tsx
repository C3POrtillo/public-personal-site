export const getDamageReduction = (defense: number) => 1 - 150 / (Math.sqrt(defense) + 150);
export const getEffectiveHealth = (maxHPShield: number, damageReduction: number) => maxHPShield / (1 - damageReduction);
