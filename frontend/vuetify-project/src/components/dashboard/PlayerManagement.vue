<template>
  <v-container>
    <v-card>
      <v-card-title class="d-flex align-center">
        Players List
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="loadPlayers">
          Refresh
          <v-icon right>mdi-refresh</v-icon>
        </v-btn>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="players"
        :loading="loading"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn
            color="error"
            icon
            @click="deletePlayer(item.raw.id)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Confirmation Dialog -->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title>Are you sure you want to delete this player?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="closeDelete">Cancel</v-btn>
          <v-btn color="error" variant="text" @click="deletePlayerConfirm">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'PlayerManagement',
  data() {
    return {
      players: [],
      loading: false,
      headers: [
        { title: 'ID', key: 'id' },
        { title: 'Username', key: 'username' },
        { title: 'Level', key: 'level' },
        { title: 'Experience', key: 'experience' },
        { title: 'Actions', key: 'actions', sortable: false }
      ],
      dialogDelete: false,
      playerIdToDelete: null
    }
  },
  methods: {
    async loadPlayers() {
      this.loading = true
      try {
        const response = await fetch('http://localhost:3001/player')
        if (!response.ok) throw new Error('Error loading players')
        this.players = await response.json()
      } catch (error) {
        console.error('Error loading players:', error)
      }
      this.loading = false
    },
    deletePlayer(id) {
      this.playerIdToDelete = id
      this.dialogDelete = true
    },
    async deletePlayerConfirm() {
      try {
        const response = await fetch(`http://localhost:3001/player/${this.playerIdToDelete}`, {
          method: 'DELETE'
        })
        if (!response.ok) throw new Error('Error deleting player')
        this.loadPlayers()
      } catch (error) {
        console.error('Error deleting player:', error)
      }
      this.closeDelete()
    },
    closeDelete() {
      this.dialogDelete = false
      this.playerIdToDelete = null
    }
  },
  mounted() {
    this.loadPlayers()
  }
}
</script>
