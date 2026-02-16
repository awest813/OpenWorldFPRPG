import { Spell } from './spell.js';
import { Effect } from './effect.js';

import { SlashEffect } from '../utils/vfx.js';
// let heal = new Spell("Heal", [new Effect("heal", 15)], "healAnimation", "healVFX");

export var SPELLS = {
    fireball: new Spell("Fireball", [new Effect("damage", 8)], "fireballAnimation", "fireballVFX", 200, "destruction"),
    quickSwing: new Spell("Quick Swing", [new Effect("damage", 2)], "fireballAnimation", SlashEffect, 35, "oneHanded"),
    heavySwing: new Spell("Heavy Swing", [new Effect("damage", 10)], "fireballAnimation", SlashEffect, 45, "twoHanded")
}


