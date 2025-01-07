CREATE TABLE eventos (
    id_evento SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fecha_evento TIMESTAMP NOT NULL,
    lugar VARCHAR(200),
    capacidad INTEGER,
    precio_base DECIMAL(10,2),
    estado VARCHAR(20) DEFAULT 'activo',
    descripcion TEXT,
    categoria VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ordenes (
    id_orden SERIAL PRIMARY KEY,
    id_evento INTEGER REFERENCES eventos(id_evento),
    numero_orden VARCHAR(50) UNIQUE,
    fecha_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cantidad_boletos INTEGER,
    precio_total DECIMAL(10,2),
    estado_pago VARCHAR(20),
    email_comprador VARCHAR(100),
    nombre_comprador VARCHAR(100),
    metodo_pago VARCHAR(50),
    estado_orden VARCHAR(20) DEFAULT 'pendiente'
);

CREATE INDEX idx_eventos_fecha ON eventos(fecha_evento);
CREATE INDEX idx_ordenes_evento ON ordenes(id_evento);
CREATE INDEX idx_ordenes_numero ON ordenes(numero_orden);

-- Primero limpiamos las tablas existentes (en caso de volver a insertar)
--TRUNCATE TABLE ordenes CASCADE RESTART IDENTITY;
--TRUNCATE TABLE eventos CASCADE RESTART IDENTITY;

-- Insertamos eventos de ejemplo
INSERT INTO eventos (nombre, fecha_evento, lugar, capacidad, precio_base, estado, descripcion, categoria) 
VALUES 
('Concierto Rock en Vivo', '2024-06-15 20:00:00', 'Arena Ciudad', 5000, 75.00, 'activo', 'Gran concierto de rock con bandas locales', 'música'),
('Festival de Jazz', '2024-07-01 19:00:00', 'Parque Central', 2000, 45.00, 'activo', 'Noche de jazz bajo las estrellas', 'música'),
('Teatro: Romeo y Julieta', '2024-05-20 18:30:00', 'Teatro Nacional', 800, 35.00, 'activo', 'Clásica obra de Shakespeare', 'teatro'),
('Conferencia Tech', '2024-08-10 09:00:00', 'Centro de Convenciones', 1200, 150.00, 'activo', 'Conferencia sobre nuevas tecnologías', 'conferencia');

-- Insertamos ordenes de ejemplo
INSERT INTO ordenes (id_evento, numero_orden, cantidad_boletos, precio_total, estado_pago, email_comprador, nombre_comprador, metodo_pago, estado_orden)
VALUES 
(1, 'ORD-2024-001', 2, 150.000, 'completado', 'juan@email.com', 'Juan Pérez', 'tarjeta', 'confirmado'),
(1, 'ORD-2024-002', 3, 225.000, 'completado', 'maria@email.com', 'María García', 'paypal', 'confirmado'),
(2, 'ORD-2024-003', 4, 180.000, 'pendiente', 'carlos@email.com', 'Carlos López', 'transferencia', 'pendiente'),
(3, 'ORD-2024-004', 2, 70.000, 'completado', 'ana@email.com', 'Ana Martínez', 'tarjeta', 'confirmado');

-- Verificar inserciones
SELECT COUNT(*) FROM eventos;
SELECT COUNT(*) FROM ordenes;