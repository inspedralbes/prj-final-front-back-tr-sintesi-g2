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

              <div class="image-path mt-2" style="font-size: 0.8rem; color: #555; text-align: center;">
                {{ skin.imageUrl }}
              </div>
              
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
                  <span class="btn-text-small">EDIT</span>
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
    <v-dialog v-model="dialog" max-width="600px">
      <v-card class="parchment-card dialog-card">
        <v-card-title class="dialog-title">
          {{ formTitle }}
        </v-card-title>
        <v-card-subtitle v-if="isEditing" class="dialog-subtitle">
          Las imágenes que no cambies se conservarán automáticamente
        </v-card-subtitle>

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
              v-model="animationFiles.Attack"
              accept="image/*"
              :label="isEditing ? `Attack Image (${oldSkinName ? 'Se conservará la imagen anterior si no se cambia' : ''})` : 'Attack Image'"
              :rules="isEditing ? [] : imageRules.concat([v => !!v || 'Attack image is required'])"
              class="medieval-input"
              filled
              dark
              prepend-icon="mdi-sword"
            ></v-file-input>
            <v-file-input
              v-model="animationFiles.Dash"
              accept="image/*"
              :label="isEditing ? `Dash Image (${oldSkinName ? 'Se conservará la imagen anterior si no se cambia' : ''})` : 'Dash Image'"
              :rules="isEditing ? [] : imageRules.concat([v => !!v || 'Dash image is required'])"
              class="medieval-input"
              filled
              dark
              prepend-icon="mdi-run-fast"
            ></v-file-input>
            <v-file-input
              v-model="animationFiles.Death"
              accept="image/*"
              :label="isEditing ? `Death Image (${oldSkinName ? 'Se conservará la imagen anterior si no se cambia' : ''})` : 'Death Image'"
              :rules="isEditing ? [] : imageRules.concat([v => !!v || 'Death image is required'])"
              class="medieval-input"
              filled
              dark
              prepend-icon="mdi-skull"
            ></v-file-input>
            <v-file-input
              v-model="animationFiles.Fall"
              accept="image/*"
              :label="isEditing ? `Fall Image (${oldSkinName ? 'Se conservará la imagen anterior si no se cambia' : ''})` : 'Fall Image'"
              :rules="isEditing ? [] : imageRules.concat([v => !!v || 'Fall image is required'])"
              class="medieval-input"
              filled
              dark
              prepend-icon="mdi-arrow-down"
            ></v-file-input>
            <v-file-input
              v-model="animationFiles.Idle"
              accept="image/*"
              :label="isEditing ? `Idle Image (${oldSkinName ? 'Se conservará la imagen anterior si no se cambia' : ''})` : 'Idle Image'"
              :rules="isEditing ? [] : imageRules.concat([v => !!v || 'Idle image is required'])"
              class="medieval-input"
              filled
              dark
              prepend-icon="mdi-sleep"
            ></v-file-input>
            <v-file-input
              v-model="animationFiles.Run"
              accept="image/*"
              :label="isEditing ? `Run Image (${oldSkinName ? 'Se conservará la imagen anterior si no se cambia' : ''})` : 'Run Image'"
              :rules="isEditing ? [] : imageRules.concat([v => !!v || 'Run image is required'])"
              class="medieval-input"
              filled
              dark
              prepend-icon="mdi-shoe-print"
            ></v-file-input>
            <v-file-input
              v-model="animationFiles.Jump"
              accept="image/*"
              :label="isEditing ? `Jump Image (${oldSkinName ? 'Se conservará la imagen anterior si no se cambia' : ''})` : 'Jump Image'"
              :rules="isEditing ? [] : imageRules.concat([v => !!v || 'Jump image is required'])"
              class="medieval-input"
              filled
              dark
              prepend-icon="mdi-arrow-up-bold"
            ></v-file-input>
            <v-file-input
              v-model="animationFiles.TakeHit"
              accept="image/*"
              :label="isEditing ? `Take Hit Image (${oldSkinName ? 'Se conservará la imagen anterior si no se cambia' : ''})` : 'Take Hit Image'"
              :rules="isEditing ? [] : imageRules.concat([v => !!v || 'Take Hit image is required'])"
              class="medieval-input"
              filled
              dark
              prepend-icon="mdi-emoticon-sad"
            ></v-file-input>
            <v-file-input
              v-model="coverFile"
              accept="image/*"
              :label="isEditing ? `Cover Image (Portada) (${oldSkinName ? 'Se conservará la imagen anterior si no se cambia' : ''})` : 'Cover Image (Portada)'"
              :rules="isEditing ? [] : imageRules.concat([v => !!v || 'Cover image is required'])"
              class="medieval-input"
              filled
              dark
              prepend-icon="mdi-image"
              @change="handleCoverChange"
            ></v-file-input>
            <v-img
              v-if="previewCover"
              :src="previewCover"
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
      isEditing: false,
      oldSkinName: null,
      animationFiles: {
        Attack: null,
        Dash: null,
        Death: null,
        Fall: null,
        Idle: null,
        Run: null,
        Jump: null,
        TakeHit: null
      },
      coverFile: null,
      previewCover: null,
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
      return this.editedIndex === -1 ? 'Craft New Skin' : 'Edit Skin'
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
        const rawSkins = await response.json()
        this.skins = rawSkins.map(skin => ({
          ...skin,
          imageUrl: `${import.meta.env.VITE_SHOP_API_URL}imagenes/shop/Portadas/${skin.skin_name.toLowerCase()}.jpg`
        }))


        this.showNotification('Skins summoned successfully', 'success', 'mdi-check-circle');
      } catch (error) {
        console.error('Error loading skins:', error)
        this.showNotification('Failed to summon skins', 'error', 'mdi-alert');
      }
      this.loading = false;
    },
    editSkin(item) {
      this.editedIndex = this.skins.indexOf(item)
      this.editedItem = {
        id: item.id_skin,
        name: item.skin_name,
        price: item.price,
        description: item.description,
        imageUrl: item.image_url
      }
      this.oldSkinName = item.skin_name
      this.previewCover = item.image_url
      this.dialog = true
      this.isEditing = true
    },
    openCreateDialog() {
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
      this.previewCover = null
      this.coverFile = null
      this.dialog = true
      this.isEditing = false
      this.oldSkinName = null
    },
    handleCoverChange(file) {
      if (!file) {
        this.previewCover = null
        return
      }
      const reader = new FileReader()
      reader.onload = e => {
        this.previewCover = e.target.result
      }
      reader.readAsDataURL(file)
    },
    async save() {
      if (!this.$refs.form.validate()) return
      
      try {
        // Verificar si estamos en modo edición o creación
        if (this.isEditing) {
          await this.updateSkin();
        } else {
          await this.createSkin();
        }
        
        this.close();
        this.loadSkins();
      } catch (error) {
        console.error('Error saving skin:', error)
        this.showNotification('Failed to save skin', 'error', 'mdi-alert');
      }
    },
    
    async createSkin() {
      // Validar que todas las imágenes estén presentes (solo para creación)
      const requiredKeys = ['Attack','Dash','Death','Fall','Idle','Run','Jump','TakeHit'];
      for (const key of requiredKeys) {
        if (!this.animationFiles[key]) {
          this.showNotification(`Missing image: ${key}`, 'error', 'mdi-alert');
          throw new Error(`Missing image: ${key}`);
        }
      }
      if (!this.coverFile) {
        this.showNotification('Missing cover image', 'error', 'mdi-alert');
        throw new Error('Missing cover image');
      }
      
      const formData = new FormData();
      formData.append('targetFolder', this.editedItem.name);
      
      // Ordenar las imágenes según los sufijos del backend
      requiredKeys.forEach(key => {
        formData.append('images', this.animationFiles[key]);
      });
      formData.append('images', this.coverFile); // La portada debe ir la última
      
      const response = await fetch(`${import.meta.env.VITE_SHOP_API_URL}shop/upload-images`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error('Error uploading images');
      this.showNotification('Skin images uploaded successfully', 'success', 'mdi-check-circle');
      
      // Ahora crear la skin en la base de datos
      const skinData = {
        skin_name: this.editedItem.name,
        price: this.editedItem.price,
        description: this.editedItem.description,
        image_url: `/imagenes/shop/Portadas/${this.editedItem.name}.jpg`,
        is_available: true
      };
      
      const dbResponse = await fetch(`${import.meta.env.VITE_SHOP_API_URL}shop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skinData)
      });
      
      if (!dbResponse.ok) throw new Error('Error creating skin in DB');
      this.showNotification('New skin crafted successfully', 'success', 'mdi-check-circle');
    },
    
    async updateSkin() {
      // Verificar qué imágenes se han cambiado
      const requiredKeys = ['Attack','Dash','Death','Fall','Idle','Run','Jump','TakeHit'];
      const hasChangedImages = Object.values(this.animationFiles).some(file => file !== null) || this.coverFile !== null;
      
      // Si hay cambios en las imágenes, subir las nuevas
      if (hasChangedImages) {
        const formData = new FormData();
        formData.append('targetFolder', this.editedItem.name);
        formData.append('oldSkinName', this.oldSkinName);
        
        // Añadir las imágenes que se han cambiado
        let filesCount = 0;
        requiredKeys.forEach(key => {
          if (this.animationFiles[key]) {
            formData.append('images', this.animationFiles[key]);
            filesCount++;
          }
        });
        
        // Añadir la portada si se ha cambiado
        if (this.coverFile) {
          formData.append('images', this.coverFile);
          filesCount++;
        }
        
        // Solo enviar la petición si hay archivos para actualizar
        if (filesCount > 0) {
          const response = await fetch(`${import.meta.env.VITE_SHOP_API_URL}shop/update-images/${this.editedItem.id}`, {
            method: 'POST',
            body: formData
          });
          
          if (!response.ok) throw new Error('Error updating images');
          
          const data = await response.json();
          if (data.newImageUrl) {
            this.editedItem.imageUrl = data.newImageUrl;
          }
          
          this.showNotification('Skin images updated successfully', 'success', 'mdi-check-circle');
        }
      }
      
      // Actualizar los datos en la base de datos
      const skinData = {
        skin_name: this.editedItem.name,
        price: this.editedItem.price,
        description: this.editedItem.description,
        image_url: this.editedItem.imageUrl
      };
      
      // Si el nombre ha cambiado, actualizar la URL de la imagen
      if (this.oldSkinName !== this.editedItem.name) {
        skinData.image_url = `/imagenes/shop/Portadas/${this.editedItem.name}.jpg`;
      }
      
      const dbResponse = await fetch(`${import.meta.env.VITE_SHOP_API_URL}shop/${this.editedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skinData)
      });
      
      if (!dbResponse.ok) throw new Error('Error updating skin in DB');
      this.showNotification('Skin updated successfully', 'success', 'mdi-check-circle');
    },
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        this.coverFile = null
        this.previewCover = null
        this.imageFile = null
        this.previewImage = null
        this.isEditing = false
        this.oldSkinName = null
        // Limpiar los archivos de animación
        Object.keys(this.animationFiles).forEach(key => {
          this.animationFiles[key] = null;
        });
      })
    },
    confirmDelete(item) {
      this.editedIndex = this.skins.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    async deleteItemConfirm() {
      try {
        const response = await fetch(`${import.meta.env.VITE_SHOP_API_URL}shop/${this.editedItem.id_skin}`, {
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