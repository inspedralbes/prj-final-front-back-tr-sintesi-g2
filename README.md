# 🎮 TheLastKnightOfAveron

**TheLastKnightOfAveron** es un videojuego 2D estilo roguelike con arte pixelado, inspirado en títulos como Blasphemous. 
Ambientado en el misterioso y oscuro reino de Averon —una reinterpretación fantástica de Barcelona medieval—, encarnarás al último caballero con la misión de derrotar enemigos y jefes desafiantes a lo largo de distintos niveles, desentrañando una historia marcada por antiguas leyendas, sacrificios y redención.

## 🧑‍💻 Integrantes del Proyecto

- Iker Delgado  
- Nicolas Posada  
- Pol Diaz  
- Moises Garcia  
- Edson Torres  

## 📖 Descripción del Proyecto

*TheLastKnightOfAveron* es una plataforma web donde:

- Los usuarios pueden explorar el lore y las leyendas del mundo de Averon.  
- Se ofrece un sistema de tienda y gestión de skins.  
- Los jugadores pueden unirse a otros para entrar en un torreón y enfrentarse a bosses.  
- Todo está integrado en una interfaz intuitiva, responsiva y diseñada para ofrecer una experiencia inmersiva tanto dentro como fuera del juego.


## 🧠 Estructura General del Proyecto
```bash
TheLastKnightOfAveron/
├── backend/ # API y lógica del servidor
│ ├── config/ # Configuraciones del servidor
│ ├── environment/ # Variables de entorno
│ ├── imagenes/ # Recursos de imágenes
│ ├── inserts/ # Scripts para datos iniciales
│ ├── models/ # Modelos de datos
│ ├── routes/ # Endpoints de la API
│ ├── scripts/ # Scripts de utilidad
│ └── index.js # Punto de entrada
├── frontend/ # Cliente web en Vue.js
│ ├── public/ # Archivos públicos
│ ├── src/ # Código fuente Vue
│ └── vite.config.mjs# Configuración de Vite
├── doc/ # Documentación adicional
└── docker/ # Configuración de Docker
```

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js, Express  [README Back](backend/README.md)
- **Frontend**: Vue.js, Vite  [README Front](frontend/vuetify-project/README.md)
- **Base de datos**: MySQL  
- **Despliegue**: Docker  

## 🚀 Instalación y Ejecución

### Backend

cd backend  
npm install  
npm run dev    # Desarrollo  
npm run start  # Producción  

### Frontend

cd frontend  
npm install  
npm run dev     # Desarrollo  
npm run build   # Compilar para producción  

### 🔗 Enlaces del Proyecto
### 🌐 Sitio web: URL de la aplicación en producción (https://thelastknightofaveron.cat/)


🚀 Estado Actual
El proyecto ya está en producción. Se encuentra en una fase estable y listo para ser utilizado.

Proyecto desarrollado en 2025 por el equipo de TheLastKnightOfAveron.
