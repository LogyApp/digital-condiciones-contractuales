import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

import analistaRoutes from '../Funcionalidad/source/routes/analistaRoutes.js';
import aspiranteRoutes from '../Funcionalidad/source/routes/aspiranteRoutes.js';
import actconRoutes from '../Funcionalidad/source/routes/actconroutes.js';
import imagenRoutes from '../Funcionalidad/source/routes/imagenRoutes.js';
import guardarRoutes from '../Funcionalidad/source/routes/guardarRoutes.js';

const main = express();
const port = process.env.PORT || 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

main.use(express.static(path.join(__dirname, 'public')));

main.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5173']
}));

main.use(express.json({ limit: '50mb' }));
main.use(express.urlencoded({ limit: '50mb', extended: true }));

main.get('/', (req, res) => {
    return res.send(`<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Servidor Activo</title>
    <link rel="stylesheet" href="styles.css">
    <style>
        * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

/* Card minimalista y clásica */
.card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 480px;
    overflow: hidden;
    transition: transform 0.2s ease;
}

.card:hover {
    transform: translateY(-5px);
}

/* Header de la card */
.card-header {
    background: #f8f9fa;
    padding: 20px 24px;
    border-bottom: 1px solid #e9ecef;
    display: flex;
    align-items: center;
    gap: 12px;
}

.status-indicator {
    width: 12px;
    height: 12px;
    background: #10b981;
    border-radius: 50%;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
    }
    70% {
        box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
    }
}

.status-text {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    letter-spacing: 0.5px;
}

/* Cuerpo de la card */
.card-body {
    padding: 32px 24px;
}

.server-message {
    font-size: 24px;
    font-weight: 500;
    color: #0f172a;
    text-align: center;
    margin-bottom: 28px;
    padding-bottom: 20px;
    border-bottom: 2px dashed #e2e8f0;
    font-family: 'Courier New', monospace;
}

.server-info {
    background: #f8fafc;
    border-radius: 10px;
    padding: 16px;
}

.info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #e2e8f0;
}

.info-item:last-child {
    border-bottom: none;
}

.info-label {
    font-size: 14px;
    font-weight: 500;
    color: #64748b;
}

.info-value {
    font-size: 14px;
    font-weight: 500;
    color: #0f172a;
    font-family: 'Courier New', monospace;
}

.status-badge {
    background: #dbeafe;
    color: #1e40af;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
}

/* Footer de la card */
.card-footer {
    background: #f8f9fa;
    padding: 16px 24px;
    border-top: 1px solid #e9ecef;
    text-align: center;
}

.footer-text {
    font-size: 12px;
    color: #94a3b8;
    font-style: italic;
}

/* Responsive */
@media (max-width: 640px) {
    .card {
        max-width: 100%;
    }
    
    .server-message {
        font-size: 20px;
    }
    
    .info-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
    }
}
    </style>
</head>
<body>
    <div class="card">
        <div class="card-header">
            <div class="status-indicator"></div>
            <span class="status-text">SERVIDOR ACTIVO</span>
        </div>
        
        <div class="card-body">
            <div class="server-message">
                Servidor en estado activo
            </div>
            
            <div class="server-info">
                <div class="info-item">
                    <span class="info-label">Endpoint:</span>
                    <span class="info-value">main.get('/')</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Estado:</span>
                    <span class="info-value status-badge">200 OK</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Timestamp:</span>
                    <span class="info-value" id="timestamp"></span>
                </div>
            </div>
        </div>
        
        <div class="card-footer">
            <span class="footer-text">Sistema operativo • Respuesta exitosa</span>
        </div>
    </div>

    <script>
        // Actualizar timestamp
        document.getElementById('timestamp').textContent = new Date().toLocaleString();
    </script>
</body>
</html>`);
});

main.use('/api/analistas', analistaRoutes);
main.use('/api/aspirantes', aspiranteRoutes);
main.use('/api/actcon', actconRoutes);
main.use('/api/imagen', imagenRoutes);
main.use('/api/guardar', guardarRoutes);

main.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
});