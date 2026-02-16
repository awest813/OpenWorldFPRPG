import { Health } from '../character/health.js';
import { awardSkillXp, getCombatScalar } from '../rpg/progression.js';

export class Effect {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }

    apply(target, context = {}) {
        if (target instanceof Health) {
            switch (this.type) {
                case 'damage':
                    const randomValue = Math.floor(Math.random() * 3);
                    const casterProgression = context.caster?.progression;
                    const scalar = getCombatScalar(casterProgression, context.skill);
                    target.takeDamage(Math.round((this.value + randomValue) * scalar));
                    awardSkillXp(casterProgression, context.skill, 5);
                    break;
                case 'heal':
                    target.heal(this.value);
                    break;
                // Add other effects as necessary
            }
        }
    }
}