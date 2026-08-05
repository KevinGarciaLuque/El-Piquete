CREATE DATABASE IF NOT EXISTS el_piquete
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE el_piquete;

-- ---------------------------------------------------------------------------
-- Administradores
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS administradores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  correo VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('admin') NOT NULL DEFAULT 'admin',
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------------
-- Catalogo
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS lotes_produccion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo_lote VARCHAR(50) NOT NULL UNIQUE,
  fecha_produccion DATE NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  notas TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  slug VARCHAR(140) NOT NULL UNIQUE,
  descripcion TEXT,
  ingredientes TEXT,
  nivel_picante ENUM('suave', 'tradicional', 'picante', 'extra_picante') NOT NULL DEFAULT 'tradicional',
  tipo ENUM('individual', 'combo') NOT NULL DEFAULT 'individual',
  imagen_url VARCHAR(255),
  destacado BOOLEAN NOT NULL DEFAULT FALSE,
  mas_vendido BOOLEAN NOT NULL DEFAULT FALSE,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS variantes_producto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  producto_id INT NOT NULL,
  presentacion VARCHAR(60) NOT NULL,
  contenido_neto VARCHAR(60),
  precio DECIMAL(10, 2) NOT NULL,
  sku VARCHAR(60) NOT NULL UNIQUE,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT fk_variantes_producto FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inventario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  variante_id INT NOT NULL,
  cantidad_disponible INT NOT NULL DEFAULT 0,
  lote_produccion_id INT NULL,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_inventario_variante FOREIGN KEY (variante_id) REFERENCES variantes_producto(id) ON DELETE CASCADE,
  CONSTRAINT fk_inventario_lote FOREIGN KEY (lote_produccion_id) REFERENCES lotes_produccion(id) ON DELETE SET NULL
);

-- ---------------------------------------------------------------------------
-- Clientes y direcciones
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS zonas_entrega (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  costo_envio DECIMAL(10, 2) NOT NULL DEFAULT 0,
  tiempo_estimado VARCHAR(60),
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  telefono VARCHAR(30),
  correo VARCHAR(150),
  password_hash VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS direcciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  departamento VARCHAR(80),
  ciudad VARCHAR(80),
  direccion VARCHAR(255),
  punto_referencia VARCHAR(255),
  lat DECIMAL(10, 7) NULL,
  lng DECIMAL(10, 7) NULL,
  zona_entrega_id INT NULL,
  CONSTRAINT fk_direcciones_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
  CONSTRAINT fk_direcciones_zona FOREIGN KEY (zona_entrega_id) REFERENCES zonas_entrega(id) ON DELETE SET NULL
);

-- ---------------------------------------------------------------------------
-- Cupones y pedidos
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS cupones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(40) NOT NULL UNIQUE,
  tipo ENUM('porcentaje', 'monto_fijo') NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  fecha_inicio DATE,
  fecha_fin DATE,
  usos_maximos INT NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  cliente_id INT NULL,
  direccion_id INT NULL,
  metodo_entrega ENUM('domicilio', 'recoger', 'envio_nacional') NOT NULL DEFAULT 'domicilio',
  zona_entrega_id INT NULL,
  metodo_pago ENUM('tarjeta', 'transferencia', 'paypal', 'contra_entrega') NOT NULL,
  estado ENUM('pendiente_pago', 'pagado', 'en_preparacion', 'listo', 'en_camino', 'entregado', 'cancelado') NOT NULL DEFAULT 'pendiente_pago',
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  descuento DECIMAL(10, 2) NOT NULL DEFAULT 0,
  costo_envio DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  cupon_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_pedidos_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
  CONSTRAINT fk_pedidos_direccion FOREIGN KEY (direccion_id) REFERENCES direcciones(id) ON DELETE SET NULL,
  CONSTRAINT fk_pedidos_zona FOREIGN KEY (zona_entrega_id) REFERENCES zonas_entrega(id) ON DELETE SET NULL,
  CONSTRAINT fk_pedidos_cupon FOREIGN KEY (cupon_id) REFERENCES cupones(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS detalle_pedido (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  variante_id INT NOT NULL,
  cantidad INT NOT NULL DEFAULT 1,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  CONSTRAINT fk_detalle_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  CONSTRAINT fk_detalle_variante FOREIGN KEY (variante_id) REFERENCES variantes_producto(id)
);

CREATE TABLE IF NOT EXISTS pagos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  proveedor ENUM('bac', 'paypal', 'transferencia', 'contra_entrega') NOT NULL,
  referencia VARCHAR(120),
  monto DECIMAL(10, 2) NOT NULL,
  estado ENUM('pendiente', 'confirmado', 'rechazado') NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pagos_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
);
