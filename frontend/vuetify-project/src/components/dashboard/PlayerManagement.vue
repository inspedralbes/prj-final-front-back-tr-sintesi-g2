<template>
  <v-container fluid class="medieval-theme">
    <v-card class="parchment-card" elevation="8">
      <v-card-title class="card-title d-flex align-center">
        <div class="title-wrapper">
          <v-icon large class="mr-2 crown-icon">mdi-crown</v-icon>
          <span class="title-text">PLAYER REGISTRY</span>
          <v-icon large class="ml-2 crown-icon">mdi-crown</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn color="accent" class="refresh-btn" @click="fetchPlayers">
          <span class="btn-text">REFRESH</span>
          <v-icon right>mdi-refresh</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider class="divider"></v-divider>

      <v-card-text class="search-section">
        <v-text-field
          v-model="searchTerm"
          prepend-icon="mdi-magnify"
          label="Search for players..."
          outlined
          dense
          class="medieval-input search-field"
          hide-details
        ></v-text-field>
      </v-card-text>

      <v-data-table
        :headers="headers"
        :items="filteredPlayers"
        :loading="loading"
        class="medieval-table"
        :loading-text="'Summoning players from distant realms...'"
        :no-data-text="'No players have joined the realm...yet'"
        :items-per-page="10"
        :footer-props="{
          'items-per-page-text': 'Players per scroll',
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
        
        <!-- Nickname Column with Offensive Indicator -->
        <template v-slot:item.nickname="{ item }">
          <div class="nickname-wrapper">
            <span :class="{ 'offensive-name': isOffensiveNickname(item.nickname) }">
              {{ item.nickname }}
            </span>
            <v-tooltip bottom v-if="isOffensiveNickname(item.nickname)">
              <template v-slot:activator="{ on, attrs }">
                <v-icon 
                  color="#8B0000" 
                  small 
                  class="ml-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-alert-circle
                </v-icon>
              </template>
              <span>Offensive name detected</span>
            </v-tooltip>
          </div>
        </template>
        
        <!-- Time Played Column -->
        <template v-slot:item.total_time_played="{ item }">
          <div class="stat-wrapper">
            <v-icon small color="#1E90FF" class="mr-1">mdi-clock-outline</v-icon>
            {{ formatTime(item.total_time_played) }}
          </div>
        </template>
        
        <!-- Achievements Column -->
        <template v-slot:item.achievements_unlocked="{ item }">
          <div class="stat-wrapper">
            <v-icon small color="#FFD700" class="mr-1">mdi-trophy</v-icon>
            {{ item.achievements_unlocked }}
          </div>
        </template>
        
        <!-- Creation Date Column -->
        <template v-slot:item.creation_date="{ item }">
          <div class="stat-wrapper">
            <v-icon small color="#9370DB" class="mr-1">mdi-calendar</v-icon>
            {{ formatDate(item.creation_date) }}
          </div>
        </template>
        
        <!-- Actions Column -->
        <template v-slot:item.actions="{ item }">
          <v-btn 
            color="error" 
            icon 
            elevation="2" 
            class="delete-btn"
            :disabled="!isOffensiveNickname(item.nickname) || isDeleting === item.id_player"
            @click="deletePlayer(item.id_player)"
          >
            <v-icon>{{ isDeleting === item.id_player ? 'mdi-loading' : 'mdi-delete' }}</v-icon>
          </v-btn>
          
          <v-tooltip bottom v-if="!isOffensiveNickname(item.nickname)">
            <template v-slot:activator="{ on, attrs }">
              <v-icon 
                color="#355e3b" 
                small 
                class="ml-2 protected-icon"
                v-bind="attrs"
                v-on="on"
              >
                mdi-shield-check
              </v-icon>
            </template>
            <span>Protected player</span>
          </v-tooltip>
        </template>
      </v-data-table>
      
      <v-divider class="divider"></v-divider>
      
      <v-card-actions class="stats-footer">
        <div class="stat-chip">
          <v-icon left color="#e6ccb3">mdi-account-group</v-icon>
          Total Players: {{ players.length }}
        </div>
        <v-spacer></v-spacer>
        <div class="stat-chip">
          <v-icon left color="#8B0000">mdi-alert-circle</v-icon>
          Offensive Names: {{ offensiveCount }}
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
import axios from 'axios';

