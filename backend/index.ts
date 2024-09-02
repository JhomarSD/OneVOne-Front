import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
const uri = 'mongodb://localhost:27017';
let client: MongoClient | null = null;

async function connectToDatabase() {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
        console.log("Connected to MongoDB");
    }
    return client.db('datos_perfiles');
}

// Rutas
app.get('/items', async (req, res) => {
    try {
        const database = await connectToDatabase();
        const items = database.collection('item');
        const results = await items.find({}).toArray();
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los items' });
    }
});

app.get('/heroes', async (req, res) => {
    try {
        const database = await connectToDatabase();
        const heroes = database.collection('hero');
        const results = await heroes.find({}).toArray();
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los heroes' });
    }
});

app.get('/abilities', async (req, res) => {
    try {
        const database = await connectToDatabase();
        const abilities = database.collection('ability');
        const results = await abilities.find({}).toArray();
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener las habilidades' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});