<template>
  <v-container fluid class="medieval-theme fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="parchment-card elevation-12 pa-4">
          <v-card-title class="card-title text-center mb-4 d-flex align-center justify-center">
            <div class="title-wrapper">
              <v-icon large class="mr-2 crown-icon">mdi-shield-key</v-icon>
              <span class="title-text">LOG IN (Only admin)</span>
              <v-icon large class="ml-2 crown-icon">mdi-shield-key</v-icon>
            </div>
          </v-card-title>
          
          <v-divider class="divider"></v-divider>
          
          <v-card-text>
            <v-form @submit.prevent="handleLogin" v-model="isValid" class="mt-4">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                required
                :rules="[rules.required, rules.email]"
                prepend-icon="mdi-email"
                class="medieval-input"
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                required
                :rules="[rules.required]"
                prepend-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                class="medieval-input"
              ></v-text-field>

              <v-alert
                v-if="error"
                type="error"
                class="mb-4 medieval-alert"
                density="compact"
              >
                <v-icon left color="#e6ccb3">mdi-alert-circle</v-icon>
                {{ error }}
              </v-alert>

              <div class="d-flex flex-column mt-6">
                <v-btn
                  color="accent"
                  type="submit"
                  block
                  :loading="loading"
                  :disabled="!isValid || loading"
                  class="refresh-btn mb-4"
                  elevation="2"
                >
                  <span class="btn-text">LOG IN</span>
                </v-btn>
                <div class="text-center">
                  <v-btn
                    variant="text"
                    class="register-link"
                    @click="$router.push('/register')"
                  >
                    <span class="register-text">Don't have an account? Register</span>
                  </v-btn>
                </div>
                <div class="text-center mt-2">
                <v-btn
                  variant="text"
                  class="register-link"
                  @click="$router.push('/gameview')"
                >
                  <span class="register-text">Go back to the game</span>
                </v-btn>
              </div>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
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
  </v-container>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      loading: false,
      error: null,
      isValid: false,
      snackbar: {
        show: false,
        text: '',
        color: '',
        icon: ''
      },
      rules: {
        required: v => !!v || 'This field is required',
        email: v => /.+@.+\..+/.test(v) || 'email must be valid'
      }
    };
  },
  methods: {
    async handleLogin() {
  try {
    this.loading = true;
    this.error = null;

    const response = await fetch(`${import.meta.env.VITE_USER_API_URL}auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: this.email,
        password: this.password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error to login');
    }

    // Guardar el token y el usuario en localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Verificar el rol y redirigir según el rol
    if (data.user.role === 'admin') {
      this.showNotification('Welcome to the admin dashboard', 'success', 'mdi-check-circle');
      setTimeout(() => {
        this.$router.push('/dashboard'); // Redirige al dashboard si es admin
      }, 1000);
    } else if (data.user.role === 'user') {
      this.showNotification('Welcome to the game', 'success', 'mdi-check-circle');
      setTimeout(() => {
        this.$router.push('/gameview'); // Redirige al gameview si es un user
      }, 1000);
    }

  } catch (error) {
    this.error = error.message || 'Error to login';
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
    }
  }
};
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
  color: #e6ccb3;
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
  height: 44px !important;
}

.register-link {
  color: #DAA520 !important;
  font-family: 'Philosopher', sans-serif !important;
  text-decoration: underline;
  text-decoration-color: #704214;
}

.register-text {
  font-size: 0.95rem;
}

.medieval-input :deep(.v-input__slot) {
  background-color: rgba(40, 30, 20, 0.6) !important;
  border: 1px solid #704214 !important;
}

.medieval-input :deep(input) {
  color: #e6ccb3 !important;
  font-family: 'Philosopher', sans-serif !important;
}

.medieval-input :deep(.v-label) {
  color: #a67c52 !important;
  font-family: 'Philosopher', sans-serif !important;
}

.medieval-input :deep(.v-icon) {
  color: #a67c52 !important;
}

.medieval-alert {
  background-color: rgba(139, 0, 0, 0.7) !important;
  border: 1px solid #8B0000 !important;
  color: #e6ccb3 !important;
  font-family: 'Philosopher', sans-serif !important;
}

.medieval-snackbar {
  font-family: 'Philosopher', sans-serif !important;
}

.snackbar-content {
  display: flex;
  align-items: center;
}

.btn-text {
  font-family: 'Cinzel', serif;
  font-weight: bold;
  letter-spacing: 1px;
}

/* Para cargar las fuentes necesarias */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Philosopher:wght@400;700&display=swap');
</style>