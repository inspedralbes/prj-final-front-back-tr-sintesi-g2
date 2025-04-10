<template>
  <v-container>
    <v-card>
      <v-card-title class="d-flex align-center">
        Enemies List
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="loadEnemies">
          Refresh
          <v-icon right>mdi-refresh</v-icon>
        </v-btn>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="enemies"
        :loading="loading"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn
            color="primary"
            icon
            @click="editEnemy(item.raw)"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Edit Dialog -->
    <v-dialog v-model="dialogEdit" max-width="500px">
      <v-card>
        <v-card-title>Edit Enemy Stats</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="editedEnemy.health"
              label="Health"
              type="number"
            ></v-text-field>
            <v-text-field
              v-model="editedEnemy.damage"
              label="Damage"
              type="number"
            ></v-text-field>
            <v-text-field
              v-model="editedEnemy.speed"
              label="Speed"
              type="number"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="closeEdit">Cancel</v-btn>
          <v-btn color="success" variant="text" @click="saveEnemy">Save</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'EnemyManagement',
  data() {
    return {
      enemies: [],
      loading: false,
      headers: [
        { title: 'ID', key: 'id' },
        { title: 'Name', key: 'name' },
        { title: 'Health', key: 'health' },
        { title: 'Damage', key: 'damage' },
        { title: 'Speed', key: 'speed' },
        { title: 'Actions', key: 'actions', sortable: false }
      ],
      dialogEdit: false,
      editedEnemy: {
        id: null,
        health: 0,
        damage: 0,
        speed: 0
      }
    }
  },
  methods: {
    async loadEnemies() {
      this.loading = true
      try {
        const response = await fetch('http://localhost:3007/enemy')
        if (!response.ok) throw new Error('Error loading enemies')
        this.enemies = await response.json()
      } catch (error) {
        console.error('Error loading enemies:', error)
      }
      this.loading = false
    },
    editEnemy(enemy) {
      this.editedEnemy = { ...enemy }
      this.dialogEdit = true
    },
    async saveEnemy() {
      try {
        const response = await fetch(`http://localhost:3007/enemy/${this.editedEnemy.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            health: Number(this.editedEnemy.health),
            damage: Number(this.editedEnemy.damage),
            speed: Number(this.editedEnemy.speed)
          })
        })
        if (!response.ok) throw new Error('Error updating enemy')
        this.loadEnemies()
        this.closeEdit()
      } catch (error) {
        console.error('Error updating enemy:', error)
      }
    },
    closeEdit() {
      this.dialogEdit = false
      this.editedEnemy = {
        id: null,
        health: 0,
        damage: 0,
        speed: 0
      }
    }
  },
  mounted() {
    this.loadEnemies()
  }
}
</script>
