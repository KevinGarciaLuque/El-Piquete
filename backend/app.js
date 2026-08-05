const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const productosRoutes = require('./routes/productos.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ estado: 'ok' });
});

app.use('/api/productos', productosRoutes);

app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

app.use(errorHandler);

module.exports = app;
