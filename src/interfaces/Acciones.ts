export default interface Acciones {
  _id: string;
  name: string;
  heroType: string;
  minLevel: number;
  powerCost: number;
  effects: {
    [key: string]: number; // Permite cualquier par clave-valor de tipo `number`
  };
}
