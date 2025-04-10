<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12 pa-4">
          <v-card-title class="text-center text-h5 mb-4">
            Iniciar sesión
          </v-card-title>
          <v-form @submit.prevent="handleLogin" v-model="isValid">
            <v-text-field
              v-model="email"
              label="Email"
              type="email"
              required
              :rules="[rules.required, rules.email]"
              prepend-icon="mdi-email"
            ></v-text-field>

            <v-text-field
              v-model="password"
              label="Contraseña"
              :type="showPassword ? 'text' : 'password'"
              required
              :rules="[rules.required]"
              prepend-icon="mdi-lock"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword"
            ></v-text-field>

            <v-alert
              v-if="error"
              type="error"
              class="mb-4"
              density="compact"
            >
              {{ error }}
            </v-alert>

            <v-card-actions class="d-flex flex-column">
              <v-btn
                color="primary"
                type="submit"
                block
                :loading="loading"
                :disabled="!isValid || loading"
              >
                Iniciar sesión
              </v-btn>
              <v-btn
                variant="text"
                class="mt-2"
                @click="$router.push('/register')"
              >
                ¿No tienes cuenta? Regístrate
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
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
      rules: {
        required: v => !!v || 'Este campo es requerido',
        email: v => /.+@.+\..+/.test(v) || 'El email debe ser válido'
      }
    };
  },
  methods: {
    async handleLogin() {
      try {
        this.loading = true;
        this.error = null;
        
        const response = await fetch('http://localhost:3004/auth/login', {
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
          throw new Error(data.message || 'Error al iniciar sesión');
        }

        // Guardar el token en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirigir al usuario
        this.$router.push('/');
      } catch (error) {
        this.error = error.message || 'Error al iniciar sesión';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
