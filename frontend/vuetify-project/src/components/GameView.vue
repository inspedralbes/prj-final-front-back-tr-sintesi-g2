<template>
  <div class="game-container medieval-theme">
    <!-- Cabecera -->
    <header class="game-header">
      <div class="title-wrapper">
        <v-icon large class="mr-2 crown-icon">mdi-shield-plus</v-icon>
        <h1 class="game-title">The Last Knight Of Averon</h1>
        <v-icon large class="ml-2 crown-icon">mdi-shield-plus</v-icon>
      </div>
    </header>
    
    <!-- Contenido principal: solo los botones -->
    <main class="main-content main-buttons-only">
      <div class="action-buttons parchment-card">
        <v-btn
          class="login-btn mr-4"
          @click="goToLogin"
          elevation="2"
          large
        >
          <v-icon left>mdi-login</v-icon>
          <span class="btn-text">GO TO LOGIN</span>
        </v-btn>
        <v-btn
          class="download-btn"
          @click="downloadJuegoZip"
          elevation="2"
          large
        >
          <v-icon left>mdi-download</v-icon>
          <span class="btn-text">Download JuegoCo</span>
        </v-btn>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'LoginDownloadOnly',
  methods: {
    goToLogin() {
      this.$router.push('/login');
    },
    async downloadJuegoZip() {
    try {
      const response = await fetch('https://thelastknightofaveron.cat/download-juego');

      if (!response.ok) throw new Error('Error downloading file');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'juegoCo.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading file:', err);
    }
  }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Philosopher:wght@400;700&display=swap');

.game-container {
  width: 100%;
  margin: 0 auto;
  color: #e6ccb3;
  font-family: 'Philosopher', sans-serif;
  position: relative;
}

.medieval-theme {
  background-color: #1a1a1a;
  padding: 20px;
  min-height: 100vh;
}

.game-header {
  background-color: #451804;
  padding: 20px;
  margin-bottom: 30px;
  border: 3px solid #704214;
  border-radius: 8px;
}

.title-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.game-title {
  margin: 0;
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  color: #e6ccb3;
  font-family: 'Cinzel', serif;
  letter-spacing: 2px;
}

.crown-icon {
  color: #DAA520;
}

/* Botones en el centro */
.main-buttons-only {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
}

.action-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  background-color: #2c2421 !important;
  background-image: url('https://www.transparenttextures.com/patterns/parchment.png');
  border: 3px solid #704214 !important;
  border-radius: 8px !important;
  padding: 40px 30px;
}

.login-btn {
  background-color: #6b4226 !important;
  border: 2px solid #704214 !important;
  color: #e6ccb3 !important;
  font-family: 'Cinzel', serif !important;
  letter-spacing: 1px;
  font-weight: bold;
  height: 55px !important;
  min-width: 180px;
  transition: all 0.3s ease;
}

.login-btn:hover {
  background-color: #8b5a3c !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.download-btn {
  background-color: #8B0000 !important;
  border: 2px solid #704214 !important;
  color: #e6ccb3 !important;
  font-family: 'Cinzel', serif !important;
  letter-spacing: 1px;
  font-weight: bold;
  height: 55px !important;
  min-width: 180px;
  transition: all 0.3s ease;
}

.download-btn:hover {
  background-color: #a50000 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.btn-text {
  font-family: 'Cinzel', serif;
  font-weight: bold;
  letter-spacing: 1px;
}

/* Responsive */
@media (max-width: 768px) {
  .game-title { font-size: 1.8rem; }
  .action-buttons { flex-direction: column; gap: 18px; }
  .main-buttons-only { height: 48vh; }
}

@media (max-width: 480px) {
  .game-title { font-size: 1.2rem; }
  .crown-icon { display: none; }
  .action-buttons { padding: 20px 8px; }
  .main-buttons-only { height: 30vh; }
}
</style>