<template>
  <v-container fluid class="medieval-theme">
    <v-row>
      <v-col cols="12">
        <v-card class="parchment-card mb-4">
          <v-card-title class="card-title d-flex align-center">
            <div class="title-wrapper">
              <v-icon large class="mr-2 crown-icon">mdi-crown</v-icon>
              <span class="title-text">PANEL DE CONTROL</span>
              <v-icon large class="ml-2 crown-icon">mdi-crown</v-icon>
            </div>
            <v-spacer></v-spacer>
            
            <!-- Botón de logout -->
            <v-btn
              color="accent"
              class="logout-btn"
              @click="handleLogout"
              elevation="2"
            >
              <span class="btn-text">SALIR</span>
              <v-icon right>mdi-exit-to-app</v-icon>
            </v-btn>
          </v-card-title>
          
          <v-divider class="divider"></v-divider>
          
          <!-- Tabs medievales -->
          <v-tabs 
            v-model="activeTab" 
            background-color="#353029" 
            class="medieval-tabs"
            slider-color="#DAA520"
          >
            <v-tab value="players" class="tab-item">
              <v-icon left>mdi-account-group</v-icon>
              <span class="tab-text">JUGADORES</span>
            </v-tab>
            <v-tab value="enemies" class="tab-item">
              <v-icon left>mdi-sword-cross</v-icon>
              <span class="tab-text">ENEMIGOS</span>
            </v-tab>
            <v-tab value="bosses" class="tab-item">
              <v-icon left>mdi-spider</v-icon>
              <span class="tab-text">JEFES</span>
            </v-tab>
            <v-tab value="games" class="tab-item">
              <v-icon left>mdi-dice-multiple</v-icon>
              <span class="tab-text">PARTIDAS</span>
            </v-tab>
            <v-tab value="items" class="tab-item">
              <v-icon left>mdi-treasure-chest</v-icon>
              <span class="tab-text">OBJETOS</span>
            </v-tab>
            <v-tab value="shop" class="tab-item">
              <v-icon left>mdi-store</v-icon>
              <span class="tab-text">TIENDA</span>
            </v-tab>
          </v-tabs>
        </v-card>
        
        <!-- Contenido de las pestañas -->
        <v-card class="parchment-card content-card">
          <v-window v-model="activeTab">
            <v-window-item value="players">
              <PlayerManagement />
            </v-window-item>
            <v-window-item value="enemies">
              <EnemyManagement />
            </v-window-item>
            <v-window-item value="bosses">
              <BossManagement />
            </v-window-item>
            <v-window-item value="games">
              <GameManagement />
            </v-window-item>
            <v-window-item value="items">
              <ItemManagement />
            </v-window-item>
            <v-window-item value="shop">
              <ShopManagement />
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Snackbar para notificaciones -->
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
    
    <!-- Diálogo de confirmación para logout -->
    <v-dialog v-model="logoutDialog" max-width="400" class="medieval-dialog">
      <v-card class="parchment-card">
        <v-card-title class="card-title">
          <span class="dialog-title">CONFIRMAR SALIDA</span>
        </v-card-title>
        
        <v-divider class="divider"></v-divider>
        
        <v-card-text class="dialog-content">
          ¿Estás seguro que deseas abandonar el reino?
        </v-card-text>
        
        <v-divider class="divider"></v-divider>
        
        <v-card-actions class="dialog-actions">
          <v-spacer></v-spacer>
          <v-btn class="cancel-btn" @click="logoutDialog = false">
            <span class="btn-text">CANCELAR</span>
          </v-btn>
          <v-btn class="confirm-btn" @click="confirmLogout">
            <span class="btn-text">CONFIRMAR</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import PlayerManagement from './dashboard/PlayerManagement.vue'
import EnemyManagement from './dashboard/EnemyManagement.vue'
import BossManagement from './dashboard/BossManagement.vue'
import GameManagement from './dashboard/GameManagement.vue'
import ItemManagement from './dashboard/ItemManagement.vue'
import ShopManagement from './dashboard/ShopManagement.vue'

export default {
  name: 'Dashboard',
  components: {
    PlayerManagement,
    EnemyManagement,
    BossManagement,
    GameManagement,
    ItemManagement,
    ShopManagement
  },
  data() {
    return {
      activeTab: 'players',
      logoutDialog: false,
      snackbar: {
        show: false,
        text: '',
        color: '',
        icon: ''
      }
    }
  },
  methods: {
    handleLogout() {
      this.logoutDialog = true;
    },
    
    confirmLogout() {
      // Borrar el token y usuario del localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Mostrar notificación
      this.showNotification('Has abandonado el reino', 'info', 'mdi-exit-to-app');
      
      // Cerrar el diálogo
      this.logoutDialog = false;
      
      // Redireccionar al login después de un breve retraso
      setTimeout(() => {
        this.$router.push('/login');
      }, 1000);
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
  min-height: 100vh;
  padding: 20px;
}

.parchment-card {
  background-color: #2c2421 !important;
  background-image: url('https://www.transparenttextures.com/patterns/parchment.png');
  border: 3px solid #704214 !important;
  border-radius: 8px !important;
}

.content-card {
  min-height: 70vh;
  padding: 16px;
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
  color: #e6ccb3;
}

.crown-icon {
  color: #DAA520;
}

.divider {
  border-color: #704214 !important;
  border-width: 2px !important;
  margin: 0;
}

.logout-btn {
  background-color: #8B0000 !important;
  border: 1px solid #704214 !important;
  color: #e6ccb3 !important;
  font-family: 'Cinzel', serif !important;
  letter-spacing: 1px;
  font-weight: bold;
}

.medieval-tabs :deep(.v-tab) {
  color: #a67c52 !important;
  font-family: 'Cinzel', serif !important;
  letter-spacing: 1px;
  font-weight: bold;
  opacity: 0.7;
  padding: 0 20px;
  height: 48px;
}

.medieval-tabs :deep(.v-tab--selected) {
  color: #DAA520 !important;
  opacity: 1;
  border-bottom: 2px solid #DAA520;
}

.medieval-tabs :deep(.v-tabs-bar) {
  background-color: #353029 !important;
  border-bottom: 2px solid #704214;
}

.tab-item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-text {
  margin-left: 8px;
  font-size: 0.9rem;
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

.medieval-dialog :deep(.v-card) {
  background-color: #2c2421 !important;
  background-image: url('https://www.transparenttextures.com/patterns/parchment.png') !important;
  border: 3px solid #704214 !important;
}

.dialog-title {
  font-family: 'Cinzel', serif !important;
  font-weight: bold;
  font-size: 1.4rem;
  color: #e6ccb3;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
  width: 100%;
  text-align: center;
}

.dialog-content {
  font-family: 'Philosopher', sans-serif !important;
  color: #e6ccb3;
  font-size: 1.1rem;
  padding: 20px;
  text-align: center;
}

.dialog-actions {
  padding: 16px;
}

.cancel-btn {
  background-color: #444 !important;
  border: 1px solid #704214 !important;
  color: #e6ccb3 !important;
  margin-right: 10px;
}

.confirm-btn {
  background-color: #8B0000 !important;
  border: 1px solid #704214 !important;
  color: #e6ccb3 !important;
}

/* Para cargar las fuentes necesarias */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Philosopher:wght@400;700&display=swap');
</style>