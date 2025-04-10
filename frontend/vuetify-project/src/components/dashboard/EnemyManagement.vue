<template>
  <v-container fluid class="medieval-theme">
    <v-card class="parchment-card" elevation="8">
      <v-card-title class="card-title d-flex align-center">
        <div class="title-wrapper">
          <v-icon large class="mr-2 skull-icon">mdi-skull</v-icon>
          <span class="title-text">ENEMY COMPENDIUM</span>
          <v-icon large class="ml-2 skull-icon">mdi-skull</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn color="accent" class="refresh-btn" @click="loadEnemies">
          <span class="btn-text">REFRESH</span>
          <v-icon right>mdi-refresh</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider class="divider"></v-divider>

      <v-data-table
        :headers="headers"
        :items="enemies"
        :loading="loading"
        class="medieval-table"
        :loading-text="'Summoning creatures from the abyss...'"
        :no-data-text="'No enemies lurk in the shadows...yet'"
        :items-per-page="10"
        :footer-props="{
          'items-per-page-text': 'Creatures per scroll',
          'items-per-page-options': [5, 10, 20],
        }"
      >
        <template v-slot:loading>
          <v-row justify="center" align="center" style="height: 400px;">
            <v-progress-circular
              indeterminate
              color="#8B0000"
              size="64"
              width="5"
            ></v-progress-circular>
          </v-row>
        </template>
        
        <!-- Health Stat -->
        <template v-slot:item.enemy_max_health="{ item }">
          <div class="stat-wrapper">
            <v-icon small color="#8B0000" class="mr-1">mdi-heart</v-icon>
            {{ item.enemy_max_health }}
          </div>
        </template>
        
        <!-- Attack Damage Stat -->
        <template v-slot:item.attack_damage="{ item }">
          <div class="stat-wrapper">
            <v-icon small color="#DAA520" class="mr-1">mdi-sword</v-icon>
            {{ item.attack_damage }}
          </div>
        </template>
        
        <!-- Secondary Attack Damage Stat -->
        <template v-slot:item.second_attack_damage="{ item }">
          <div class="stat-wrapper">
            <v-icon small color="#DAA520" class="mr-1">mdi-sword-cross</v-icon>
            {{ item.second_attack_damage }}
          </div>
        </template>
        
        <!-- Hit Damage Stat -->
        <template v-slot:item.hit_damage="{ item }">
          <div class="stat-wrapper">
            <v-icon small color="#FF4500" class="mr-1">mdi-flash</v-icon>
            {{ item.hit_damage }}
          </div>
        </template>
        
        <!-- Move Speed Stat -->
        <template v-slot:item.move_speed="{ item }">
          <div class="stat-wrapper">
            <v-icon small color="#1E90FF" class="mr-1">mdi-run-fast</v-icon>
            {{ item.move_speed }}
          </div>
        </template>
        
        <!-- Follow Range Stat -->
        <template v-slot:item.follow_range="{ item }">
          <div class="stat-wrapper">
            <v-icon small color="#9370DB" class="mr-1">mdi-radar</v-icon>
            {{ item.follow_range }}
          </div>
        </template>
        
        <!-- Attack Range Stat -->
        <template v-slot:item.attack_range="{ item }">
          <div class="stat-wrapper">
            <v-icon small color="#FF6347" class="mr-1">mdi-target</v-icon>
            {{ item.attack_range }}
          </div>
        </template>
        
        <!-- Block Chance Stat -->
        <template v-slot:item.block_chance="{ item }">
          <div class="stat-wrapper">
            <v-icon small color="#A0522D" class="mr-1">mdi-shield</v-icon>
            {{ item.block_chance ? `${(item.block_chance * 100).toFixed(0)}%` : '0%' }}
          </div>
        </template>
        
        <!-- Reduced Damage Stat -->
        <template v-slot:item.reduced_damage="{ item }">
          <div class="stat-wrapper">
            <v-icon small color="#778899" class="mr-1">mdi-shield-half-full</v-icon>
            {{ item.reduced_damage || 0 }}
          </div>
        </template>
        
        <!-- Attack Cooldown Stat -->
        <template v-slot:item.attack_cooldown="{ item }">
          <div class="stat-wrapper">
            <v-icon small color="#CD853F" class="mr-1">mdi-timer-sand</v-icon>
            {{ item.attack_cooldown }}s
          </div>
        </template>
        
        <!-- Coin Reward Stat -->
        <template v-slot:item.coin_reward="{ item }">
          <div class="stat-wrapper">
            <v-icon small color="#FFD700" class="mr-1">mdi-coin</v-icon>
            {{ item.coin_reward }}
          </div>
        </template>
        
        <!-- Actions Column -->
        <template v-slot:item.actions="{ item }">
          <v-btn color="accent" icon elevation="2" class="edit-btn" @click="editEnemy(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Edit Dialog -->
    <v-dialog v-model="dialogEdit" max-width="700px" content-class="medieval-dialog">
      <v-card class="parchment-card dialog-card">
        <v-card-title class="dialog-title">
          <v-icon large class="mr-2">mdi-pencil-lock</v-icon>
          Modify Creature's Dark Powers: {{ editedEnemy.enemy_name }}
        </v-card-title>
        <v-divider class="divider"></v-divider>
        <v-card-text class="dialog-content">
          <v-form ref="form">
            <v-row>
              <!-- First Column -->
              <v-col cols="12" md="6">
                <div class="form-group">
                  <div class="stat-label">
                    <v-icon color="#8B0000">mdi-heart</v-icon>
                    <span>Life Essence</span>
                  </div>
                  <v-text-field
                    v-model="editedEnemy.enemy_max_health"
                    type="number"
                    outlined
                    dense
                    class="medieval-input"
                  />
                </div>
                
                <div class="form-group">
                  <div class="stat-label">
                    <v-icon color="#DAA520">mdi-sword</v-icon>
                    <span>Primary Attack Might</span>
                  </div>
                  <v-text-field
                    v-model="editedEnemy.attack_damage"
                    type="number"
                    outlined
                    dense
                    class="medieval-input"
                  />
                </div>
                
                <div class="form-group">
                  <div class="stat-label">
                    <v-icon color="#DAA520">mdi-sword-cross</v-icon>
                    <span>Secondary Attack Might</span>
                  </div>
                  <v-text-field
                    v-model="editedEnemy.second_attack_damage"
                    type="number"
                    outlined
                    dense
                    class="medieval-input"
                  />
                </div>
                
                <div class="form-group">
                  <div class="stat-label">
                    <v-icon color="#FF4500">mdi-flash</v-icon>
                    <span>Strike Potency</span>
                  </div>
                  <v-text-field
                    v-model="editedEnemy.hit_damage"
                    type="number"
                    outlined
                    dense
                    class="medieval-input"
                  />
                </div>
                
                <div class="form-group">
                  <div class="stat-label">
                    <v-icon color="#1E90FF">mdi-run-fast</v-icon>
                    <span>Swift Movement</span>
                  </div>
                  <v-text-field
                    v-model="editedEnemy.move_speed"
                    type="number"
                    outlined
                    dense
                    class="medieval-input"
                  />
                </div>
              </v-col>
              
              <!-- Second Column -->
              <v-col cols="12" md="6">
                <div class="form-group">
                  <div class="stat-label">
                    <v-icon color="#9370DB">mdi-radar</v-icon>
                    <span>Pursuit Distance</span>
                  </div>
                  <v-text-field
                    v-model="editedEnemy.follow_range"
                    type="number"
                    outlined
                    dense
                    class="medieval-input"
                  />
                </div>
                
                <div class="form-group">
                  <div class="stat-label">
                    <v-icon color="#FF6347">mdi-target</v-icon>
                    <span>Attack Reach</span>
                  </div>
                  <v-text-field
                    v-model="editedEnemy.attack_range"
                    type="number"
                    outlined
                    dense
                    class="medieval-input"
                  />
                </div>
                
                <div class="form-group">
                  <div class="stat-label">
                    <v-icon color="#A0522D">mdi-shield</v-icon>
                    <span>Ward Chance</span>
                  </div>
                  <v-text-field
                    v-model="editedEnemy.block_chance"
                    type="number"
                    outlined
                    dense
                    class="medieval-input"
                    hint="Decimal value (0.3 = 30%)"
                    persistent-hint
                  />
                </div>
                
                <div class="form-group">
                  <div class="stat-label">
                    <v-icon color="#778899">mdi-shield-half-full</v-icon>
                    <span>Damage Nullification</span>
                  </div>
                  <v-text-field
                    v-model="editedEnemy.reduced_damage"
                    type="number"
                    outlined
                    dense
                    class="medieval-input"
                  />
                </div>
                
                <div class="form-group">
                  <div class="stat-label">
                    <v-icon color="#CD853F">mdi-timer-sand</v-icon>
                    <span>Attack Respite</span>
                  </div>
                  <v-text-field
                    v-model="editedEnemy.attack_cooldown"
                    type="number"
                    outlined
                    dense
                    class="medieval-input"
                    hint="Seconds between attacks"
                    persistent-hint
                  />
                </div>
                
                <div class="form-group">
                  <div class="stat-label">
                    <v-icon color="#FFD700">mdi-coin</v-icon>
                    <span>Gold Bounty</span>
                  </div>
                  <v-text-field
                    v-model="editedEnemy.coin_reward"
                    type="number"
                    outlined
                    dense
                    class="medieval-input"
                  />
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider class="divider"></v-divider>
        <v-card-actions class="dialog-actions">
          <v-spacer />
          <v-btn color="error" class="cancel-btn" @click="closeEdit">
            <span class="btn-text">Abandon</span>
          </v-btn>
          <v-btn color="success" class="save-btn" @click="saveEnemy">
            <span class="btn-text">Inscribe</span>
          </v-btn>
          <v-spacer />
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
        { text: 'ID', value: 'id_enemy', align: 'center', width: '70px' },
        { text: 'CREATURE NAME', value: 'enemy_name', align: 'start' },
        { text: 'VITALITY', value: 'enemy_max_health', align: 'center' },
        { text: 'PRIMARY MIGHT', value: 'attack_damage', align: 'center' },
        { text: 'SECONDARY MIGHT', value: 'second_attack_damage', align: 'center' },
        { text: 'STRIKE POWER', value: 'hit_damage', align: 'center' },
        { text: 'SWIFTNESS', value: 'move_speed', align: 'center' },
        { text: 'PURSUIT', value: 'follow_range', align: 'center' },
        { text: 'REACH', value: 'attack_range', align: 'center' },
        { text: 'WARD CHANCE', value: 'block_chance', align: 'center' },
        { text: 'ARMOR', value: 'reduced_damage', align: 'center' },
        { text: 'ATTACK DELAY', value: 'attack_cooldown', align: 'center' },
        { text: 'BOUNTY', value: 'coin_reward', align: 'center' },
        { text: 'ACTIONS', value: 'actions', align: 'center', sortable: false, width: '80px' }
      ],
      dialogEdit: false,
      editedEnemy: {
        id_enemy: null,
        enemy_name: '',
        enemy_max_health: 0,
        attack_damage: 0,
        second_attack_damage: 0,
        hit_damage: 0,
        move_speed: 0,
        follow_range: 0,
        attack_range: 0,
        block_chance: 0,
        reduced_damage: 0,
        attack_cooldown: 0,
        coin_reward: 0
      }
    }
  },
  methods: {
    async loadEnemies() {
      this.loading = true
      try {
        const response = await fetch(`${import.meta.env.VITE_ENEMY_API_URL}enemies`)
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
        const response = await fetch(`${import.meta.env.VITE_ENEMY_API_URL}enemies/${this.editedEnemy.id_enemy}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            enemy_max_health: Number(this.editedEnemy.enemy_max_health),
            attack_damage: Number(this.editedEnemy.attack_damage),
            second_attack_damage: Number(this.editedEnemy.second_attack_damage),
            hit_damage: Number(this.editedEnemy.hit_damage),
            move_speed: Number(this.editedEnemy.move_speed),
            follow_range: Number(this.editedEnemy.follow_range),
            attack_range: Number(this.editedEnemy.attack_range),
            block_chance: Number(this.editedEnemy.block_chance),
            reduced_damage: Number(this.editedEnemy.reduced_damage),
            attack_cooldown: Number(this.editedEnemy.attack_cooldown),
            coin_reward: Number(this.editedEnemy.coin_reward)
          })
        })
        if (!response.ok) throw new Error('Error updating enemy')
        await this.loadEnemies()
        this.closeEdit()
      } catch (error) {
        console.error('Error updating enemy:', error)
      }
    },
    closeEdit() {
      this.dialogEdit = false
      this.editedEnemy = {
        id_enemy: null,
        enemy_name: '',
        enemy_max_health: 0,
        attack_damage: 0,
        second_attack_damage: 0,
        hit_damage: 0,
        move_speed: 0,
        follow_range: 0,
        attack_range: 0,
        block_chance: 0,
        reduced_damage: 0,
        attack_cooldown: 0,
        coin_reward: 0
      }
    }
  },
  mounted() {
    this.loadEnemies()
  }
}
</script>

<style scoped>
.medieval-theme {
  background-color: #1a1a1a;
  background-image: url('https://www.transparenttextures.com/patterns/dark-wood.png');
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

.skull-icon {
  color: #8B0000;
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

.medieval-table {
  background: transparent !important;
}

.medieval-table :deep(th) {
  background-color: #353029 !important;
  color: #e6ccb3 !important;
  font-family: 'Cinzel', serif !important;
  font-weight: bold !important;
  letter-spacing: 1px;
  text-align: center !important;
  border-bottom: 2px solid #704214 !important;
  padding: 12px 8px !important;
  font-size: 0.85rem !important;
}

.medieval-table :deep(td) {
  background-color: rgba(40, 30, 20, 0.6) !important;
  color: #e6ccb3 !important;
  font-family: 'Philosopher', sans-serif !important;
  border-bottom: 1px solid #704214 !important;
  text-align: center !important;
  padding: 8px !important;
}

.medieval-table :deep(tr:hover) {
  background-color: rgba(70, 40, 20, 0.4) !important;
}

.medieval-table :deep(.v-data-table__wrapper) {
  border: 2px solid #704214 !important;
  border-radius: 0 0 5px 5px;
  overflow-x: auto;
}

.medieval-table :deep(.v-data-footer) {
  background-color: #353029 !important;
  color: #e6ccb3 !important;
  border-top: 2px solid #704214 !important;
}

.medieval-table :deep(.v-data-footer__select) {
  color: #e6ccb3 !important;
}

.stat-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-btn {
  background-color: #704214 !important;
  border: 1px solid #a67c52 !important;
}

.medieval-dialog {
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
}

.dialog-card {
  background-color: #2c2421 !important;
  border: 3px solid #704214 !important;
}

.dialog-title {
  background-color: #451804;
  color: #e6ccb3 !important;
  font-family: 'Cinzel', serif !important;
  letter-spacing: 1px;
  font-weight: bold;
  padding: 16px !important;
}

.dialog-content {
  padding: 24px !important;
  background-color: #2c2421;
  background-image: url('https://www.transparenttextures.com/patterns/parchment.png');
}

.dialog-actions {
  background-color: #353029;
  padding: 16px !important;
}

.form-group {
  margin-bottom: 20px;
}

.stat-label {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: #e6ccb3;
  font-family: 'Cinzel', serif;
  font-weight: bold;
}

.stat-label span {
  margin-left: 8px;
}

.medieval-input :deep(.v-input__slot) {
  background-color: rgba(40, 30, 20, 0.6) !important;
  border: 1px solid #704214 !important;
}

.medieval-input :deep(input) {
  color: #e6ccb3 !important;
  font-family: 'Philosopher', sans-serif !important;
}

.medieval-input :deep(.v-messages__message) {
  color: #a67c52 !important;
  font-family: 'Philosopher', sans-serif !important;
  font-style: italic;
}

.btn-text {
  font-family: 'Cinzel', serif;
  font-weight: bold;
  letter-spacing: 1px;
}

.save-btn {
  background-color: #355e3b !important;
  border: 1px solid #704214 !important;
  color: #e6ccb3 !important;
}

.cancel-btn {
  background-color: #8B0000 !important;
  border: 1px solid #704214 !important;
  color: #e6ccb3 !important;
}

/* Para cargar las fuentes necesarias */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Philosopher:wght@400;700&display=swap');
</style>