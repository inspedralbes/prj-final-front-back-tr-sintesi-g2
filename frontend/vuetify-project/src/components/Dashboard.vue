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
            
            <!-- Botón de mantenimiento -->
            <v-btn
              color="primary"
              class="maintenance-btn mr-3"
              @click="openMaintenanceDialog"
              elevation="2"
            >
              <v-icon left>mdi-tools</v-icon>
              <span class="btn-text">MANTENIMIENTO</span>
            </v-btn>
            
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
            <v-tab value="enemy-death-stats" class="tab-item">
              <v-icon left>mdi-skull-crossbones</v-icon>
              <span class="tab-text">ESTADÍSTICAS</span>
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
    
    <!-- Diálogo de mantenimiento de servicios -->
    <v-dialog v-model="maintenanceDialog" max-width="800" class="medieval-dialog">
      <v-card class="parchment-card">
        <v-card-title class="card-title">
          <div class="title-wrapper">
            <v-icon left>mdi-tools</v-icon>
            <span class="dialog-title">MANTENIMIENTO DE SERVICIOS</span>
          </div>
          <v-spacer></v-spacer>
        </v-card-title>
        
        <v-divider class="divider"></v-divider>
        
        <v-card-text class="dialog-content">
          <v-data-table
            :headers="serviceHeaders"
            :items="services"
            :items-per-page="5"
            class="medieval-table"
          >
            <template v-slot:item.status="{ item }">
              <v-chip
                :color="getStatusColor(item.status)"
                text-color="white"
                small
                class="status-chip"
              >
                {{ item.status }}
              </v-chip>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn
                small
                :color="item.status === 'ONLINE' ? 'error' : 'success'"
                @click="toggleService(item)"
                class="mx-1 service-btn"
                :loading="item.loading"
                elevation="2"
              >
                <v-icon left small>
                  {{ item.status === 'ONLINE' ? 'mdi-power-off' : 'mdi-power' }}
                </v-icon>
                {{ item.status === 'ONLINE' ? 'DETENER' : 'INICIAR' }}
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
        
        <v-divider class="divider"></v-divider>
        
        <v-card-actions class="dialog-actions">
          <v-spacer></v-spacer>
          <v-btn 
            color="primary" 
            @click="refreshServices" 
            :loading="loading"
            class="refresh-btn"
          >
            <v-icon left>mdi-refresh</v-icon>
            <span class="btn-text">ACTUALIZAR</span>
          </v-btn>
          <v-btn 
            color="secondary" 
            @click="maintenanceDialog = false" 
            class="close-btn"
          >
            <span class="btn-text">CERRAR</span>
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
import EnemyDeathStats from './dashboard/EnemyDeathStats.vue'
import axios from 'axios'
import { io } from "socket.io-client";


