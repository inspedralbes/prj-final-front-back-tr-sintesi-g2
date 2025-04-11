<template>
  <v-container fluid class="medieval-theme">
    <v-card class="parchment-card" elevation="8">
      <v-card-title class="card-title d-flex align-center">
        <div class="title-wrapper">
          <v-icon large class="mr-2 crown-icon">mdi-sword-cross</v-icon>
          <span class="title-text">GAMES REGISTRY</span>
          <v-icon large class="ml-2 crown-icon">mdi-sword-cross</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn color="accent" class="refresh-btn" @click="loadGames">
          <span class="btn-text">REFRESH</span>
          <v-icon right>mdi-refresh</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider class="divider"></v-divider>

      <v-data-table
        :headers="headers"
        :items="games"
        :loading="loading"
        class="medieval-table"
        :loading-text="'Summoning games from distant battlefields...'"
        :no-data-text="'No games have been played in the realm...yet'"
        :items-per-page="10"
        :footer-props="{
          'items-per-page-text': 'Games per scroll',
          'items-per-page-options': [5, 10, 20],
        }"
      >
        <template v-slot:loading>
          <v-row justify="center" align="center" style="height: 400px;">
            <v-progress-circular
              indeterminate
              color="#DAA520"
              size="64"
              width="5"
            ></v-progress-circular>
          </v-row>
        </template>
        
        <!-- Player Column -->
        <template v-slot:item.playerId="{ item }">
          <div class="stat-wrapper">
            <v-icon small color="#e6ccb3" class="mr-1">mdi-account</v-icon>
            {{ item.playerId }}
          </div>
        </template>
        
        <!-- Score Column -->
        <template v-slot:item.score="{ item }">
          <div class="stat-wrapper">
            <v-icon small color="#FFD700" class="mr-1">mdi-star</v-icon>
            {{ item.score }}
          </div>
        </template>
        
        <!-- Time Column -->
        <template v-slot:item.time="{ item }">
          <div class="stat-wrapper">
            <v-icon small color="#1E90FF" class="mr-1">mdi-clock-outline</v-icon>
            {{ formatTime(item.time) }}
          </div>
        </template>
        
        <!-- Status Column -->
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            text-color="#e6ccb3"
            class="medieval-chip"
          >
            {{ formatStatus(item.status) }}
          </v-chip>
        </template>
        
        <!-- Created At Column -->
        <template v-slot:item.createdAt="{ item }">
          <div class="stat-wrapper">
            <v-icon small color="#9370DB" class="mr-1">mdi-calendar</v-icon>
            {{ formatDate(item.createdAt) }}
          </div>
        </template>
      </v-data-table>
      
      <v-divider class="divider"></v-divider>
      
      <v-card-actions class="stats-footer">
        <div class="stat-chip">
          <v-icon left color="#e6ccb3">mdi-controller</v-icon>
          Total Games: {{ games.length }}
        </div>
        <v-spacer></v-spacer>
        <div class="stat-chip">
          <v-icon left color="#50C878">mdi-check-circle</v-icon>
          Completed: {{ completedGamesCount }}
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
  name: 'GameManagement',
  data() {
    return {
      games: [],
      loading: false,
      snackbar: {
        show: false,
        text: '',
        color: '',
        icon: ''
      },
      headers: [
        { text: 'ID', value: 'id', align: 'center', width: '70px' },
        { text: 'PLAYER', value: 'playerId', align: 'start' },
        { text: 'SCORE', value: 'score', align: 'center' },
        { text: 'TIME', value: 'time', align: 'center' },
        { text: 'STATUS', value: 'status', align: 'center' },
        { text: 'CREATED AT', value: 'createdAt', align: 'center' }
      ]
    }
  },
  computed: {
    completedGamesCount() {
      return this.games.filter(game => game.status === 'completed').length;
    }
  },
  methods: {
    async loadGames() {
      this.loading = true;
      try {
        const response = await fetch(`${import.meta.env.VITE_GAME_API_URL}game`);
        if (!response.ok) throw new Error('Error loading games');
        this.games = await response.json();
        this.showNotification('Games summoned successfully', 'success', 'mdi-check-circle');
      } catch (error) {
        console.error('Error loading games:', error);
        this.showNotification('Failed to summon games', 'error', 'mdi-alert');
      }
      this.loading = false;
    },
    
    getStatusColor(status) {
      switch (status) {
        case 'completed':
          return '#50C878'; // Medieval green
        case 'in_progress':
          return '#1E90FF'; // Medieval blue
        case 'failed':
          return '#8B0000'; // Medieval red
        default:
          return '#704214'; // Medieval brown
      }
    },
    
    formatStatus(status) {
      switch (status) {
        case 'completed':
          return 'VICTORIOUS';
        case 'in_progress':
          return 'IN BATTLE';
        case 'failed':
          return 'DEFEATED';
        default:
          return 'UNKNOWN';
      }
    },
    
    formatTime(seconds) {
      if (!seconds) return '0h 0m';
      
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      
      return `${hours}h ${minutes}m`;
    },
    
    formatDate(dateString) {
      if (!dateString) return 'Unknown';
      
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
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
    this.loadGames();
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

.medieval-table {
  background: transparent !important;
}

.medieval-table :deep(th) {
  background-color: #353029 !important;
  color: #e6ccb3 !important;
  font-family: 'Cinzel', serif !important;
  font-weight: bold !important;
  letter-spacing: 1px;
  text-align: center !important;
  border-bottom: 2px solid #704214 !important;
  padding: 12px 8px !important;
  font-size: 0.85rem !important;
}

.medieval-table :deep(td) {
  background-color: rgba(40, 30, 20, 0.6) !important;
  color: #e6ccb3 !important;
  font-family: 'Philosopher', sans-serif !important;
  border-bottom: 1px solid #704214 !important;
  text-align: center !important;
  padding: 8px !important;
}

.medieval-table :deep(tr:hover) {
  background-color: rgba(70, 40, 20, 0.4) !important;
}

.medieval-table :deep(.v-data-table__wrapper) {
  border: 2px solid #704214 !important;
  border-radius: 0;
  overflow-x: auto;
}

.medieval-table :deep(.v-data-footer) {
  background-color: #353029 !important;
  color: #e6ccb3 !important;
  border-top: 2px solid #704214 !important;
}

.medieval-table :deep(.v-data-footer__select) {
  color: #e6ccb3 !important;
}

.stat-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.medieval-chip {
  border: 1px solid #704214 !important;
  font-family: 'Philosopher', sans-serif !important;
  font-weight: bold;
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

/* Para cargar las fuentes necesarias */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Philosopher:wght@400;700&display=swap');
</style>