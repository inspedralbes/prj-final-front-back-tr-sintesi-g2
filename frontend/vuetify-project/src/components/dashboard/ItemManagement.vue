<template>
  <v-container>
    <v-card>
      <v-card-title class="d-flex align-center">
        Items List
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="loadItems">
          Refresh
          <v-icon right>mdi-refresh</v-icon>
        </v-btn>
      </v-card-title>

      <v-row class="pa-4">
        <v-col
          v-for="item in items"
          :key="item.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card>
            <v-img
              :src="item.imageUrl"
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

            <v-card-title>{{ item.name }}</v-card-title>

            <v-card-text>
              <v-row no-gutters align="center">
                <v-col>
                  <div class="text-subtitle-1">Type: {{ item.type }}</div>
                  <div class="text-subtitle-1">Effect: {{ item.effect }}</div>
                  <div v-if="item.damage" class="text-subtitle-1">Damage: {{ item.damage }}</div>
                  <div v-if="item.defense" class="text-subtitle-1">Defense: {{ item.defense }}</div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ItemManagement',
  data() {
    return {
      items: [],
      loading: false
    }
  },
  methods: {
    async loadItems() {
      this.loading = true
      try {
        const response = await axios.get(`${import.meta.env.VITE_INVENTORY_API_URL}item`)
        this.items = response.data
      } catch (error) {
        console.error('Error loading items:', error)
      }
      this.loading = false
    }
  },
  mounted() {
    this.loadItems()
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
