# 🧠 Backend - TheLastKnightOfAveron

Este repositorio contiene la implementación del backend para el juego *TheLastKnightOfAveron*, desarrollado con **Node.js** y **Sequelize** para ofrecer una API robusta que da soporte al frontend Vue.js y al juego Unity WebGL.

---

## 🏗️ Arquitectura General

El sistema está organizado como una API REST completa que gestiona todos los aspectos del juego:

- 🔐 **Autenticación**: Sistema seguro para registro e inicio de sesión de usuarios  
- 📊 **Persistencia**: Almacenamiento de datos del juego en base de datos relacional mediante Sequelize  
- 🖼️ **Recursos**: Gestión de imágenes y recursos visuales del juego  
- 📈 **Estadísticas**: Generación y almacenamiento de estadísticas de juego  

---

## 📁 Estructura del Proyecto

```bash
backend/
├── config/           # Configuración de conexión a la base de datos
├── environment/      # Variables de entorno para diferentes entornos
├── imagenes/         # Recursos gráficos (skins, llaves, items)
├── inserts/          # Scripts para inserción automática en tablas
├── models/           # Modelos Sequelize de las tablas
├── routes/           # Definición de endpoints API
├── scripts/          # Scripts de Python para generación de gráficos
├── stat_images/      # Imágenes de estadísticas generadas
└── index.js          # Punto de entrada del servidor
```

## 🧩 Componentes Principales
## ⚙️ Config
Configuración de la conexión a la base de datos:

Credenciales y parámetros de conexión

Opciones de Sequelize

Configuración de pools de conexiones

## 📸 Imagenes
Repositorio de recursos visuales:

Skins para personalización de personajes

Llaves para desbloqueo de niveles

Ítems y objetos coleccionables

Recursos visuales del entorno de juego

## 📝 Inserts
Scripts automatizados para la base de datos:

Población inicial de tablas

Datos predeterminados del juego

Restauración de estado base

## 📊 Models
Definiciones Sequelize para la estructura de datos:

Player: Información de jugadores y progreso

Enemy: Características de enemigos

Boss: Configuración de jefes de nivel

Item: Propiedades de objetos del juego

Shop: Sistema de tienda virtual

Game: Configuraciones generales

## 🛣️ Routes
Endpoints de la API organizados por funcionalidad:

/auth: Registro, login y gestión de sesiones

/players: CRUD de jugadores y progreso

/enemies: Gestión de enemigos y estadísticas

/items: Administración de objetos y tienda

/stats: Generación y consulta de estadísticas

## 📈 Scripts
Utilidades para análisis de datos:

Scripts Python para visualización de estadísticas

Generación de gráficos sobre rendimiento del juego

Procesamiento de datos de partidas

## 📊 Stat_Images
Almacenamiento de visualizaciones generadas:

Gráficos de rendimiento de jugadores

Estadísticas de uso de ítems

Métricas de popularidad de niveles

## 🚀 index.js
Configuración central del servidor:

Inicialización de Express

Conexión a la base de datos

Configuración de middlewares

Registro de rutas

Inicio del servidor HTTP

## 🔄 Flujo de Datos
El frontend Vue envía peticiones a los endpoints correspondientes

El servidor autentica y valida las peticiones

Se realizan operaciones CRUD en la base de datos mediante Sequelize

Se generan y almacenan estadísticas cuando es necesario

El servidor responde con datos estructurados en formato JSON

## 🧰 Requisitos del Sistema
🟢 Node.js (v14 o superior)

🐬 MySQL / MariaDB

🐍 Python 3 (para scripts de estadísticas)

## Librerías de Python necesarias:
📊 matplotlib

🔢 numpy

📋 pandas

## 🚀 Puesta en Marcha
Instalación de dependencias:
npm install
Configuración de entorno:
cp environment/.env.example environment/.env
Ejecución en desarrollo:
npm run dev
Ejecución en producción:
npm start
