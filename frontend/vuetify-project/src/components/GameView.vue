<template>
  <div class="game-container medieval-theme">
    <!-- Cabecera -->
    <header class="game-header">
  <div class="title-wrapper">
    <v-icon large class="mr-2 crown-icon">mdi-shield-plus</v-icon>
    <h1 class="game-title">Mi Juego Medieval</h1>
    <v-icon large class="ml-2 crown-icon">mdi-shield-plus</v-icon>

  </div>
</header>
    
    <!-- Contenedor principal -->
    <main class="main-content">
      <!-- Área del juego -->
      <div class="game-window parchment-card">
        <div id="unity-container" class="unity-placeholder">
          <!-- Pantalla de carga antes de iniciar el juego -->
          <div v-if="!gameStarted" class="game-placeholder">
            <h2 class="medieval-subtitle">¡Prepárate para la aventura!</h2>
            <v-btn 
              @click="startGame" 
              class="refresh-btn mt-4"
              elevation="2"
              :loading="loading"
            >
              <span class="btn-text">INICIAR JUEGO</span>
            </v-btn>
          </div>
          
          <!-- Pantalla de carga mientras se carga Unity -->
          <div v-else-if="loading" class="game-loading">
            <h3 class="medieval-subtitle">Cargando el reino...</h3>
            <v-progress-linear
              indeterminate
              color="#DAA520"
              height="6"
              class="mt-4"
            ></v-progress-linear>
            <p class="loading-progress" v-if="progress > 0">{{ Math.round(progress * 100) }}%</p>
          </div>
          <!-- Contenedor para el canvas de Unity - ya tiene el canvas dentro -->
          <div v-if="showCanvas" ref="unityCanvasContainer" id="unity-canvas-container" class="unity-canvas-container">
          <canvas ref="unityCanvas" id="unity-canvas" width="100%" height="100%"></canvas>

          <!-- Botón de pantalla completa dentro del contenedor -->
          <div class="fullscreen-btn-wrapper">
              <v-btn
              small
              icon
              class="control-btn"
              @click="toggleFullscreen"
              title="Pantalla completa"
              >
              <v-icon>mdi-fullscreen</v-icon>
              </v-btn>
          </div>
          </div>
        </div>
      </div>
      
      <!-- Instrucciones -->
      <div class="instructions-panel parchment-card">
        <h2 class="instructions-title">INSTRUCCIONES</h2>
        <v-divider class="divider mb-4"></v-divider>
        <div class="instructions-content">
          <ul class="instructions-list">
            <li>Utiliza <b>W, A, S, D</b> para moverte por el reino</li>
            <li>Presiona <b>ESPACIO</b> para saltar obstáculos</li>
            <li>Usa el <b>MOUSE</b> para mirar alrededor</li>
            <li>Presiona <b>E</b> para interactuar con objetos y personajes</li>
            <li>Presiona <b>ESC</b> para pausar la aventura</li>
          </ul>
        </div>
      </div>
    </main>

  <!-- Botón flotante de Login -->
  <v-btn
    color="primary"
    class="floating-login-btn"
    fab
    large
    elevation="12"
    @click="goToLogin"
    title="Ir a Login"
  >
    <v-icon large>mdi-login</v-icon>
  </v-btn>
</div>
</template>

