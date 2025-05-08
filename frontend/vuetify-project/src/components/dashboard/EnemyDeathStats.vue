<template>
  <v-container fluid class="medieval-theme">
    <v-card class="parchment-card" elevation="8">
      <v-card-title class="card-title d-flex align-center">
        <div class="title-wrapper">
          <v-icon large class="mr-2 crown-icon">mdi-skull-crossbones</v-icon>
          <span class="title-text">ENEMY DEATH REGISTRY</span>
          <v-icon large class="ml-2 crown-icon">mdi-skull-crossbones</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn color="accent" class="refresh-btn" @click="refreshImage">
          <span class="btn-text">REFRESH</span>
          <v-icon right>mdi-refresh</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider class="divider"></v-divider>

      <v-card-text class="stats-content">
        <div v-if="loading" class="stats-loading">
          <v-progress-circular
            indeterminate
            color="#DAA520"
            size="64"
            width="5"
          ></v-progress-circular>
          <div class="loading-text">Summoning death statistics from the battlefield...</div>
        </div>
        
        <div v-else-if="imgUrl && !imageError" class="stats-img-container">
          <v-card flat class="image-frame">
            <img 
              :src="imgUrl" 
              alt="Enemy Death Statistics" 
              class="stats-img" 
              @error="handleImageError"
              @load="imageLoaded = true"
            />
            <div class="image-caption" v-if="imageLoaded">
              <span class="caption-text">Death statistics of your most fearsome foes</span>
            </div>
          </v-card>
        </div>
        
        <div v-else class="empty-stats">
          <v-icon x-large color="#8B0000">mdi-alert-circle</v-icon>
          <div class="empty-text">No enemy death records have been inscribed in the realm...yet</div>
          <div class="debug-info">
            <p>Debug information:</p>
            <p>Image URL: {{ imgUrl }}</p>
            <p>Try checking the console for more details.</p>
          </div>
        </div>
      </v-card-text>
      
      <v-divider class="divider"></v-divider>
      
      <v-card-actions class="stats-footer">
        <div class="stat-chip">
          <v-icon left color="#e6ccb3">mdi-history</v-icon>
          Last Updated: {{ lastUpdated }}
        </div>
        <v-spacer></v-spacer>
        <div class="stat-chip">
          <v-icon left color="#DAA520">mdi-trophy</v-icon>
          Most Deadly Foe: {{ mostDeadlyEnemy }}
        </div>
      </v-card-actions>
    </v-card>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      bottom
      right
      class="medieval-snackbar"
    >
      <div class="snackbar-content">
        <v-icon left>{{ snackbar.icon }}</v-icon>
        {{ snackbar.text }}
      </div>
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  name: 'EnemyDeathStats',
  data() {
    return {
      imgUrl: null,
      loading: true,
      imageError: false,
      imageLoaded: false,
      lastUpdated: 'Unknown',
      mostDeadlyEnemy: 'Unknown',
      snackbar: {
        show: false,
        text: '',
        color: '',
        icon: ''
      }
    }
  },
  methods: {
    handleImageError() {
      this.imageError = true;
      this.loading = false;
      this.showNotification('Failed to load death statistics', 'error', 'mdi-alert');
      console.error('Failed to load image from URL:', this.imgUrl);
    },
    
    refreshImage() {
      this.loading = true;
      this.imageError = false;
      this.imageLoaded = false;
      
      // Añadir timestamp para evitar caché
      const timestamp = new Date().getTime();
      
      // Usar la URL de Vite directamente sin reemplazo de "/"
      const baseUrl = import.meta.env.VITE_ENEMYSTATS_API_URL;
      this.imgUrl = `${baseUrl}stat_images/deaths_per_enemy.png?t=${timestamp}`;
      
      this.showNotification('Summoning fresh statistics', 'info', 'mdi-refresh');
      
      // Set a timeout to ensure loading state shows for at least a moment
      setTimeout(() => {
        if (!this.imageLoaded) {
          this.loading = false;
        }
      }, 2000);
    },
    
    loadImage() {
      this.loading = true;
      
      // Usar la URL de Vite directamente sin reemplazo de "/"
      const baseUrl = import.meta.env.VITE_ENEMYSTATS_API_URL;
      this.imgUrl = `${baseUrl}stat_images/deaths_per_enemy.png`;
      
      console.log('Loading image from URL:', this.imgUrl);
      
      // Set current date as last updated
      this.lastUpdated = new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date());
      
      // También intentamos cargar información adicional
      this.fetchAdditionalStats();
      
      // Set a timeout to ensure loading state shows for at least a moment
      setTimeout(() => {
        if (!this.imageLoaded) {
          this.loading = false;
        }
      }, 2000);
    },
    
    async fetchAdditionalStats() {
      try {
        // Usar la URL de Vite directamente sin reemplazo de "/"
        const baseUrl = import.meta.env.VITE_ENEMYSTATS_API_URL;
        // Intentar obtener datos adicionales si están disponibles
        const response = await fetch(`${baseUrl}enemy-death-stats/data`);
        if (response.ok) {
          const data = await response.json();
          if (data.mostDeadly) {
            this.mostDeadlyEnemy = data.mostDeadly;
          }
        }
      } catch (error) {
        console.log('No additional stats available, using default value:', error);
        // Usar valor por defecto si no hay API para datos adicionales
        this.getMostDeadlyEnemy();
      }
    },
    
    getMostDeadlyEnemy() {
      // This is a mock function - in a real app, you would fetch this from your API
      const enemies = ['Dragon', 'Troll', 'Goblin', 'Dark Knight', 'Necromancer'];
      this.mostDeadlyEnemy = enemies[Math.floor(Math.random() * enemies.length)];
    },
    
    showNotification(text, color, icon) {
      this.snackbar = {
        show: true,
        text,
        color,
        icon
      };
    }
  },
  mounted() {
    this.loadImage();
  }
}
</script>

