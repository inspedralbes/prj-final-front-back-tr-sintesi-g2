<template>
  <v-container fluid class="medieval-theme">
    <v-card class="parchment-card" elevation="8">
      <v-card-title class="card-title d-flex align-center">
        <div class="title-wrapper">
          <v-icon large class="mr-2 crown-icon">mdi-crown</v-icon>
          <span class="title-text">LEGENDARY BOSSES</span>
          <v-icon large class="ml-2 crown-icon">mdi-crown</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn color="accent" class="refresh-btn" @click="loadBosses">
          <span class="btn-text">REFRESH</span>
          <v-icon right>mdi-refresh</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider class="divider"></v-divider>

      <v-data-table
        :headers="headers"
        :items="bosses"
        :loading="loading"
        class="medieval-table"
        :loading-text="'Summoning ancient terrors...'"
        :no-data-text="'No legendary beasts have been discovered...yet'"
        :items-per-page="10"
        :footer-props="{
          'items-per-page-text': 'Legends per scroll',
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
        <template v-slot:item.bossMaxHealth="{ item }">
          <div class="stat-wrapper">
            <v-icon small color="#8B0000" class="mr-1">mdi-heart</v-icon>
            {{ item.bossMaxHealth }}
          </div>
        </template>
        
        <!-- Attack1 Damage Stat -->
        <template v-slot:item.attack1Damage="{ item }">
          <div class="stat-wrapper">
            <v-icon small color="#DAA520" class="mr-1">mdi-sword</v-icon>
            {{ item.attack1Damage }}
          </div>
        </template>
        
        <!-- Attack2 Damage Stat -->
        <template v-slot:item.attack2Damage="{ item }">
          <div class="stat-wrapper">
            <v-icon small color="#FF6347" class="mr-1">mdi-flare</v-icon>
            {{ item.attack2Damage }}
          </div>
        </template>
        
        <!-- Move Speed Stat -->
        <template v-slot:item.moveSpeed="{ item }">
          <div class="stat-wrapper">
            <v-icon small color="#1E90FF" class="mr-1">mdi-run-fast</v-icon>
            {{ item.moveSpeed }}
          </div>
        </template>
        
        <!-- Attack Range Stat -->
        <template v-slot:item.attackRange="{ item }">
          <div class="stat-wrapper">
            <v-icon small color="#FF6347" class="mr-1">mdi-target</v-icon>
            {{ item.attackRange }}
          </div>
        </template>
        
        <!-- Vision Range Stat -->
        <template v-slot:item.visionRange="{ item }">
          <div class="stat-wrapper">
            <v-icon small color="#9370DB" class="mr-1">mdi-eye</v-icon>
            {{ item.visionRange }}
          </div>
        </template>
        
        <!-- Attack Cooldown Stat -->
        <template v-slot:item.attackCooldown="{ item }">
          <div class="stat-wrapper">
            <v-icon small color="#CD853F" class="mr-1">mdi-timer-sand</v-icon>
            {{ item.attackCooldown }}s
          </div>
        </template>
        
        <!-- Disintegration Time Stat -->
        <template v-slot:item.disintegrationTime="{ item }">
          <div class="stat-wrapper">
            <v-icon small color="#FFD700" class="mr-1">mdi-skull</v-icon>
            {{ item.disintegrationTime }}s
          </div>
        </template>
        
        <!-- Actions Column -->
        <template v-slot:item.actions="{ item }">
          <v-btn color="accent" icon elevation="2" class="edit-btn" @click="editBoss(item)">
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
          Alter Legendary Beast's Powers: {{ editedBoss.name }}
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
                    <span>Immortal Vitality</span>
                  </div>
                  <v-text-field
                    v-model="editedBoss.bossMaxHealth"
                    type="number"
                    outlined
                    dense
                    class="medieval-input"
                  />
                </div>
                
                <div class="form-group">
                  <div class="stat-label">
                    <v-icon color="#DAA520">mdi-sword</v-icon>
                    <span>Primary Strike Might</span>
                  </div>
                  <v-text-field
                    v-model="editedBoss.attack1Damage"
                    type="number"
                    outlined
                    dense
                    class="medieval-input"
                  />
                </div>
                
                <div class="form-group">
                  <div class="stat-label">
                    <v-icon color="#FF6347">mdi-flare</v-icon>
                    <span>Arcane Power</span>
                  </div>
                  <v-text-field
                    v-model="editedBoss.attack2Damage"
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
                    v-model="editedBoss.moveSpeed"
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
                    <v-icon color="#FF6347">mdi-target</v-icon>
                    <span>Attack Reach</span>
                  </div>
                  <v-text-field
                    v-model="editedBoss.attackRange"
                    type="number"
                    outlined
                    dense
                    class="medieval-input"
                  />
                </div>
                
                <div class="form-group">
                  <div class="stat-label">
                    <v-icon color="#9370DB">mdi-eye</v-icon>
                    <span>Far Sight</span>
                  </div>
                  <v-text-field
                    v-model="editedBoss.visionRange"
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
                    v-model="editedBoss.attackCooldown"
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
                    <v-icon color="#FFD700">mdi-skull</v-icon>
                    <span>Disintegration Time</span>
                  </div>
                  <v-text-field
                    v-model="editedBoss.disintegrationTime"
                    type="number"
                    outlined
                    dense
                    class="medieval-input"
                    hint="Seconds until body fades"
                    persistent-hint
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
          <v-btn color="success" class="save-btn" @click="saveBoss">
            <span class="btn-text">Inscribe</span>
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
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
</template>