<script>
export default {
  name: 'GameView',
  data() {
    return {
      gameStarted: false,
      loading: false,
      progress: 0,
      unityInstance: null,
      unityLoaderUrl: '/Build/juego.loader.js',
      unityConfig: {
        dataUrl: "/Build/juego.data.br",
        frameworkUrl: "/Build/juego.framework.js.br",
        codeUrl: "/Build/juego.wasm.br",
        streamingAssetsUrl: "StreamingAssets",
        companyName: "TuCompañía",
        productName: "Juego Medieval",
        productVersion: "1.0"
      },
      maxRetries: 5,
      currentRetry: 0,
      showCanvas: false
    }
  },
  mounted() {
    // Pre-cargar el script de Unity al montar el componente
    if (typeof window.createUnityInstance !== 'function') {
      this.preloadUnityScript();
    }
    document.addEventListener("fullscreenchange", this.onFullscreenChange);
document.addEventListener("keydown", this.handleCustomFullscreenExit);
  },
  beforeUnmount() {
  document.removeEventListener("fullscreenchange", this.onFullscreenChange);
  },
  methods: {
    goToLogin() {
      this.$router.push('/login');
    },
      handleCustomFullscreenExit(event) {
          if (event.key.toLowerCase() === 'q') {
          if (document.fullscreenElement) {
              document.exitFullscreen();
              if (this.unityInstance) {
              this.unityInstance.SetFullscreen(0);
              }
          }
          }
      },
      onFullscreenChange() {
          if (!document.fullscreenElement) {
          console.log("Se salió del modo pantalla completa");
          // Aquí podrías hacer algo como restaurar el tamaño o notificar al usuario
          }
      },
    preloadUnityScript() {
      // Pre-cargar sin inicializar
      const script = document.createElement('script');
      script.src = this.unityLoaderUrl;
      script.async = true;
      script.onload = () => {
        console.log('Unity Loader script precargado correctamente');
      };
      script.onerror = () => {
        console.error('Error al precargar el script de Unity');
      };
      document.head.appendChild(script);
    },
    
    startGame() {
      this.gameStarted = true;
      this.loading = true;
      this.showCanvas = false;
      this.currentRetry = 0;

      this.$nextTick(() => {
          // Esperar un pelín para que Vue pinte los cambios y se renderice el canvas
          setTimeout(() => {
          this.showCanvas = true;

          // Otro tick para asegurarse de que el DOM tenga el canvas montado
          this.$nextTick(() => {
              this.loadUnityGame();
          });
          }, 100);
      });
      },
    
    loadUnityGame() {
      if (typeof window.createUnityInstance !== 'function') {
        console.log('Cargando script de Unity...');
        this.loadUnityScript()
          .then(() => {
            // Asegurarse de que createUnityInstance está disponible
            if (typeof window.createUnityInstance === 'function') {
              console.log('Script de Unity cargado, inicializando...');
              this.initTimeout = setTimeout(() => {
                this.initializeUnity();
              }, 300);
            } else {
              console.error('createUnityInstance no está disponible después de cargar el script');
              this.loading = false;
            }
          })
          .catch(error => {
            console.error('Error al cargar el script de Unity:', error);
            this.loading = false;
          });
      } else {
        console.log('Script de Unity ya cargado, inicializando...');
        this.initTimeout = setTimeout(() => {
          this.initializeUnity();
        }, 300);
      }
    },
    
    loadUnityScript() {
      return new Promise((resolve, reject) => {
        // Verificar si ya existe el script
        const existingScript = document.querySelector(`script[src="${this.unityLoaderUrl}"]`);
        if (existingScript) {
          console.log('El script de Unity ya existe en el DOM');
          return resolve();
        }
        
        const script = document.createElement('script');
        script.src = this.unityLoaderUrl;
        script.async = true;
        script.onload = () => {
          console.log('Unity Loader script cargado correctamente');
          resolve();
        };
        script.onerror = () => {
          reject(new Error('No se pudo cargar el script de Unity'));
        };
        document.head.appendChild(script);
      });
    },
    
    initializeUnity() {
      // Comprobar si ya hay una instancia en ejecución
      if (this.unityInstance) {
        console.log('Ya existe una instancia de Unity, deteniéndola primero...');
        this.unityInstance.Quit().then(() => {
          this.unityInstance = null;
          this.initializeUnity();
        });
        return;
      }
      
      // Usar la referencia al canvas que ya está en el DOM
      const canvas = this.$refs.unityCanvas;
      
      if (!canvas) {
        console.error('No se encontró el canvas de Unity en el DOM');
        
        if (this.currentRetry < this.maxRetries) {
          this.currentRetry++;
          console.log(`Intento ${this.currentRetry}/${this.maxRetries} - Reintentando en 500ms...`);
          
          this.initTimeout = setTimeout(() => {
            this.initializeUnity();
          }, 500);
          return;
        } else {
          console.error('Número máximo de intentos alcanzado. No se pudo encontrar el canvas.');
          this.loading = false;
          return;
        }
      }
      
      console.log('Canvas Unity encontrado, inicializando instancia...');
      
      try {
        // Asegurarse de que createUnityInstance está disponible
        if (typeof window.createUnityInstance !== 'function') {
          console.error('createUnityInstance no está disponible');
          this.loading = false;
          return;
        }
        
        // Inicializar Unity
        window.createUnityInstance(canvas, this.unityConfig, (progress) => {
          console.log(`Progreso de carga: ${progress * 100}%`);
          this.progress = progress;
        }).then(instance => {
          this.unityInstance = instance;
          this.loading = false;
          console.log('Unity WebGL inicializado correctamente');
        }).catch(error => {
          console.error('Error al inicializar Unity WebGL:', error);
          this.loading = false;
        });
      } catch (error) {
        console.error('Error al intentar inicializar Unity:', error);
        this.loading = false;
      }
    },
    
    toggleFullscreen() {
      const container = this.$refs.unityCanvasContainer;

      if (container.requestFullscreen) {
          container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) { // Safari
          container.webkitRequestFullscreen();
      } else if (container.mozRequestFullScreen) { // Firefox
          container.mozRequestFullScreen();
      } else if (container.msRequestFullscreen) { // IE/Edge
          container.msRequestFullscreen();
      }

      // También puedes decirle a Unity que lo sepa
      if (this.unityInstance) {
          this.unityInstance.SetFullscreen(1);
      }
      }

  },
  beforeUnmount() {
    // Limpiar timeouts
    if (this.initTimeout) {
      clearTimeout(this.initTimeout);
    }
    
    // Limpiar la instancia de Unity al desmontar el componente
    if (this.unityInstance) {
      this.unityInstance.Quit();
    }
  }
}
</script>

