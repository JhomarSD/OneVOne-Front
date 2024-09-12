export default interface Batalla {
    _id: string;
    date: string;
    players: string[]; // Array de IDs de jugadores
    winner: string; // ID del ganador, puede ser una cadena vacía
    rewards: {
        experience: number; // Puntos de experiencia
        gold: number; // Cantidad de oro
    };
}