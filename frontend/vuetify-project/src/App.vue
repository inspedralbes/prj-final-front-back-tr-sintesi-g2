<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
  window.addEventListener('beforeunload', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
});

</script>
