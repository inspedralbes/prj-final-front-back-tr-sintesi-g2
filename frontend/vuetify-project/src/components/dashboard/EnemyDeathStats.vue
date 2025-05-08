<template>
  <v-card class="parchment-card stats-card">
    <v-card-title class="card-title">
      <v-icon left color="#DAA520">mdi-skull-crossbones</v-icon>
      Estadísticas de Muertes de Enemigos
    </v-card-title>
    <v-divider class="divider"></v-divider>
    <v-card-text>
      <div class="stats-img-container" v-if="imgUrl">
        <img :src="imgUrl" alt="Estadísticas de muertes por enemigo" class="stats-img" />
      </div>
      <div v-else class="empty-stats">No hay estadísticas para mostrar.</div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'EnemyDeathStats',
  data() {
    return {
      imgUrl: null
    }
  },
  mounted() {
    // Ajusta la URL según tu backend
    this.imgUrl = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/api/enemy-death-stats/image`;
  }
}
</script>

<style scoped>
.stats-card {
  margin: 24px auto;
  max-width: 600px;
}
.stats-img-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}
.stats-img {
  max-width: 100%;
  border: 3px solid #704214;
  border-radius: 8px;
  background-color: #2c2421;
  box-shadow: 0 2px 8px rgba(0,0,0,0.4);
}
.empty-stats {
  color: #e6ccb3;
  text-align: center;
  font-family: 'Cinzel', serif;
  padding: 32px 0;
}
</style>