<style scoped>
.medieval-theme {
  background-color: #1a1a1a;
  min-height: 100vh;
  padding: 20px;
}

.parchment-card {
  background-color: #2c2421 !important;
  background-image: url('https://www.transparenttextures.com/patterns/parchment.png');
  border: 3px solid #704214 !important;
  border-radius: 8px !important;
}

.card-title {
  background-color: #451804;
  color: #e6ccb3 !important;
  padding: 16px 20px !important;
  font-family: 'Cinzel', serif !important;
  letter-spacing: 2px;
}

.title-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-text {
  font-size: 1.6rem;
  font-weight: bold;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
}

.crown-icon {
  color: #DAA520;
}

.divider {
  border-color: #704214 !important;
  border-width: 2px !important;
  margin: 0;
}

.refresh-btn {
  background-color: #8B0000 !important;
  border: 1px solid #704214 !important;
  color: #e6ccb3 !important;
  font-family: 'Cinzel', serif !important;
  letter-spacing: 1px;
  font-weight: bold;
}

.stats-content {
  padding: 24px;
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.stats-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
}

.loading-text {
  margin-top: 20px;
  color: #e6ccb3;
  font-family: 'Philosopher', sans-serif;
  font-size: 1.2rem;
}

.stats-img-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.image-frame {
  background-color: rgba(40, 30, 20, 0.6) !important;
  border: 4px solid #704214 !important;
  border-radius: 8px !important;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.7) !important;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.stats-img {
  width: 100%;
  display: block;
  object-fit: contain;
  max-height: 500px;
}

.image-caption {
  background-color: rgba(40, 30, 20, 0.8);
  color: #e6ccb3;
  font-family: 'Cinzel', serif;
  padding: 10px;
  text-align: center;
  border-top: 2px solid #704214;
}

.caption-text {
  font-size: 1rem;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  letter-spacing: 1px;
}

.debug-info {
  margin-top: 20px;
  font-family: 'Philosopher', sans-serif;
  color: #e6ccb3;
  background-color: rgba(80, 40, 20, 0.4);
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #704214;
  text-align: left;
  font-size: 0.9rem;
}

.empty-stats {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #e6ccb3;
  text-align: center;
  font-family: 'Cinzel', serif;
}

.empty-text {
  margin-top: 20px;
  font-size: 1.2rem;
}

.stats-footer {
  background-color: #353029;
  padding: 12px 16px !important;
  border-top: 2px solid #704214;
}

.stat-chip {
  font-family: 'Cinzel', serif;
  color: #e6ccb3;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: rgba(70, 40, 20, 0.4);
  border: 1px solid #704214;
  border-radius: 4px;
}

.medieval-snackbar {
  font-family: 'Philosopher', sans-serif !important;
}

.snackbar-content {
  display: flex;
  align-items: center;
}

.btn-text {
  font-family: 'Cinzel', serif;
  font-weight: bold;
  letter-spacing: 1px;
}

/* Import required fonts */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Philosopher:wght@400;700&display=swap');
</style>