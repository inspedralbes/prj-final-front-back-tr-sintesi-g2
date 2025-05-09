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
        
        <div v-else-if="chartList && !imageError" class="stats-img-container">
          <v-card flat class="image-frame">
  <v-tabs v-model="selectedChart" background-color="transparent" grow class="stats-tabs">
    <v-tab
      v-for="(chart, idx) in chartList"
      :key="chart.key + '-tab'"
      :value="idx"
      class="tab-label"
    >
      {{ chart.shortLabel }}
    </v-tab>
  </v-tabs>
  <v-tabs-items v-model="selectedChart">
    <v-tab-item
      v-for="(chart, idx) in chartList"
      :key="chart.key + '-tab-item'"
      :value="idx"
    >
      <div class="tab-img-wrapper">
        <div class="img-scroll-box">
          <img
            :src="chart.url"
            :alt="chart.label"
            class="stats-img-tab clickable"
            @click="openModal(chart)"
            @error="handleImageError"
            @load="imageLoaded = true"
          />
        </div>
        <div class="image-caption" v-if="imageLoaded">
          <span class="caption-text">{{ chart.label }}</span>
        </div>
      </div>
      <!-- Modal para imagen ampliada -->
      <v-dialog v-model="showModal" max-width="98vw" max-height="98vh" persistent>
        <v-card class="modal-img-card">
          <v-btn icon class="modal-close-btn" @click="showModal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <img :src="modalImgUrl" :alt="modalImgLabel" class="modal-img" />
          <div class="modal-caption">{{ modalImgLabel }}</div>
        </v-card>
      </v-dialog>
    </v-tab-item>
  </v-tabs-items>
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
    const baseUrl = import.meta.env.VITE_ENEMYSTATS_API_URL;
    return {
      // --- MODAL STATE ---
      showModal: false,
      modalImgUrl: '',
      modalImgLabel: '',
      chartList: [
        {
          key: 'enemy',
          label: 'Muertes por enemigo',
          shortLabel: 'Enemigo',
          url: `${baseUrl}enemy-death-stats/image`
        },
        {
          key: 'day',
          label: 'Muertes por día',
          shortLabel: 'Día',
          url: `${baseUrl}enemy-death-stats/image/day`
        },
        {
          key: 'user',
          label: 'Muertes por usuario/jugador',
          shortLabel: 'Usuario',
          url: `${baseUrl}enemy-death-stats/image/user`
        },
        {
          key: 'boss',
          label: 'Muertes por boss',
          shortLabel: 'Boss',
          url: `${baseUrl}enemy-death-stats/image/boss`
        }
      ],
      selectedChart: 0,
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
    openModal(chart) {
      this.modalImgUrl = chart.url;
      this.modalImgLabel = chart.label;
      this.showModal = true;
    },
    handleImageError() {
      this.imageError = true;
      this.loading = false;
      this.showNotification('Failed to load death statistics', 'error', 'mdi-alert');
      console.error('Failed to load image from URL:', this.chartList[this.selectedChart].url);
    },
    
    refreshImage() {
      this.loading = true;
      this.imageError = false;
      this.imageLoaded = false;
      // Añadir timestamp a todas las URLs para evitar caché
      const timestamp = new Date().getTime();
      this.chartList = this.chartList.map(chart => ({
        ...chart,
        url: chart.url.split('?')[0] + '?t=' + timestamp
      }));
      this.showNotification('Summoning fresh statistics', 'info', 'mdi-refresh');
      // Set a timeout to ensure loading state shows for at least a moment
      setTimeout(() => {
        if (!this.imageLoaded) {
          this.loading = false;
        }
      }, 2000);
    },
    selectChart(idx) {
      this.selectedChart = idx;
      this.imageError = false;
      this.imageLoaded = false;
      // Opcional: podrías forzar recarga de imagen aquí si quieres
    },
    
    loadImage() {
      this.loading = true;
      this.imageError = false;
      this.imageLoaded = false;
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
}
  border-radius: 8px !important;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.7) !important;

.caption-text {
  font-size: 1rem;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  letter-spacing: 1px;
}

.tab-img-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 0;
  max-height: 72vh;
}
.img-scroll-box {
  width: 100%;
  max-width: 100%;
  max-height: 70vh;
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  background: #f9f3e6;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}
.stats-img-tab {
  max-width: 100%;
  max-height: 68vh;
  width: auto;
  height: auto;
  display: block;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.18);
  background: #f9f3e6;
  cursor: zoom-in;
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