export default {
  name: 'Dashboard',
  components: {
    PlayerManagement,
    EnemyManagement,
    BossManagement,
    GameManagement,
    ItemManagement,
    ShopManagement,
    EnemyDeathStats
  },
  data() {
    return {
      activeTab: 'players',
      logoutDialog: false,
      maintenanceDialog: false,
      loading: false,
      snackbar: {
        show: false,
        text: '',
        color: '',
        icon: ''
      },
      services: [
        {
          id: 1,
          name: 'Servicio de Jugadores',
          status: 'OFFLINE',
          port: '3001',
          serviceType: 'player',
          loading: false
        },
        {
          id: 2,
          name: 'Servicio de Partidas',
          status: 'OFFLINE',
          port: '3002',
          serviceType: 'game',
          loading: false
        },
        {
          id: 3,
          name: 'Servicio de Inventario',
          status: 'OFFLINE',
          port: '3003',
          serviceType: 'inventory',
          loading: false
        },
        {
          id: 5,
          name: 'Servicio de Objetos',
          status: 'OFFLINE',
          port: '3005',
          serviceType: 'item',
          loading: false
        },
        {
          id: 6,
          name: 'Servicio de Enemigos',
          status: 'OFFLINE',
          port: '3007',
          serviceType: 'enemy',
          loading: false
        },
        {
          id: 7,
          name: 'Servicio de Jefes',
          status: 'OFFLINE',
          port: '3008',
          serviceType: 'boss',
          loading: false
        },
        {
          id: 8,
          name: 'Servicio de Tienda',
          status: 'OFFLINE',
          port: '3009',
          serviceType: 'shop',
          loading: false
        },
        {
          id: 9,
          name: 'Servicio de Estadísticas',
          status: 'OFFLINE',
          port: '3010',
          serviceType: 'enemy-death-stats',
          loading: false
        }
      ],
      serviceHeaders: [
        {
          text: 'NOMBRE',
          align: 'start',
          sortable: true,
          value: 'name'
        },
        {
          text: 'ESTADO',
          align: 'center',
          sortable: true,
          value: 'status'
        },
        {
          text: 'PUERTO',
          align: 'center',
          sortable: true,
          value: 'port'
        },
        {
          text: 'ACCIONES',
          align: 'center',
          sortable: false,
          value: 'actions'
        }
      ],
      serviceApiUrl: process.env.VUE_APP_SERVICE_CONTROL_API || 'http://localhost:3000',
      socket: null
    }
  },
  mounted() {
    // Verificar el estado de los servicios al cargar el componente
    this.refreshServices();
    this.socket = io(this.serviceApiUrl);

    // Recibir el estado inicial de todos los servicios
    this.socket.on("all-services-status", (services) => {
      this.updateServicesFromSocket(services);
    });

    // Recibir cambios individuales de estado
    this.socket.on("service-status-changed", (service) => {
      this.updateServiceStatusFromSocket(service);
    });

    // También refresca el estado vía REST por si acaso
    this.refreshServices();
  },
  beforeDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  },
  
  methods: {
    // Actualiza toda la lista de servicios con el array recibido por socket
    // Actualiza toda la lista de servicios con el array recibido por socket
updateServicesFromSocket(servicesData) {
  servicesData.forEach(serviceData => {
    const index = this.services.findIndex(s => s.serviceType === serviceData.serviceType);
    if (index !== -1) {
      this.services[index] = { ...serviceData, loading: false };
    }
  });
},

// Actualiza solo un servicio individual recibido por socket
updateServiceStatusFromSocket(serviceData) {
  const index = this.services.findIndex(s => s.serviceType === serviceData.serviceType);
  if (index !== -1) {
    this.services[index] = { ...serviceData, loading: false };
    this.showNotification(
      `Servicio ${serviceData.name} ahora está ${serviceData.status}`,
      serviceData.status === 'ONLINE' ? 'success' : 'error',
      serviceData.status === 'ONLINE' ? 'mdi-power' : 'mdi-power-off'
    );
  }
},

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
    },
    
    openMaintenanceDialog() {
      this.maintenanceDialog = true;
      this.refreshServices();
    },
    
    getStatusColor(status) {
      return status === 'ONLINE' ? 'success' : 'error';
    },
    
    async refreshServices() {
      this.loading = true;
      
      try {
        // Obtener el estado de todos los servicios
        const response = await axios.get(`${this.serviceApiUrl}/services`);
        
        if (response.data.success) {
          // Actualizar la información de los servicios
          const servicesData = response.data.services;
          
          servicesData.forEach(serviceData => {
            const index = this.services.findIndex(s => s.serviceType === serviceData.serviceType);
            if (index !== -1) {
              // Mantener el estado de loading
              const currentLoading = this.services[index].loading;
              this.services[index] = { ...serviceData, loading: currentLoading };
            }
          });
          
          this.showNotification('Estado de servicios actualizado', 'info', 'mdi-refresh');
        } else {
          this.showNotification('Error al obtener el estado de los servicios', 'warning', 'mdi-alert');
        }
      } catch (error) {
        console.error('Error al obtener el estado de los servicios:', error);
        this.showNotification('Error de conexión con el servidor de control', 'error', 'mdi-alert-circle');
      } finally {
        this.loading = false;
      }
    },
    
    async toggleService(service) {
  service.loading = true;
  try {
    const action = service.status === 'ONLINE' ? 'stop' : 'start';
    await axios.post(`${this.serviceApiUrl}/services/${service.serviceType}/${action}`);
    // NO cambies el status aquí, ni pongas loading = false
    // Espera al evento socket para actualizar el estado real y quitar loading
  } catch (error) {
    this.showNotification(
      `Error de conexión: No se pudo ${service.status === 'ONLINE' ? 'detener' : 'iniciar'} el servicio`,
      'error',
      'mdi-alert-circle'
    );
    service.loading = false; // Solo aquí, en caso de error de red
  }
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

.maintenance-btn {
  background-color: #6b4226 !important;
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

.refresh-btn {
  background-color: #4a6741 !important;
  border: 1px solid #704214 !important;
  color: #e6ccb3 !important;
  margin-right: 10px;
}

.close-btn {
  background-color: #444 !important;
  border: 1px solid #704214 !important;
  color: #e6ccb3 !important;
}

.medieval-table {
  background-color: transparent !important;
}

.medieval-table :deep(th) {
  font-family: 'Cinzel', serif !important;
  color: #DAA520 !important;
  letter-spacing: 1px;
  font-weight: bold;
  background-color: #451804 !important;
}

.medieval-table :deep(td) {
  font-family: 'Philosopher', sans-serif !important;
  color: #e6ccb3 !important;
  border-bottom: 1px solid #704214 !important;
}

.service-btn {
  font-family: 'Cinzel', serif !important;
  letter-spacing: 1px;
  text-transform: none;
  font-weight: bold;
  border: 1px solid #704214 !important;
}

.status-chip {
  font-family: 'Philosopher', sans-serif !important;
  font-weight: bold;
}

/* Para cargar las fuentes necesarias */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Philosopher:wght@400;700&display=swap');
</style>