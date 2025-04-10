<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12 pa-4">
          <v-card-title class="text-center text-h5 mb-4">
            Registro
          </v-card-title>
          <v-form @submit.prevent="handleRegister" v-model="isValid">
            <v-text-field
              v-model="username"
              label="Nombre de usuario"
              required
              :rules="[rules.required]"
              prepend-icon="mdi-account"
            ></v-text-field>

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
              :rules="[rules.required, rules.password]"
              prepend-icon="mdi-lock"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword"
            ></v-text-field>

            <v-text-field
              v-model="confirmPassword"
              label="Confirmar contraseña"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              :rules="[rules.required, rules.passwordMatch]"
              prepend-icon="mdi-lock-check"
              :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showConfirmPassword = !showConfirmPassword"
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
                Registrarse
              </v-btn>
              <v-btn
                variant="text"
                class="mt-2"
                @click="$router.push('/login')"
              >
                ¿Ya tienes cuenta? Inicia sesión
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
  name: 'RegisterPage',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      loading: false,
      error: null,
      isValid: false,
      rules: {
        required: v => !!v || 'Este campo es requerido',
        email: v => /.+@.+\..+/.test(v) || 'El email debe ser válido',
        password: v => v.length >= 6 || 'La contraseña debe tener al menos 6 caracteres',
        passwordMatch: v => v === this.password || 'Las contraseñas no coinciden'
      }
    };
  },
  methods: {
    async handleRegister() {
      try {
        this.loading = true;
        this.error = null;

        const response = await fetch(`${import.meta.env.VITE_USER_API_URL}auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: this.username,
            email: this.email,
            password: this.password
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Error al registrarse');
        }

        // Guardar el token en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirigir al usuario
        this.$router.push('/');
      } catch (error) {
        this.error = error.message || 'Error al registrarse';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
