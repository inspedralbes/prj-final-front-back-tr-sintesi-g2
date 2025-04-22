<template>
  <v-container fluid class="medieval-theme">
    <v-card class="parchment-card" elevation="8">
      <v-card-title class="card-title d-flex align-center">
        <div class="title-wrapper">
          <v-icon large class="mr-2 crown-icon">mdi-treasure-chest</v-icon>
          <span class="title-text">ROYAL ARMORY</span>
          <v-icon large class="ml-2 crown-icon">mdi-treasure-chest</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn color="accent" class="refresh-btn" @click="loadItems">
          <span class="btn-text">REFRESH</span>
          <v-icon right>mdi-refresh</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider class="divider"></v-divider>

      <div class="items-container pa-4">
        <v-row v-if="loading" justify="center" class="loading-container">
          <v-progress-circular
            indeterminate
            color="#DAA520"
            size="64"
            width="5"
          ></v-progress-circular>
          <div class="loading-text">Forging magical items...</div>
        </v-row>

        <v-row v-else-if="items.length === 0" justify="center" class="empty-container">
          <div class="empty-text">
            <v-icon large color="#704214">mdi-alert-circle-outline</v-icon>
            <span>The armory is empty! No items have been crafted yet.</span>
          </div>
        </v-row>

        <v-row v-else>
          <v-col
            v-for="item in items"
            :key="item.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card class="item-card">
              <div class="item-rarity-indicator" :class="getRarityClass(item)"></div>
              <div class="item-image-container">
                <v-img
                  :src="item.imageUrl"
                  height="180"
                  contain
                  class="item-image"
                >
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="#DAA520"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                  <div class="item-type-badge" :class="getTypeClass(item.item_type)">
                    {{ item.item_type }}
                  </div>
                </v-img>
              </div>
              
              <v-card-title class="item-title">{{ item.item_name }}</v-card-title>
              
              <v-divider class="item-divider"></v-divider>
              
              <v-card-text class="item-stats">
                <div class="stat-row" v-if="item.item_description">
                  <v-icon small color="#DAA520" class="mr-2">mdi-information-outline</v-icon>
                  <span class="stat-label">Description:</span>
                  <span class="stat-value">{{ item.item_description }}</span>
                </div>
                
                <div class="stat-row" v-if="item.value">
                  <v-icon small color="#DAA520" class="mr-2">mdi-currency-usd</v-icon>
                  <span class="stat-label">Value:</span>
                  <span class="stat-value">{{ item.value }}</span>
                </div>
                
                <div class="stat-row" v-if="item.rarity">
                  <v-icon small color="#DAA520" class="mr-2">mdi-diamond-stone</v-icon>
                  <span class="stat-label">Rarity:</span>
                  <span class="stat-value">{{ item.rarity }}</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <v-divider class="divider"></v-divider>
      
      <v-card-actions class="stats-footer">
        <div class="stat-chip">
          <v-icon left color="#e6ccb3">mdi-package-variant-closed</v-icon>
          Total Items: {{ items.length }}
        </div>
        <v-spacer></v-spacer>
        <div class="stat-chip">
          <v-icon left color="#DAA520">mdi-star</v-icon>
          Rare Items: {{ rareItemsCount }}
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
import axios from 'axios'

