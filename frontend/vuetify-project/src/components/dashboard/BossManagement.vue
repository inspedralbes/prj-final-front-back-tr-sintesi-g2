<template>
  <v-container>
    <v-card>
      <v-card-title class="d-flex align-center">
        Boss List
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="loadBosses">
          Refresh
          <v-icon right>mdi-refresh</v-icon>
        </v-btn>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="bosses"
        :loading="loading"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn
            color="primary"
            icon
            @click="editBoss(item)"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Edit Dialog -->
    <v-dialog v-model="dialogEdit" max-width="500px">
      <v-card>
        <v-card-title>Edit Boss Stats</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="editedBoss.health"
              label="Health"
              type="number"
            ></v-text-field>
            <v-text-field
              v-model="editedBoss.damage"
              label="Damage"
              type="number"
            ></v-text-field>
            <v-text-field
              v-model="editedBoss.speed"
              label="Speed"
              type="number"
            ></v-text-field>
            <v-text-field
              v-model="editedBoss.specialAttackDamage"
              label="Special Attack Damage"
              type="number"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="closeEdit">Cancel</v-btn>
          <v-btn color="success" variant="text" @click="saveBoss">Save</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'BossManagement',
  data() {
    return {
      bosses: [],
      loading: false,
      headers: [
        { title: 'ID', key: 'id_boss' },
        { title: 'Name', key: 'boss_name' },
        { title: 'Health', key: 'boss_max_health' },
        { title: 'Damage', key: 'attack1_damage' },
        { title: 'Speed', key: 'move_speed' },
        { title: 'Special Attack', key: 'attack2_damage' },
        { title: 'Actions', key: 'actions', sortable: false }
      ],
      dialogEdit: false,
      editedBoss: {
        id: null,
        health: 0,
        damage: 0,
        speed: 0,
        specialAttackDamage: 0
      }
    }
  },
  methods: {
    async loadBosses() {
      this.loading = true
      try {
        const response = await fetch(`${import.meta.env.VITE_BOSS_API_URL}bosses`)
        if (!response.ok) throw new Error('Error loading bosses')
        this.bosses = await response.json()
      } catch (error) {
        console.error('Error loading bosses:', error)
      }
      this.loading = false
    },
    editBoss(item) {
  this.editedBoss = {
    id: item.id_boss,
    health: item.boss_max_health,
    damage: item.attack1_damage,
    speed: item.move_speed,
    specialAttackDamage: item.attack2_damage
  }
  this.dialogEdit = true
},

async saveBoss() {
  try {
    const response = await fetch(`${import.meta.env.VITE_BOSS_API_URL}bosses/${this.editedBoss.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        boss_max_health: Number(this.editedBoss.health),
        attack1_damage: Number(this.editedBoss.damage),
        move_speed: Number(this.editedBoss.speed),
        attack2_damage: Number(this.editedBoss.specialAttackDamage)
      })
    })
    if (!response.ok) throw new Error('Error updating boss')
    await this.loadBosses()
    this.closeEdit()
  } catch (error) {
    console.error('Error updating boss:', error)
  }
},

    closeEdit() {
      this.dialogEdit = false
      this.editedBoss = {
        id: null,
        health: 0,
        damage: 0,
        speed: 0,
        specialAttackDamage: 0
      }
    }
  },
  mounted() {
    this.loadBosses()
  }
}
</script>
