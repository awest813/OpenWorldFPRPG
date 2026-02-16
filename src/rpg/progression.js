const BASE_ATTRIBUTES = Object.freeze({
    health: 100,
    magicka: 100,
    stamina: 100,
    oneHanded: 15,
    twoHanded: 15,
    archery: 15,
    block: 15,
    heavyArmor: 15,
    lightArmor: 15,
    destruction: 15,
    restoration: 15,
    alteration: 15,
    conjuration: 15,
    illusion: 15,
    sneak: 15,
    speech: 15,
    smithing: 15,
    alchemy: 15,
    enchanting: 15
});

const RACE_PRESETS = Object.freeze({
    nord: Object.freeze({ health: 110, stamina: 110, twoHanded: 20, block: 20, lightArmor: 20 }),
    imperial: Object.freeze({ health: 105, stamina: 105, speech: 20, oneHanded: 20, restoration: 20 }),
    breton: Object.freeze({ magicka: 120, conjuration: 20, restoration: 20, illusion: 20 })
});

function clampSkillLevel(skillLevel) {
    return Math.min(100, Math.max(1, skillLevel));
}

export function createProgressionState({ race = 'nord', level = 1 } = {}) {
    const racePreset = RACE_PRESETS[race] ?? RACE_PRESETS.nord;
    return {
        race,
        level,
        xp: 0,
        attributes: {
            ...BASE_ATTRIBUTES,
            ...racePreset
        },
        skillXp: {}
    };
}

export function getCombatScalar(progression, skillName, base = 1) {
    if (!progression) return base;
    const skillLevel = clampSkillLevel(progression.attributes[skillName] ?? BASE_ATTRIBUTES[skillName] ?? 15);
    // Similar to Skyrim feel: meaningful growth, but not explosive.
    return base + ((skillLevel - 15) / 100);
}

export function awardSkillXp(progression, skillName, amount) {
    if (!progression || !skillName || amount <= 0) return 0;

    const currentSkillLevel = progression.attributes[skillName] ?? BASE_ATTRIBUTES[skillName] ?? 15;
    const xpBucket = progression.skillXp[skillName] ?? 0;
    const nextXpBucket = xpBucket + amount;
    const xpNeeded = currentSkillLevel * 10;

    progression.skillXp[skillName] = nextXpBucket;

    if (nextXpBucket < xpNeeded || currentSkillLevel >= 100) return 0;

    progression.attributes[skillName] = currentSkillLevel + 1;
    progression.skillXp[skillName] = nextXpBucket - xpNeeded;
    return 1;
}

export function getMaxHealthFromProgression(progression) {
    if (!progression) return BASE_ATTRIBUTES.health;
    return progression.attributes.health + ((progression.level - 1) * 10);
}
