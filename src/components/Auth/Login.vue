<template>
  <div class="login_view mt-16">
    <v-row>
      <v-col class="col-md-5">
        <!-- Logo project -->
        <v-img
          class="logo_project mt-8"
          lazy-src="@/assets/nou.png"
          width="450"
          src="@/assets/nou.png"
        ></v-img>
        <!-- To register -->
        <router-link to="/register" class="to_register_text font-weight-thin">
          <a class="white--text">
            Pas encore inscrit ? Créé toi un compte !
          </a>
        </router-link>
      </v-col>

      <!-- Login Form -->
      <v-col class="col-md-5 offset-2 pl-10 pr-10">
        <v-img
          lazy-src="@/assets/user.png"
          width="50"
          src="@/assets/user.png"
          class="user_logo mt-15"
        ></v-img>
        <p class="text-h2 white--text font-weight-thin hello_text mt-10"> HELLO !</p>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <!-- EMAIL -->
          <v-list id="email_field">
            <v-list-item>
              <v-img
                lazy-src="@/assets/icons/id-card.png"
                width="40"
                src="@/assets/icons/id-card.png"
              ></v-img>
              <v-list-item-title class="ml-10">
                <v-text-field
                  v-model="username"
                  label="Username"
                  required
                  color="orange"
                  clearable
                  clear-icon="mdi-close-circle"
                ></v-text-field>
              </v-list-item-title>
            </v-list-item>
          </v-list>
          <!-- PASSWORD -->
          <v-list id="password_field">
            <v-list-item>
              <v-img
                lazy-src="@/assets/icons/padlock.png"
                width="40"
                src="@/assets/icons/padlock.png"
              ></v-img>
              <v-list-item-title  class="ml-10">
                <v-text-field
                  v-model="password"
                  type="password"
                  label="Mot de passe"
                  required
                  color="orange"
                  clearable
                  clear-icon="mdi-close-circle"
                ></v-text-field>
              </v-list-item-title>
            </v-list-item>
          </v-list>
          <!-- Forgot password -->
          <p class="text-right font-weight-thin grey--text">Mot de passe oublié ?</p>

          <v-btn
            class="valid_form_login pl-10 pr-10 mt-15"
            :disabled="!valid"
            @click="validate"
            :loading="loading"
          >
            Se connecter
          </v-btn>
        </v-form>
      </v-col>
    </v-row>

    <Snackbar></Snackbar>
  </div>
</template>

<script>
import Snackbar from '@/components/Snackbar/Snackbar.vue';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

export default {
  name: 'Login',
  components: {
    Snackbar,
  },
  data() {
    return {
      snackbar: true,
      valid: true,
      password: undefined,
      username: undefined,
      loading: false,
    };
  },
  methods: {
    // Valid the register form
    validate() {
      this.loading = true;
      if (this.$refs.form.validate()) {
        const data = {
          username: this.username,
          password: this.password,
        };
        axios.post('http://localhost:8000/sign-in', data)
          .then((response) => {
            // Decode token
            const decodedToken = jwt_decode(response.data.token);
            // Stock in local storage username and token
            localStorage.token = response.data.token;
            localStorage.username = decodedToken['username'];
            // Change route
            this.$router.push({ path: '/my_groups' });
          })
          .catch(() => {
            let snackbarInfo = {
              'type': 'error',
              'message' : 'Username ou mot de passe incorrecte.'
            };
            this.$root.$emit('Snackbar', snackbarInfo);
            this.loading = false;
          });
      }
    },
  },
};
</script>

<style scoped>
  .logo_project{
    margin: auto;
  }
  .to_register_text{
    width: 50%;
    display: block;
    margin: 50px auto;
    text-align: center;
    text-decoration: none !important;
  }
  .to_register_text:hover > a{
    text-decoration: underline;
  }
  .user_logo,
  .hello_text,
  .valid_form_login{
    text-align: center;
    display: block;
    margin: auto;
  }
  #email_field,
  #password_field{
    background-color: transparent;
  }
  .valid_form_login{
    background-color: #E57750 !important;
    color: white !important;
    border-radius: 20px;
  }
</style>
