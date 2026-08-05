const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const productosRoutes = require('./routes/productos.routes');
const zonasRoutes = require('./routes/zonas.routes');
const pedidosRoutes = require('./routes/pedidos.routes');
const authRoutes = require('./routes/auth.routes');
const adminProductosRoutes = require('./routes/admin.productos.routes');
const adminCuponesRoutes = require('./routes/admin.cupones.routes');
const adminZonasRoutes = require('./routes/admin.zonas.routes');
const adminReportesRoutes = require('./routes/admin.reportes.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({ estado: 'ok' });
});

app.use('/api/productos', productosRoutes);
app.use('/api/zonas-entrega', zonasRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin/productos', adminProductosRoutes);
app.use('/api/admin/cupones', adminCuponesRoutes);
app.use('/api/admin/zonas', adminZonasRoutes);
app.use('/api/admin/reportes', adminReportesRoutes);

app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

app.use(errorHandler);

module.exports = app;