export default {
  name: 'MedievalPlayersPanel',
  data() {
    return {
      players: [],
      loading: true,
      isDeleting: null,
      searchTerm: '',
      snackbar: {
        show: false,
        text: '',
        color: '',
        icon: ''
      },
      headers: [
        { text: 'ID', value: 'id_player', align: 'center', width: '70px' },
        { text: 'NICKNAME', value: 'nickname', align: 'start' },
        { text: 'TIME PLAYED', value: 'total_time_played', align: 'center' },
        { text: 'ACHIEVEMENTS', value: 'achievements_unlocked', align: 'center' },
        { text: 'JOINED', value: 'creation_date', align: 'center' },
        { text: 'ACTIONS', value: 'actions', align: 'center', sortable: false, width: '100px' }
      ],
      // Lista de palabras ofensivas
      offensiveWords: [
        'tonto', 'idiota', 'estúpido', 'imbécil', 'bastardo',
        'noob', 'puto', 'puta', 'mierda', 'pendejo', 
        'joder', 'cabrón', 'marica', 'perra', 'zorra',
        'caca', 'culo', 'coño', 'gilipollas', 'capullo'
      ]
    }
  },
  computed: {
    filteredPlayers() {
      if (!this.searchTerm) return this.players;
      
      const term = this.searchTerm.toLowerCase();
      return this.players.filter(player => 
        player.nickname.toLowerCase().includes(term)
      );
    },
    offensiveCount() {
      return this.players.filter(player => 
        this.isOffensiveNickname(player.nickname)
      ).length;
    }
  },
  mounted() {
    this.fetchPlayers();
  },
  methods: {
    async fetchPlayers() {
      this.loading = true;
      try {
        const response = await axios.get('http://localhost:3001/players');
        this.players = response.data;
        this.showNotification('Players summoned successfully', 'success', 'mdi-check-circle');
      } catch (error) {
        this.showNotification('Failed to summon players', 'error', 'mdi-alert');
        console.error('Error fetching players:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async deletePlayer(playerId) {
      this.isDeleting = playerId;
      try {
        await axios.delete(`http://localhost:3001/player/${playerId}`);
        this.players = this.players.filter(p => p.id_player !== playerId);
        this.showNotification('Player banished from the realm', 'success', 'mdi-check-circle');
      } catch (error) {
        this.showNotification('Failed to banish player', 'error', 'mdi-alert');
        console.error('Error deleting player:', error);
      } finally {
        this.isDeleting = null;
      }
    },
    
    isOffensiveNickname(nickname) {
      if (!nickname) return false;
      
      const lowerNickname = nickname.toLowerCase();
      
      // Comprobar palabras ofensivas completas
      for (const word of this.offensiveWords) {
        if (lowerNickname.includes(word)) {
          return true;
        }
      }
      
      // Comprobar combinaciones numéricas ofensivas
      if (/\b(69|420|666)\b/.test(lowerNickname)) {
        return true;
      }
      
      // Comprobar insultos con caracteres especiales o números
      const normalized = lowerNickname
        .replace(/0/g, 'o')
        .replace(/1/g, 'i')
        .replace(/3/g, 'e')
        .replace(/4/g, 'a')
        .replace(/5/g, 's')
        .replace(/7/g, 't')
        .replace(/8/g, 'b')
        .replace(/@/g, 'a');
      
      for (const word of this.offensiveWords) {
        if (normalized.includes(word)) {
          return true;
        }
      }
      
      return false;
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
  }
}
</script>

<style scoped>
.medieval-theme {
  background-color: #1a1a1a;
  background-image: url('https://www.transparenttextures.com/patterns/dark-wood.png');
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

.search-section {
  background-color: #353029;
  padding: 12px 16px !important;
}

.search-field {
  max-width: 400px;
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

.nickname-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.offensive-name {
  color: #ff6b6b !important;
  font-weight: bold;
  text-decoration: underline;
  text-decoration-style: wavy;
  text-decoration-color: #8B0000;
}

.stat-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-btn {
  background-color: #8B0000 !important;
  border: 1px solid #a67c52 !important;
}

.delete-btn:disabled {
  background-color: #555 !important;
  opacity: 0.5;
}

.protected-icon {
  opacity: 0.7;
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

.medieval-input :deep(.v-input__slot) {
  background-color: rgba(40, 30, 20, 0.6) !important;
  border: 1px solid #704214 !important;
}

.medieval-input :deep(input) {
  color: #e6ccb3 !important;
  font-family: 'Philosopher', sans-serif !important;
}

.medieval-input :deep(.v-label) {
  color: #a67c52 !important;
  font-family: 'Philosopher', sans-serif !important;
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