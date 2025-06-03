import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Para obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas de API (SIEMPRE PRIMERO)
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// SOLO EN PRODUCCIÓN (Heroku), servir frontend
if (process.env.NODE_ENV === 'production') {
  // Servir archivos estáticos
  app.use(express.static(path.join(__dirname, '../../dist')));
  
  // Catch-all handler para React Router
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });
}

// Eliminar las opciones deprecadas de MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('Conectado a MongoDB');
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
  });
})
.catch((error) => {
  console.error('Error al conectar a MongoDB:', error);
});