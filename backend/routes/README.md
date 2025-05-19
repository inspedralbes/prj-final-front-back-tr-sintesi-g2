# 🧩 Sistema de Rutas y Microservicios - Backend

Este módulo del backend implementa una arquitectura modular basada en servicios independientes para cada dominio del juego, utilizando un enfoque de microservicios internos. Cada entidad del sistema (jugadores, enemigos, objetos, etc.) cuenta con sus propias rutas y servicios dedicados, lo cual mejora la escalabilidad, mantenibilidad y separación de responsabilidades.

---

## 🧠 Arquitectura Modular

Cada módulo está compuesto por:

- **Archivo de rutas (`xxxRoutes.js`)**: Define los endpoints HTTP para cada recurso.
- **Archivo de servicio (`xxxService.js`)**: Contiene la lógica de negocio relacionada al recurso.

Esta separación permite que la lógica de negocio y la lógica de enrutamiento estén desacopladas, facilitando pruebas, refactorización y escalabilidad.

---

## 🔌 Control de Servicios

El archivo `serviceController.js` actúa como un centro de control para activar o desactivar dinámicamente los servicios del backend. Esto permite:

- Habilitar solo los servicios necesarios durante el desarrollo o testing.
- Desactivar servicios temporalmente sin detener el servidor completo.
- Modularizar la carga del sistema según necesidades.

---

## 📁 Estructura Detallada
```bash
routes/
├── logs/ # Logs o auditorías de rutas (por definir)
├── services/ # Lógica de negocio dividida por entidad
│ ├── bossService.js
│ ├── enemyDeathStatService.js
│ ├── enemyService.js
│ ├── gameService.js
│ ├── inventoryService.js
│ ├── itemService.js
│ ├── playerService.js
│ ├── shopService.js
│ └── userService.js
├── bossRoutes.js # Endpoints para jefes
├── enemyDeathStatRoutes.js # Estadísticas de muertes de enemigos
├── enemyRoutes.js # Gestión de enemigos
├── gameRoutes.js # Configuración general del juego
├── inventoryRoutes.js # Gestión de inventario
├── itemRoutes.js # CRUD de objetos
├── playerRoutes.js # Información de jugadores
├── shopRoutes.js # Rutas de tienda virtual
├── userRoutes.js # Registro, login y usuarios
└── serviceController.js # Activación y desactivación de servicios
```
---

## 🛠️ Ejemplo de Activación de Servicio

Dentro de `serviceController.js` podrías tener una lógica como esta:

```js
const services = {
  player: {
    name: 'Service of Players',
    port: process.env.PLAYER_PORT || 3001,
    script: path.join(__dirname, 'services/playerService.js')
  },
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
## ✅ Ventajas del Modelo
🔄 Modularidad: Cada funcionalidad es aislada y autocontenida.

🧪 Testeo Aislado: Puedes probar cada servicio independientemente.

🚀 Escalabilidad: Fácil de extender con nuevos servicios o módulos.

🛡️ Seguridad: Posibilidad de exponer solo los endpoints necesarios.