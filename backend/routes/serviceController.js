const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { Server } = require('socket.io');

// Configuración
const PORT = process.env.PORT || 3000;
const LOG_DIR = path.join(__dirname, 'logs');

// Crear logs si no existen
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Servicios disponibles
const services = {
  player: {
    name: 'Servicio de Jugadores',
    port: process.env.PLAYER_PORT || 3001,
    script: path.join(__dirname, 'services/playerService.js')
  },
  game: {
    name: 'Servicio de Partidas',
    port: process.env.GAME_PORT || 3002,
    script: path.join(__dirname, 'services/gameService.js')
  },
  inventory: {
    name: 'Servicio de Inventario',
    port: process.env.INVENTORY_PORT || 3003,
    script: path.join(__dirname, 'services/inventoryService.js')
  },
  item: {
    name: 'Servicio de Objetos',
    port: process.env.ITEM_PORT || 3005,
    script: path.join(__dirname, 'services/itemService.js')
  },
  enemy: {
    name: 'Servicio de Enemigos',
    port: process.env.ENEMY_PORT || 3007,
    script: path.join(__dirname, 'services/enemyService.js')
  },
  boss: {
    name: 'Servicio de Jefes',
    port: process.env.BOSS_PORT || 3008,
    script: path.join(__dirname, 'services/bossService.js')
  },
  shop: {
    name: 'Servicio de Tienda',
    port: process.env.SHOP_PORT || 3009,
    script: path.join(__dirname, 'services/shopService.js')
  },
};

// Estado de procesos
const runningServices = {};

// Logs
function logMessage(serviceType, message) {
  const timestamp = new Date().toISOString();
  const logFile = path.join(LOG_DIR, `${serviceType}.log`);
  const logEntry = `${timestamp} - ${message}\n`;

  fs.appendFileSync(logFile, logEntry);
  console.log(`[${serviceType}] ${message}`);
}

// Verificar puerto
async function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = require('net').createServer();

    server.once('error', (err) => resolve(err.code === 'EADDRINUSE'));
    server.once('listening', () => {
      server.close();
      resolve(false);
    });

    server.listen(port);
  });
}

// Verificar estado
async function checkServiceStatus(serviceType) {
  if (!services[serviceType]) {
    throw new Error(`Servicio ${serviceType} no encontrado`);
  }

  const serviceConfig = services[serviceType];
  let status = 'OFFLINE';

  if (runningServices[serviceType]?.pid) {
    try {
      process.kill(runningServices[serviceType].pid, 0);
      status = 'ONLINE';
    } catch {
      runningServices[serviceType] = null;
    }
  }

  if (status === 'OFFLINE') {
    const inUse = await isPortInUse(serviceConfig.port);
    if (inUse) status = 'ONLINE';
  }

  return {
    id: Object.keys(services).indexOf(serviceType) + 1,
    name: serviceConfig.name,
    status,
    port: serviceConfig.port,
    serviceType
  };
}

// Iniciar servicio individual
async function startService(serviceType) {
  const serviceConfig = services[serviceType];
  const status = await checkServiceStatus(serviceType);

  if (status.status === 'ONLINE') return status;

  if (!fs.existsSync(serviceConfig.script)) {
    throw new Error(`El archivo ${serviceConfig.script} no existe`);
  }

  const child = spawn('node', [serviceConfig.script], {
    env: { ...process.env, [`${serviceType.toUpperCase()}_PORT`]: serviceConfig.port },
    stdio: 'pipe',
    detached: true
  });

  runningServices[serviceType] = child;

  child.stdout.on('data', (data) => logMessage(serviceType, data.toString().trim()));
  child.stderr.on('data', (data) => logMessage(serviceType, `ERROR: ${data.toString().trim()}`));
  child.on('close', (code) => {
    logMessage(serviceType, `Proceso terminado con código ${code}`);
    runningServices[serviceType] = null;
    // Emitir cambio de estado al cerrarse el proceso
    checkServiceStatus(serviceType).then(status => {
      io.emit('service-status-changed', status);
    });
  });

  logMessage(serviceType, `Servicio iniciado en puerto ${serviceConfig.port}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  const newStatus = await checkServiceStatus(serviceType);
  io.emit('service-status-changed', newStatus); // Emitir cambio de estado
  return newStatus;
}

// Detener servicio individual
async function stopService(serviceType) {
  const process = runningServices[serviceType];
  if (!process) {
    const status = await checkServiceStatus(serviceType);
    io.emit('service-status-changed', status);
    return status;
  }
  return new Promise((resolve, reject) => {
    process.once('close', async () => {
      runningServices[serviceType] = null;
      const status = await checkServiceStatus(serviceType);
      io.emit('service-status-changed', status);
      resolve(status);
    });
    try {
      process.kill('SIGTERM');
    } catch (err) {
      reject(err);
    }
  });
}

// Iniciar todos los servicios
async function startAllServices() {
  for (const serviceType of Object.keys(services)) {
    try {
      const status = await startService(serviceType);
      console.log(`✅ ${status.name} iniciado en puerto ${status.port}`);
    } catch (err) {
      console.error(`❌ Error al iniciar ${serviceType}: ${err.message}`);
    }
  }
}

// Express setup
const app = express();
app.use(cors());
app.use(express.json());

const checkServiceExists = (req, res, next) => {
  if (!services[req.params.serviceType]) {
    return res.status(404).json({ success: false, message: `Servicio ${req.params.serviceType} no encontrado` });
  }
  next();
};

// Endpoints
app.get('/services', async (req, res) => {
  try {
    const statuses = await Promise.all(
      Object.keys(services).map(serviceType => checkServiceStatus(serviceType))
    );
    res.json({ success: true, services: statuses });
  } catch (error) {
    res.status(500).json({ success: false, message: `Error: ${error.message}` });
  }
});

app.post('/services/:serviceType/start', checkServiceExists, async (req, res) => {
  try {
    const status = await startService(req.params.serviceType);
    res.json({
      success: true,
      message: `Servicio ${status.name} iniciado`,
      service: status
    });
  } catch (error) {
    logMessage(req.params.serviceType, `Error al iniciar: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/services/:serviceType/stop', checkServiceExists, async (req, res) => {
  try {
    const status = await stopService(req.params.serviceType);
    res.json({
      success: true,
      message: `Servicio ${status.name} detenido`,
      service: status
    });
  } catch (error) {
    logMessage(req.params.serviceType, `Error al detener: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- SOCKET.IO INTEGRACIÓN ---
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Al conectar un cliente, enviar el estado de todos los servicios
io.on('connection', async (socket) => {
  const statuses = await Promise.all(
    Object.keys(services).map(serviceType => checkServiceStatus(serviceType))
  );
  socket.emit('all-services-status', statuses);
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Controlador de servicios corriendo en puerto ${PORT}`);
});

// Exports
module.exports = {
  app,
  startService,
  stopService,
  startAllServices
};