<script>
export default {
  name: 'BossManagement',
  data() {
    return {
      snackbar: {
        show: false,
        text: '',
        color: '',
        icon: ''
      },
      bosses: [],
      loading: false,
      headers: [
        { text: 'ID', value: 'id', align: 'center', width: '70px' },
        { text: 'LEGEND NAME', value: 'bossName', align: 'start' },
        { text: 'VITALITY', value: 'bossMaxHealth', align: 'center' },
        { text: 'PRIMARY MIGHT', value: 'attack1Damage', align: 'center' },
        { text: 'ARCANE POWER', value: 'attack2Damage', align: 'center' },
        { text: 'SWIFTNESS', value: 'moveSpeed', align: 'center' },
        { text: 'REACH', value: 'attackRange', align: 'center' },
        { text: 'FAR SIGHT', value: 'visionRange', align: 'center' },
        { text: 'ATTACK DELAY', value: 'attackCooldown', align: 'center' },
        { text: 'FADE TIME', value: 'disintegrationTime', align: 'center' },
        { text: 'ACTIONS', value: 'actions', align: 'center', sortable: false, width: '80px' }
      ],
      dialogEdit: false,
      editedBoss: {
        id: null,
        name: '',
        bossMaxHealth: 0,
        attack1Damage: 0,
        moveSpeed: 0,
        attack2Damage: 0,
        attackRange: 0,
        visionRange: 0,
        attackCooldown: 0,
        disintegrationTime: 0
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
        this.showNotification('Bosses loaded successfully', 'success', 'mdi-check-circle');
      } catch (error) {
        this.showNotification('Failed to load bosses', 'error', 'mdi-alert');
        console.error('Error loading bosses:', error);
      } finally {
        this.loading = false;
      }
    },
    showNotification(text, color, icon) {
      this.snackbar = {
        show: true,
        text,
        color,
        icon
      };
    },
    editBoss(item) {
      this.editedBoss = {
        id: item.id,
        name: item.bossName,
        bossMaxHealth: item.bossMaxHealth,
        attack1Damage: item.attack1Damage,
        moveSpeed: item.moveSpeed,
        attack2Damage: item.attack2Damage,
        attackRange: item.attackRange,
        visionRange: item.visionRange,
        attackCooldown: item.attackCooldown,
        disintegrationTime: item.disintegrationTime
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
            bossMaxHealth: Number(this.editedBoss.bossMaxHealth),
            attack1Damage: Number(this.editedBoss.attack1Damage),
            moveSpeed: Number(this.editedBoss.moveSpeed),
            attack2Damage: Number(this.editedBoss.attack2Damage),
            attackRange: Number(this.editedBoss.attackRange),
            visionRange: Number(this.editedBoss.visionRange),
            attackCooldown: Number(this.editedBoss.attackCooldown),
            disintegrationTime: Number(this.editedBoss.disintegrationTime)
          })
        })
        if (!response.ok) throw new Error('Error updating boss');
        await this.loadBosses();
        this.closeEdit();
        this.showNotification('Boss updated successfully', 'success', 'mdi-check-circle');
      } catch (error) {
        console.error('Error updating boss:', error)
        this.showNotification('Failed to update boss', 'error', 'mdi-alert');
      }
    },
    closeEdit() {
      this.dialogEdit = false
      this.editedBoss = {
        id: null,
        name: '',
        bossMaxHealth: 0,
        attack1Damage: 0,
        moveSpeed: 0,
        attack2Damage: 0,
        attackRange: 0,
        visionRange: 0,
        attackCooldown: 0,
        disintegrationTime: 0
      }
    }
  },
  mounted() {
    this.loadBosses()
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