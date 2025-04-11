<template>
  <v-container fluid class="medieval-theme">
    <v-card class="parchment-card" elevation="8">
      <v-card-title class="card-title d-flex align-center">
        <div class="title-wrapper">
          <v-icon large class="mr-2 crown-icon">mdi-shopping</v-icon>
          <span class="title-text">ROYAL SKIN EMPORIUM</span>
          <v-icon large class="ml-2 crown-icon">mdi-shopping</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn color="accent" class="refresh-btn" @click="openCreateDialog">
          <span class="btn-text">NEW SKIN</span>
          <v-icon right>mdi-plus</v-icon>
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
          <div class="loading-text">Summoning skins from the royal vault...</div>
        </v-row>

        <v-row v-else-if="skins.length === 0" justify="center" class="empty-container">
          <div class="empty-text">
            <v-icon large color="#704214">mdi-alert-circle-outline</v-icon>
            <span>The emporium is empty! No skins have been crafted yet.</span>
          </div>
        </v-row>

        <v-row v-else>
          <v-col
            v-for="skin in skins"
            :key="skin.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card class="item-card">
              <div class="item-rarity-indicator" :class="getRarityClass(skin)"></div>
              <v-img
                :src="skin.imageUrl"
                height="200"
                cover
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
                <div class="item-price-badge">
                  {{ skin.price }} coins
                </div>
              </v-img>
              
              <v-card-title class="item-title">{{ skin.name }}</v-card-title>
              
              <v-divider class="item-divider"></v-divider>
              
              <v-card-text class="item-stats">
                <div class="description-text">{{ skin.description }}</div>
              </v-card-text>

              <v-card-actions class="item-actions">
                <v-btn
                  color="primary"
                  class="medieval-btn edit-btn"
                  @click="editSkin(skin)"
                >
                  <v-icon left>mdi-pencil</v-icon>
                  <span class="btn-text-small">MODIFY</span>
                </v-btn>
                <v-btn
                  color="error"
                  class="medieval-btn delete-btn"
                  @click="confirmDelete(skin)"
                >
                  <v-icon left>mdi-delete</v-icon>
                  <span class="btn-text-small">REMOVE</span>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <v-divider class="divider"></v-divider>
      
      <v-card-actions class="stats-footer">
        <div class="stat-chip">
          <v-icon left color="#e6ccb3">mdi-shopping-outline</v-icon>
          Total Skins: {{ skins.length }}
        </div>
        <v-spacer></v-spacer>
        <div class="stat-chip">
          <v-icon left color="#DAA520">mdi-cash-multiple</v-icon>
          Total Value: {{ totalValue }} coins
        </div>
      </v-card-actions>
    </v-card>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card class="parchment-card dialog-card">
        <v-card-title class="dialog-title">
          {{ formTitle }}
        </v-card-title>

        <v-divider class="divider"></v-divider>

        <v-card-text class="dialog-content">
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="editedItem.name"
              label="Skin Name"
              :rules="[v => !!v || 'Name is required']"
              required
              class="medieval-input"
              filled
              dark
            ></v-text-field>

            <v-text-field
              v-model="editedItem.price"
              label="Price (in royal coins)"
              type="number"
              :rules="[v => !!v || 'Price is required']"
              required
              class="medieval-input"
              filled
              dark
            ></v-text-field>

            <v-textarea
              v-model="editedItem.description"
              label="Description"
              :rules="[v => !!v || 'Description is required']"
              required
              class="medieval-input"
              filled
              dark
            ></v-textarea>

            <v-file-input
              v-model="imageFile"
              accept="image/*"
              label="Skin Image"
              :rules="imageRules"
              @change="handleImageChange"
              class="medieval-input"
              filled
              dark
            ></v-file-input>

            <v-img
              v-if="previewImage"
              :src="previewImage"
              max-height="200"
              contain
              class="preview-image mt-4"
            ></v-img>
          </v-form>
        </v-card-text>

        <v-divider class="divider"></v-divider>

        <v-card-actions class="dialog-actions">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="medieval-btn cancel-btn"
            @click="close"
          >
            <span class="btn-text-small">CANCEL</span>
          </v-btn>
          <v-btn
            color="success"
            class="medieval-btn save-btn"
            @click="save"
            :disabled="!valid"
          >
            <span class="btn-text-small">SAVE</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation -->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card class="parchment-card dialog-card">
        <v-card-title class="dialog-title">
          Are you sure you want to banish this skin?
        </v-card-title>
        
        <v-divider class="divider"></v-divider>
        
        <v-card-actions class="dialog-actions">
          <v-spacer></v-spacer>
          <v-btn color="primary" class="medieval-btn cancel-btn" @click="closeDelete">
            <span class="btn-text-small">KEEP</span>
          </v-btn>
          <v-btn color="error" class="medieval-btn delete-btn" @click="deleteItemConfirm">
            <span class="btn-text-small">BANISH</span>
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
  name: 'MedievalShopManagement',
  data() {
    return {
      skins: [],
      dialog: false,
      dialogDelete: false,
      valid: false,
      loading: false,
      editedIndex: -1,
      imageFile: null,
      previewImage: null,
      snackbar: {
        show: false,
        text: '',
        color: '',
        icon: ''
      },
      editedItem: {
        id: null,
        name: '',
        price: 0,
        description: '',
        imageUrl: ''
      },
      defaultItem: {
        id: null,
        name: '',
        price: 0,
        description: '',
        imageUrl: ''
      },
      imageRules: [
        v => !v || v.size < 2000000 || 'Image size should be less than 2 MB!'
      ]
    }
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Craft New Skin' : 'Modify Skin'
    },
    totalValue() {
      return this.skins.reduce((sum, skin) => sum + Number(skin.price), 0)
    }
  },
  methods: {
    async loadSkins() {
      this.loading = true;
      try {
        const response = await fetch(`${import.meta.env.VITE_SHOP_API_URL}shop`)
        if (!response.ok) throw new Error('Error loading skins')
        this.skins = await response.json()
        this.showNotification('Skins summoned successfully', 'success', 'mdi-check-circle');
      } catch (error) {
        console.error('Error loading skins:', error)
        this.showNotification('Failed to summon skins', 'error', 'mdi-alert');
      }
      this.loading = false;
    },
    editSkin(item) {
      this.editedIndex = this.skins.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.previewImage = item.imageUrl
      this.dialog = true
    },
    openCreateDialog() {
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
      this.previewImage = null
      this.imageFile = null
      this.dialog = true
    },
    async handleImageChange(file) {
      if (!file) {
        this.previewImage = null
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onload = e => {
        this.previewImage = e.target.result
      }
      reader.readAsDataURL(file)
    },
    async save() {
      if (!this.$refs.form.validate()) return

      const formData = new FormData()
      formData.append('name', this.editedItem.name)
      formData.append('price', this.editedItem.price)
      formData.append('description', this.editedItem.description)
      if (this.imageFile) {
        formData.append('image', this.imageFile)
      }

      try {
        let response
        if (this.editedIndex > -1) {
          // Update
          response = await fetch(`${import.meta.env.VITE_SHOP_API_URL}shop/${this.editedItem.id}`, {
            method: 'PUT',
            body: formData
          })
          if (!response.ok) throw new Error('Error updating skin')
          this.showNotification('Skin modified successfully', 'success', 'mdi-check-circle');
        } else {
          // Create
          response = await fetch(`${import.meta.env.VITE_SHOP_API_URL}shop`, {
            method: 'POST',
            body: formData
          })
          if (!response.ok) throw new Error('Error creating skin')
          this.showNotification('New skin crafted successfully', 'success', 'mdi-check-circle');
        }
        
        this.close()
        this.loadSkins()
      } catch (error) {
        console.error('Error saving skin:', error)
        this.showNotification('Failed to save skin', 'error', 'mdi-alert');
      }
    },
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        this.imageFile = null
        this.previewImage = null
      })
    },
    confirmDelete(item) {
      this.editedIndex = this.skins.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    async deleteItemConfirm() {
      try {
        const response = await fetch(`${import.meta.env.VITE_SHOP_API_URL}shop/${this.editedItem.id}`, {
          method: 'DELETE'
        })
        if (!response.ok) throw new Error('Error deleting skin')
        this.showNotification('Skin banished successfully', 'success', 'mdi-check-circle');
        this.loadSkins()
      } catch (error) {
        console.error('Error deleting skin:', error)
        this.showNotification('Failed to banish skin', 'error', 'mdi-alert');
      }
      this.closeDelete()
    },
    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    getRarityClass(skin) {
      const price = Number(skin.price);
      if (price >= 1000) {
        return 'rarity-legendary';
      } else if (price >= 500) {
        return 'rarity-epic';
      } else if (price >= 250) {
        return 'rarity-rare';
      } else if (price >= 100) {
        return 'rarity-uncommon';
      } else {
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
    this.loadSkins()
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Philosopher:wght@400;700&display=swap');

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

.item-image {
  position: relative;
}

.item-price-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Philosopher', sans-serif;
  font-size: 0.9rem;
  font-weight: bold;
  color: #FFD700;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  background-color: rgba(70, 40, 20, 0.8);
  border: 1px solid #DAA520;
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
}

.description-text {
  line-height: 1.5;
  max-height: 80px;
  overflow-y: auto;
}

.item-actions {
  background-color: rgba(40, 30, 20, 0.4);
  padding: 8px !important;
  justify-content: space-around;
}

.medieval-btn {
  border: 1px solid #704214 !important;
  font-family: 'Cinzel', serif !important;
  letter-spacing: 1px;
}

.edit-btn {
  background-color: #2c5282 !important;
  color: #e6ccb3 !important;
}

.delete-btn {
  background-color: #8B0000 !important;
  color: #e6ccb3 !important;
}

.save-btn {
  background-color: #2e8b57 !important;
  color: #e6ccb3 !important;
}

.cancel-btn {
  background-color: #5e5e5e !important;
  color: #e6ccb3 !important;
}

.btn-text-small {
  font-size: 0.85rem;
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

.dialog-card {
  background-color: #2c2421 !important;
}

.dialog-title {
  color: #e6ccb3 !important;
  font-family: 'Cinzel', serif !important;
  background-color: #451804;
  padding: 16px !important;
  letter-spacing: 1px;
  font-size: 1.3rem !important;
}

.dialog-content {
  padding: 20px !important;
  background-color: rgba(40, 30, 20, 0.4);
}

.dialog-actions {
  background-color: #353029;
  padding: 12px 16px !important;
}

.medieval-input :deep(.v-input__slot) {
  background-color: rgba(70, 40, 20, 0.4) !important;
  border: 1px solid #704214 !important;
}

.medieval-input :deep(.v-label) {
  color: #DAA520 !important;
  font-family: 'Philosopher', sans-serif;
}

.medieval-input :deep(.v-input__slot input),
.medieval-input :deep(.v-input__slot textarea) {
  color: #e6ccb3 !important;
  font-family: 'Philosopher', sans-serif;
}

.preview-image {
  border: 2px solid #704214;
  border-radius: 4px;
  background-color: rgba(40, 30, 20, 0.4);
}
</style>