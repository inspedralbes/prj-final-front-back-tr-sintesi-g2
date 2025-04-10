<template>
  <v-container>
    <v-card>
      <v-card-title class="d-flex align-center">
        Shop Skins
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openCreateDialog">
          Add New Skin
          <v-icon right>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>

      <v-row class="pa-4">
        <v-col
          v-for="skin in skins"
          :key="skin.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card>
            <v-img
              :src="skin.imageUrl"
              height="200"
              cover
              class="bg-grey-lighten-2"
            >
              <template v-slot:placeholder>
                <v-row
                  class="fill-height ma-0"
                  align="center"
                  justify="center"
                >
                  <v-progress-circular
                    indeterminate
                    color="grey-lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>

            <v-card-title>{{ skin.name }}</v-card-title>

            <v-card-text>
              <div class="text-h6 mb-2">Price: {{ skin.price }} coins</div>
              <div class="text-body-1">{{ skin.description }}</div>
            </v-card-text>

            <v-card-actions>
              <v-btn
                color="primary"
                variant="text"
                @click="editSkin(skin)"
              >
                Edit
              </v-btn>
              <v-btn
                color="error"
                variant="text"
                @click="confirmDelete(skin)"
              >
                Delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          {{ formTitle }}
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="editedItem.name"
              label="Skin Name"
              :rules="[v => !!v || 'Name is required']"
              required
            ></v-text-field>

            <v-text-field
              v-model="editedItem.price"
              label="Price"
              type="number"
              :rules="[v => !!v || 'Price is required']"
              required
            ></v-text-field>

            <v-textarea
              v-model="editedItem.description"
              label="Description"
              :rules="[v => !!v || 'Description is required']"
              required
            ></v-textarea>

            <v-file-input
              v-model="imageFile"
              accept="image/*"
              label="Skin Image"
              :rules="imageRules"
              @change="handleImageChange"
            ></v-file-input>

            <v-img
              v-if="previewImage"
              :src="previewImage"
              max-height="200"
              contain
            ></v-img>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="text"
            @click="close"
          >
            Cancel
          </v-btn>
          <v-btn
            color="success"
            variant="text"
            @click="save"
            :disabled="!valid"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation -->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title>Are you sure you want to delete this skin?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="closeDelete">Cancel</v-btn>
          <v-btn color="error" variant="text" @click="deleteItemConfirm">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'ShopManagement',
  data() {
    return {
      skins: [],
      dialog: false,
      dialogDelete: false,
      valid: false,
      editedIndex: -1,
      imageFile: null,
      previewImage: null,
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
      return this.editedIndex === -1 ? 'New Skin' : 'Edit Skin'
    }
  },
  methods: {
    async loadSkins() {
      try {
        const response = await fetch('http://localhost:3009/shop')
        if (!response.ok) throw new Error('Error loading skins')
        this.skins = await response.json()
      } catch (error) {
        console.error('Error loading skins:', error)
      }
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
          response = await fetch(`http://localhost:3009/shop/${this.editedItem.id}`, {
            method: 'PUT',
            body: formData
          })
        } else {
          // Create
          response = await fetch('http://localhost:3009/shop', {
            method: 'POST',
            body: formData
          })
        }
        
        if (!response.ok) throw new Error('Error saving skin')
        this.close()
        this.loadSkins()
      } catch (error) {
        console.error('Error saving skin:', error)
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
        const response = await fetch(`http://localhost:3009/shop/${this.editedItem.id}`, {
          method: 'DELETE'
        })
        if (!response.ok) throw new Error('Error deleting skin')
        this.loadSkins()
      } catch (error) {
        console.error('Error deleting skin:', error)
      }
      this.closeDelete()
    },
    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    }
  },
  mounted() {
    this.loadSkins()
  }
}
</script>

<style scoped>
.v-card {
  transition: transform 0.2s;
}
.v-card:hover {
  transform: scale(1.02);
}
</style>
