require('dotenv').config(); // comentar esta línea para desplegar en GCP
const functions = require('@google-cloud/functions-framework');
const { Pool } = require('pg');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');

// Cargar el archivo OpenAPI
const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));

// Configurar Express
const app = express();
// Agregar middleware de seguridad
app.use(helmet());
app.use(express.json({ limit: '10kb' }));  // Limitar tamaño del body
app.use(xss());  // Prevenir XSS
app.use(hpp());  // Prevenir HTTP Parameter Pollution

// Implementar rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // límite de 100 requests por IP
});
app.use(limiter);

// Montar Swagger UI correctamente
app.use('/', swaggerUi.serve);
app.get('/', swaggerUi.setup(swaggerDocument));
app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type, auth-token');
    res.set('Access-Control-Max-Age', '3600');
    if (req.method === 'OPTIONS') {
        return res.status(204).send('');
    }
    next();
});

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    // Configuración condicional de SSL
    ...(process.env.DB_SSL === 'true' 
        ? {
            ssl: {
                rejectUnauthorized: false
            }
          } 
        : {})
});

// Función helper para ejecutar queries
const query = async (text, params) => {
    try {
        const client = await pool.connect();
        const result = await client.query(text, params);
        return result;
    } catch (error) {
        console.error('Error ejecutando query:', error.stack);
        throw error;
    }
};

// Función helper para retornar respuestas
function sendResponse(res, statusCode, message) {
    res.status(statusCode).json({ data: message, status: statusCode });
}

// Ruta principal para validación de órdenes
app.post('/buscarOrden', async (req, res) => {
    try {
        // Verifica tipo de contenido
        if (!req.is('application/json')) {
            return sendResponse(res, 400, 'Content-Type debe ser application/json');
        }

        // Valida el token de autenticación
        const tokenAcceso = req.headers['auth-token'];
        const tokenValido = process.env.ACCESS_TOKEN;

        if (tokenAcceso !== tokenValido) {
            return sendResponse(res, 403, 'Acceso Denegado');
        }

        // Valida cuerpo de la solicitud
        const { id_evento, orden_compra } = req.body;
        if (!id_evento || !orden_compra) {
            return sendResponse(res, 400, 'Datos obligatorios faltantes');
        }

        // Valida tipos de elementos del json
        if (typeof id_evento !== 'number' || typeof orden_compra !== 'number') {
            return sendResponse(res, 400, 'Datos inválidos');
        }

        const { rows } = await query('SELECT * FROM ordenes INNER JOIN eventos ON ordenes.id_evento = eventos.id_evento WHERE ordenes.id_evento = $1 and ordenes.id_orden = $2', [id_evento, orden_compra]);

        if (!rows[0] || !rows[0].id_orden) {
            return sendResponse(res, 404, 'Orden no encontrada');
        }
        sendResponse(res, 200, rows[0]);
    } catch (error) {
        sendResponse(res, 400, 'Upps! Algo salió mal');
    }
});

// Exportar la función para Cloud Functions
exports.apiHttp = functions.http('apiHttp', app);