export default {
  name: 'ItemManagement',
  data() {
    return {
      items: [],
      loading: false,
      snackbar: {
        show: false,
        text: '',
        color: '',
        icon: ''
      }
    }
  },
  computed: {
    rareItemsCount() {
      return this.items.filter(item => 
        item.rarity === 'rare' || item.rarity === 'epic' || item.rarity === 'legendary'
      ).length;
    }
  },
  methods: {
    async loadItems() {
      this.loading = true;
      try {
        const response = await fetch(`${import.meta.env.VITE_ITEM_API_URL}items`);
        const data = await response.json();

        this.items = data.map(item => {
          // Extraer solo el nombre del archivo de item_image
          const fileName = item.item_image.split('/').pop();
          
          // Construir la URL correcta con el subdirectorio "items"
          return {
            ...item,
            imageUrl: `${import.meta.env.VITE_ITEM_API_URL}imagenes/items/${fileName}`
          };
        });

        this.showNotification('Items summoned successfully', 'success', 'mdi-check-circle');
      } catch (error) {
        console.error('Error loading items:', error);
        this.showNotification('Failed to summon items', 'error', 'mdi-alert');
      }
      this.loading = false;
    },
    
    getTypeClass(type) {
      switch (type?.toLowerCase()) {
        case 'weapon':
          return 'type-weapon';
        case 'armor':
          return 'type-armor';
        case 'potion':
        case 'pocion':
          return 'type-potion';
        case 'scroll':
          return 'type-scroll';
        case 'accessory':
          return 'type-accessory';
        case 'llave':
          return 'type-key';
        default:
          return 'type-misc';
      }
    },
    
    getRarityClass(item) {
      switch(item.rarity?.toLowerCase()) {
        case 'legendary':
          return 'rarity-legendary';
        case 'epic':
          return 'rarity-epic';
        case 'rare':
          return 'rarity-rare';
        case 'uncommon':
          return 'rarity-uncommon';
        default:
          return 'rarity-common';
      }
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
    this.loadItems();
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

.items-container {
  background-color: rgba(40, 30, 20, 0.4);
  min-height: 400px;
}

.loading-container {
  height: 400px;
  flex-direction: column;
}

.loading-text {
  margin-top: 20px;
  color: #e6ccb3;
  font-family: 'Philosopher', sans-serif;
  font-size: 1.2rem;
}

.empty-container {
  height: 400px;
}

.empty-text {
  color: #e6ccb3;
  font-family: 'Philosopher', sans-serif;
  font-size: 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.item-card {
  background-color: #353029 !important;
  border: 2px solid #704214 !important;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.item-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5) !important;
}

.item-rarity-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  z-index: 1;
}

.rarity-common {
  background-color: #807b7a; /* Gray */
}

.rarity-uncommon {
  background-color: #2e8b57; /* Green */
}

.rarity-rare {
  background-color: #1E90FF; /* Blue */
}

.rarity-epic {
  background-color: #9370DB; /* Purple */
}

.rarity-legendary {
  background: linear-gradient(90deg, #ff8c00, #ffd700, #ff8c00);
  background-size: 200% 100%;
  animation: gradient-shift 2s ease infinite;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.item-image-container {
  position: relative;
  background-color: #262220;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 180px;
}

.item-image {
  object-fit: contain !important;
  max-height: 160px !important;
  margin: auto;
}

.item-type-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Philosopher', sans-serif;
  font-size: 0.8rem;
  font-weight: bold;
  color: #e6ccb3;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(112, 66, 20, 0.8);
  z-index: 1;
}

.type-weapon {
  background-color: rgba(139, 0, 0, 0.8); /* Dark red */
}

.type-armor {
  background-color: rgba(70, 130, 180, 0.8); /* Steel blue */
}

.type-potion {
  background-color: rgba(85, 107, 47, 0.8); /* Dark olive green */
}

.type-scroll {
  background-color: rgba(160, 82, 45, 0.8); /* Sienna */
}

.type-accessory {
  background-color: rgba(147, 112, 219, 0.8); /* Medium purple */
}

.type-key {
  background-color: rgba(218, 165, 32, 0.8); /* Goldenrod */
}

.type-misc {
  background-color: rgba(112, 66, 20, 0.8); /* Brown */
}

.item-title {
  color: #e6ccb3 !important;
  font-family: 'Cinzel', serif !important;
  font-size: 1.1rem !important;
  padding: 12px 16px !important;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.item-divider {
  border-color: #704214 !important;
}

.item-stats {
  padding: 12px 16px !important;
  color: #e6ccb3 !important;
  font-family: 'Philosopher', sans-serif !important;
  flex-grow: 1;
}

.stat-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.stat-label {
  font-weight: bold;
  margin-right: 6px;
  color: #a67c52;
  min-width: 80px;
}

.stat-value {
  flex-grow: 1;
}

.damage-text {
  color: #ff6b6b;
}

.defense-text {
  color: #1E90FF;
}

.stats-footer {
  background-color: #353029;
  padding: 12px 16px !important;
  border-top: 2px solid #704214;
  margin-top: auto;
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