<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-tabs v-model="activeTab" background-color="primary">
          <v-tab value="players">Players</v-tab>
          <v-tab value="enemies">Enemies</v-tab>
          <v-tab value="bosses">Bosses</v-tab>
          <v-tab value="games">Games</v-tab>
          <v-tab value="items">Items</v-tab>
          <v-tab value="shop">Shop</v-tab>
        </v-tabs>

        <v-window v-model="activeTab">
          <v-window-item value="players">
            <PlayerManagement />
          </v-window-item>
          <v-window-item value="enemies">
            <EnemyManagement />
          </v-window-item>
          <v-window-item value="bosses">
            <BossManagement />
          </v-window-item>
          <v-window-item value="games">
            <GameManagement />
          </v-window-item>
          <v-window-item value="items">
            <ItemManagement />
          </v-window-item>
          <v-window-item value="shop">
            <ShopManagement />
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PlayerManagement from './dashboard/PlayerManagement.vue'
import EnemyManagement from './dashboard/EnemyManagement.vue'
import BossManagement from './dashboard/BossManagement.vue'
import GameManagement from './dashboard/GameManagement.vue'
import ItemManagement from './dashboard/ItemManagement.vue'
import ShopManagement from './dashboard/ShopManagement.vue'

export default {
  name: 'Dashboard',
  components: {
    PlayerManagement,
    EnemyManagement,
    BossManagement,
    GameManagement,
    ItemManagement,
    ShopManagement
  },
  data() {
    return {
      activeTab: 'players'
    }
  }
}
</script>
