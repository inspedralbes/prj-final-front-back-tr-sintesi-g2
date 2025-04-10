<template>
  <v-container>
    <v-card>
      <v-card-title class="d-flex align-center">
        Games List
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="loadGames">
          Refresh
          <v-icon right>mdi-refresh</v-icon>
        </v-btn>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="games"
        :loading="loading"
      >
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.raw.status)"
            :text="item.raw.status"
          ></v-chip>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'GameManagement',
  data() {
    return {
      games: [],
      loading: false,
      headers: [
        { title: 'ID', key: 'id' },
        { title: 'Player', key: 'playerId' },
        { title: 'Score', key: 'score' },
        { title: 'Time', key: 'time' },
        { title: 'Status', key: 'status' },
        { title: 'Created At', key: 'createdAt' }
      ]
    }
  },
  methods: {
    async loadGames() {
      this.loading = true
      try {
        const response = await fetch('http://localhost:3002/game')
        if (!response.ok) throw new Error('Error loading games')
        this.games = await response.json()
      } catch (error) {
        console.error('Error loading games:', error)
      }
      this.loading = false
    },
    getStatusColor(status) {
      switch (status) {
        case 'completed':
          return 'success'
        case 'in_progress':
          return 'info'
        case 'failed':
          return 'error'
        default:
          return 'grey'
      }
    }
  },
  mounted() {
    this.loadGames()
  }
}
</script>
