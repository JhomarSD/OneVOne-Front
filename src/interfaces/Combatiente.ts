export default interface Combatiente {
    _id: string;
    name: string;
    type: string;
    level: number;
    powerPoints: number;
    powerPointsLeft: number;
    health: number;
    maxHealth: number; // Asegúrate de que esto esté presente
    defense: number;
    attack: number;
    damage: number;
    experience: number;
    inventory: string[];
    equippedWeapons: string[];
    equippedArmor: string[];
    abilities: string[];
  }
  