USE el_piquete;

INSERT INTO zonas_entrega (nombre, costo_envio, tiempo_estimado, activo) VALUES
  ('Tegucigalpa - Zona Centro', 60.00, '24-48 horas', TRUE),
  ('Tegucigalpa - Otras Zonas', 90.00, '48-72 horas', TRUE);

INSERT INTO productos (nombre, slug, descripcion, ingredientes, nivel_picante, tipo, imagen_url, destacado, mas_vendido, activo) VALUES
  (
    'Encurtido Tradicional',
    'encurtido-tradicional',
    'Cebolla, zanahoria y jalapeño encurtidos con el balance perfecto entre acidez y picante.',
    'Cebolla, zanahoria, jalapeño, vinagre, sal, especias',
    'tradicional',
    'individual',
    NULL,
    TRUE,
    TRUE,
    TRUE
  ),
  (
    'Encurtido Picante',
    'encurtido-picante',
    'La misma receta tradicional con un nivel extra de picante para los que se atreven.',
    'Cebolla, zanahoria, jalapeño, chile extra, vinagre, sal, especias',
    'picante',
    'individual',
    NULL,
    TRUE,
    FALSE,
    TRUE
  ),
  (
    'Encurtido Suave',
    'encurtido-suave',
    'Todo el sabor artesanal con un nivel de picante ligero, ideal para toda la familia.',
    'Cebolla, zanahoria, jalapeño, vinagre, sal, especias',
    'suave',
    'individual',
    NULL,
    FALSE,
    FALSE,
    TRUE
  );

INSERT INTO variantes_producto (producto_id, presentacion, contenido_neto, precio, sku, activo) VALUES
  ((SELECT id FROM productos WHERE slug = 'encurtido-tradicional'), '250 ml', '250 ml', 100.00, 'ENC-TRAD-250', TRUE),
  ((SELECT id FROM productos WHERE slug = 'encurtido-picante'), '250 ml', '250 ml', 100.00, 'ENC-PICA-250', TRUE),
  ((SELECT id FROM productos WHERE slug = 'encurtido-suave'), '250 ml', '250 ml', 100.00, 'ENC-SUAV-250', TRUE);

INSERT INTO inventario (variante_id, cantidad_disponible) VALUES
  ((SELECT id FROM variantes_producto WHERE sku = 'ENC-TRAD-250'), 50),
  ((SELECT id FROM variantes_producto WHERE sku = 'ENC-PICA-250'), 50),
  ((SELECT id FROM variantes_producto WHERE sku = 'ENC-SUAV-250'), 50);
