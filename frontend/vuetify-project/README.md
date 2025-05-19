ExportPublish🎮 Frontend - TheLastKnightOfAveron
Este directorio contiene el cliente/administración web del proyecto TheLastKnightOfAveron, desarrollado con Vue.js.

📂 Estructura del Frontend
frontend/
├── public/
│   ├── build/                   # Archivos compilados del juego
│   │   ├── juego.data.br        # Datos comprimidos del juego
│   │   ├── juego.framework.js.br # Framework del juego comprimido
│   │   ├── juego.loader.js      # Cargador del juego 
│   │   └── juego.wasm.br        # Binario WebAssembly comprimido
│   ├── favicon.ico              # Favicon del sitio
│   └── icon.png                 # Ícono principal
│
├── src/
│   ├── assets/                  # Recursos estáticos (imágenes, fonts, etc.)
│   ├── components/              # Componentes Vue reutilizables
│   │   └── dashboard/           # Componentes para gestión de tablas, solo para admins
│   │       ├── BossManagement.vue       # Gestión de jefes
│   │       ├── EnemyDeathStats.vue      # Estadísticas de enemigos
│   │       ├── EnemyManagement.vue      # Gestión de enemigos
│   │       ├── GameManagement.vue       # Gestión de partidas
│   │       ├── ItemManagement.vue       # Gestión de ítems/objetos
│   │       ├── PlayerManagement.vue     # Gestión de jugadores
│   │       ├── ShopManagement.vue       # Gestión de tienda
│   │       ├── Dashboard.vue            # Vista principal del panel de control
│   │       ├── GameView.vue             # Componente para ejecutar el juego Unity WebGL
│   │       ├── login.vue                # Componente de inicio de sesión
│   │       └── register.vue             # Componente de registro
│   ├── pages/                   # Páginas principales de la aplicación
│   ├── plugins/                 # Plugins de Vue.js
│   ├── router/                  # Configuración de rutas
│   │   └── index.js             # Definición de rutas principales
│   ├── styles/                  # Estilos globales CSS/SCSS
│   └── views/                   # Vistas principales
│       ├── LoginView.vue        # Vista de inicio de sesión
│       ├── RegisterView.vue     # Vista de registro
│       └── App.vue              # Componente raíz
│
└── README.md                    # Este archivo

🎯 Componentes Principales
🎲 GameView.vue
Este componente es el encargado de cargar y mostrar el juego desarrollado en Unity utilizando WebGL. Permite a los usuarios interactuar directamente con el juego desde el navegador sin necesidad de instalaciones adicionales.
Características:

Carga los archivos necesarios del juego desde la carpeta /public/build/
Gestiona la comunicación entre el juego y la aplicación web
Adapta el tamaño del canvas para diferentes dispositivos
Maneja estados de carga y posibles errores
Contiene un sistema de microservicios donde puedes apagar y encender todos los microservicios

📊 Dashboard
El directorio dashboard contiene todos los componentes relacionados con la administración y gestión del juego:

Dashboard.vue: Panel principal que organiza y da acceso a los diferentes módulos de gestión
BossManagement.vue: Administración de jefes
EnemyManagement.vue: Administración de enemigos
EnemyDeathStats.vue: Visualización de estadísticas sobre muertes de enemigos
GameManagement.vue: Configuración general del juego
ItemManagement.vue: Gestión de ítems y objetos coleccionables
PlayerManagement.vue: Administración de perfiles de jugadores
ShopManagement.vue: Gestión de la tienda virtual del juego

Cada componente de gestión permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre su respectiva entidad en la base de datos.
🔒 Autenticación

login.vue: Maneja el proceso de autenticación de usuarios
register.vue: Gestiona el registro de nuevos usuarios

🚀 Cómo ejecutar el frontend

Instalar dependencias:

bashnpm install

Ejecutar en modo desarrollo:

bashnpm run dev

Compilar para producción:

bashnpm run build
🔌 Integración con Unity WebGL
El juego desarrollado en Unity se exporta como WebGL y se integra en la aplicación mediante los archivos ubicados en /public/build/:

juego.data.br: Contiene los assets y recursos del juego comprimidos
juego.framework.js.br: Framework JavaScript necesario para la ejecución
juego.loader.js: Script encargado de cargar el juego en el navegador
juego.wasm.br: Código compilado a WebAssembly para una ejecución eficiente

El componente GameView.vue está configurado específicamente para trabajar con estos archivos y presentar el juego embebido en la aplicación web.
✅ Requisitos del sistema

Navegador moderno con soporte para WebGL 2.0
Conexión a internet estable
Resolución de pantalla mínima recomendada: 1920x1080

📝 Notas adicionales

La comunicación entre el frontend y el backend se realiza mediante peticiones HTTP a la API REST
Se recomienda utilizar Chrome o Firefox para una mejor experiencia con WebGL
El panel de administración requiere autenticación con credenciales de administrador