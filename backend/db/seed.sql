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

INSERT INTO productos (nombre, slug, descripcion, ingredientes, nivel_picante, tipo, imagen_url, destacado, mas_vendido, activo) VALUES
  (
    'Combo para Probar',
    'combo-para-probar',
    'Un frasco tradicional, uno picante y uno suave para que descubras tu favorito.',
    'Cebolla, zanahoria, jalapeño, vinagre, sal, especias',
    'tradicional',
    'combo',
    NULL,
    TRUE,
    FALSE,
    TRUE
  ),
  (
    'Combo Familiar',
    'combo-familiar',
    '3 frascos grandes de nuestro encurtido tradicional, ideales para compartir en casa.',
    'Cebolla, zanahoria, jalapeño, vinagre, sal, especias',
    'tradicional',
    'combo',
    NULL,
    TRUE,
    TRUE,
    TRUE
  ),
  (
    'Combo para Negocio',
    'combo-negocio',
    'Presentaciones mayoristas de 6 o 12 frascos para restaurantes y negocios. Precio final sujeto a cotización.',
    'Cebolla, zanahoria, jalapeño, vinagre, sal, especias',
    'tradicional',
    'combo',
    NULL,
    FALSE,
    FALSE,
    TRUE
  );

INSERT INTO variantes_producto (producto_id, presentacion, contenido_neto, precio, sku, activo) VALUES
  ((SELECT id FROM productos WHERE slug = 'encurtido-tradicional'), '250 ml', '250 ml', 100.00, 'ENC-TRAD-250', TRUE),
  ((SELECT id FROM productos WHERE slug = 'encurtido-picante'), '250 ml', '250 ml', 100.00, 'ENC-PICA-250', TRUE),
  ((SELECT id FROM productos WHERE slug = 'encurtido-suave'), '250 ml', '250 ml', 100.00, 'ENC-SUAV-250', TRUE),
  ((SELECT id FROM productos WHERE slug = 'combo-para-probar'), '3 x 250 ml', '750 ml', 270.00, 'COMBO-PROBAR-3', TRUE),
  ((SELECT id FROM productos WHERE slug = 'combo-familiar'), '3 x 500 ml', '1.5 L', 255.00, 'COMBO-FAMILIAR-3', TRUE),
  ((SELECT id FROM productos WHERE slug = 'combo-negocio'), '6 x 250 ml', '1.5 L', 540.00, 'COMBO-NEGOCIO-6', TRUE),
  ((SELECT id FROM productos WHERE slug = 'combo-negocio'), '12 x 250 ml', '3 L', 1000.00, 'COMBO-NEGOCIO-12', TRUE);

INSERT INTO inventario (variante_id, cantidad_disponible) VALUES
  ((SELECT id FROM variantes_producto WHERE sku = 'ENC-TRAD-250'), 50),
  ((SELECT id FROM variantes_producto WHERE sku = 'ENC-PICA-250'), 50),
  ((SELECT id FROM variantes_producto WHERE sku = 'ENC-SUAV-250'), 50),
  ((SELECT id FROM variantes_producto WHERE sku = 'COMBO-PROBAR-3'), 20),
  ((SELECT id FROM variantes_producto WHERE sku = 'COMBO-FAMILIAR-3'), 15),
  ((SELECT id FROM variantes_producto WHERE sku = 'COMBO-NEGOCIO-6'), 10),
  ((SELECT id FROM variantes_producto WHERE sku = 'COMBO-NEGOCIO-12'), 10);
