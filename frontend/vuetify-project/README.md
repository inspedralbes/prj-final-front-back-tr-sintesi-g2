## 🎮 Frontend - TheLastKnightOfAveron

Este directorio contiene el cliente/administración web del proyecto **TheLastKnightOfAveron**, desarrollado con **Vue.js**.

---

## 📂 Estructura del Frontend

```bash
frontend/
├── public/
│   ├── build/                        # Archivos compilados del juego
│   │   ├── juego.data.br             # Datos comprimidos del juego
│   │   ├── juego.framework.js.br     # Framework del juego comprimido
│   │   ├── juego.loader.js           # Cargador del juego
│   │   └── juego.wasm.br             # Binario WebAssembly comprimido
│   ├── favicon.ico                   # Favicon del sitio
│   └── icon.png                      # Ícono principal
│
├── src/
│   ├── assets/                       # Recursos estáticos (imágenes, fuentes, etc.)
│   ├── components/                   # Componentes Vue reutilizables
│   │   └── dashboard/                # Panel de administración (solo admins)
│   │       ├── BossManagement.vue
│   │       ├── EnemyDeathStats.vue
│   │       ├── EnemyManagement.vue
│   │       ├── GameManagement.vue
│   │       ├── ItemManagement.vue
│   │       ├── PlayerManagement.vue
│   │       ├── ShopManagement.vue
│   │       ├── Dashboard.vue
│   │       ├── GameView.vue
│   │       ├── login.vue
│   │       └── register.vue
│   ├── pages/                        # Páginas principales
│   ├── plugins/                      # Plugins de Vue.js
│   ├── router/
│   │   └── index.js                  # Rutas principales
│   ├── styles/                       # Estilos globales
│   └── views/
│       ├── LoginView.vue
│       ├── RegisterView.vue
│       └── App.vue                  # Componente raíz
│
└── README.md

```

## 🎯 Componentes Principales

### 🎲 `GameView.vue`

Este componente carga y muestra el juego exportado en Unity (WebGL), permitiendo a los usuarios jugar directamente desde el navegador sin necesidad de instalaciones.

**Características:**

- Carga automática de archivos desde `/public/build/`
- Comunicación entre juego y aplicación web
- Adaptación del canvas a distintos tamaños de pantalla
- Manejo de estados de carga y errores
- Control de microservicios: puedes apagar o encenderlos desde la interfaz

---

## 📊 Dashboard

El directorio `dashboard/` contiene todos los componentes para la administración del juego. Cada uno permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre una entidad del sistema:

- `Dashboard.vue`: Vista principal del panel
- `BossManagement.vue`: Gestión de jefes
- `EnemyManagement.vue`: Gestión de enemigos
- `EnemyDeathStats.vue`: Estadísticas de muertes
- `GameManagement.vue`: Configuración del juego
- `ItemManagement.vue`: Gestión de ítems
- `PlayerManagement.vue`: Gestión de jugadores
- `ShopManagement.vue`: Administración de la tienda virtual

---

## 🔒 Autenticación

- `login.vue`: Componente de inicio de sesión
- `register.vue`: Componente de registro de usuarios

---

## 🚀 Cómo ejecutar el frontend

### Instalar dependencias:

npm install

## Ejecutar en modo desarrollo:

npm run dev

## Compilar para producción:

npm run build

## 🔌 Integración con Unity WebGL
El juego desarrollado en Unity se exporta a WebGL y se integra mediante los siguientes archivos en /public/build/:

juego.data.br: Assets y datos comprimidos

juego.framework.js.br: Framework para ejecutar Unity

juego.loader.js: Script de carga

juego.wasm.br: Código WebAssembly optimizado

El componente GameView.vue está diseñado para usar estos archivos y renderizar el juego dentro del navegador.

## ✅ Requisitos del Sistema
Navegador moderno con soporte WebGL 2.0

Conexión a internet estable

Resolución mínima recomendada: 1920x1080

## 📝 Notas Adicionales
La comunicación entre frontend y backend se realiza mediante API REST

Se recomienda usar Chrome o Firefox para mejor rendimiento con WebGL

El acceso al panel de administración requiere credenciales de administrador