<style scoped>
/* Estilos generales */
.game-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  color: #e6ccb3;
  font-family: 'Philosopher', sans-serif;
  position: relative;
}

/* Tema medieval */
.medieval-theme {
  background-color: #1a1a1a;
  padding: 20px;
}

.medieval-subtitle {
  font-family: 'Cinzel', serif;
  color: #e6ccb3;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
}

/* Cabecera */
.game-header {
  background-color: #451804;
  padding: 15px;
  margin-bottom: 20px;
  border: 3px solid #704214;
  border-radius: 8px;
}

.title-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.game-title {
  margin: 0;
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 2px 2px 3px rgba(0, 0, 0, 0.8);
  color: #e6ccb3;
  font-family: 'Cinzel', serif;
  letter-spacing: 2px;
}

.crown-icon {
  color: #DAA520;
}

/* Contenido principal */
.main-content {
  padding: 10px;
}

/* Elementos comunes */
.parchment-card {
  background-color: #2c2421 !important;
  background-image: url('https://www.transparenttextures.com/patterns/parchment.png');
  border: 3px solid #704214 !important;
  border-radius: 8px !important;
}

.divider {
  border-color: #704214 !important;
  border-width: 2px !important;
  margin-top: 10px;
  margin-bottom: 10px;
}

/* Ventana del juego */
.game-window {
  width: 100%;
  height: 480px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
  padding: 4px;
}

.unity-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(40, 30, 20, 0.6);
  border: 1px solid #704214;
}

.game-placeholder {
  text-align: center;
  color: #e6ccb3;
}

.game-loading {
  text-align: center;
  width: 80%;
}

.loading-progress {
  margin-top: 10px;
  font-size: 16px;
  color: #DAA520;
}

.refresh-btn {
  background-color: #8B0000 !important;
  border: 1px solid #704214 !important;
  color: #e6ccb3 !important;
  font-family: 'Cinzel', serif !important;
  letter-spacing: 1px;
  font-weight: bold;
  height: 44px !important;
}

.btn-text {
  font-family: 'Cinzel', serif;
  font-weight: bold;
  letter-spacing: 1px;
}

.unity-canvas-container {
  width: 100%;
  height: 100%;
  position: relative;
}

#unity-canvas {
  width: 100%;
  height: 100%;
  background: #231f20;
  display: block;
}

/* Panel de instrucciones */
.instructions-panel {
  padding: 15px;
  margin-top: 20px;
}

.instructions-title {
  color: #DAA520;
  font-size: 1.6rem;
  margin-top: 0;
  text-align: center;
  font-family: 'Cinzel', serif;
  letter-spacing: 1px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
}

.instructions-list {
  list-style-type: none;
  padding: 0;
  margin-top: 10px;
}

.instructions-list li {
  padding: 8px 0;
  font-size: 16px;
  border-bottom: 1px solid #704214;
  font-family: 'Philosopher', sans-serif;
}

.instructions-list li:last-child {
  border-bottom: none;
}

.instructions-list li b {
  color: #DAA520;
  font-weight: bold;
}

/* Controles de Unity */
.unity-controls {
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 10;
}

.control-btn {
  background-color: rgba(40, 30, 20, 0.7) !important;
  border: 1px solid #704214 !important;
  color: #e6ccb3 !important;
}
:fullscreen .unity-canvas-container,
:-webkit-full-screen .unity-canvas-container,
:-moz-full-screen .unity-canvas-container,
:-ms-fullscreen .unity-canvas-container {
width: 100vw;
height: 100vh;
background-color: #000;
z-index: 9999;
}

:fullscreen canvas,
:-webkit-full-screen canvas,
:-moz-full-screen canvas,
:-ms-fullscreen canvas {
width: 100vw !important;
height: 100vh !important;
}
.fullscreen-btn-wrapper {
position: absolute;
bottom: 10px;
right: 10px;
z-index: 10;
}


/* Para cargar las fuentes necesarias */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Philosopher:wght@400;700&display=swap');
.floating-login-btn {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 1001;
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
}

</style>