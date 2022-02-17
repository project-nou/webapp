<template>
  <div class="register_view">
    <v-row class="pa-0">
      <v-col class="col-md-3">
      </v-col>

      <!-- Content -->
      <v-col class="col-md-6 mt-16">
        <v-card class="ma-10 card_register">
          <v-img
            lazy-src="@/assets/user.png"
            width="50"
            src="@/assets/user.png"
            class="user_logo mt-10"
          ></v-img>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
            class="register_form"
            @submit.prevent="register"
          >
            <!-- EMAIL -->
            <v-list id="email_field" class="pl-15 pr-15" height="80px">
              <v-list-item>
                <v-img
                  lazy-src="@/assets/icons/email.png"
                  width="40"
                  src="@/assets/icons/email.png"
                ></v-img>
                <v-list-item-title class="ml-10">
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="E-mail"
                    required
                    clearable
                    clear-icon="mdi-close-circle"
                    filled
                    class="mt-8"
                    color="orange"
                  ></v-text-field>
                </v-list-item-title>
              </v-list-item>
            </v-list>
            <!-- USERNAME -->
            <v-list id="username_field" class="pl-15 pr-15" height="80px">
              <v-list-item>
                <v-img
                  lazy-src="@/assets/icons/id-card.png"
                  width="40"
                  src="@/assets/icons/id-card.png"
                ></v-img>
                <v-list-item-title class="ml-10">
                  <v-text-field
                    filled
                    class="mt-8"
                    color="orange"
                    v-model="username"
                    :counter="20"
                    :rules="usernameRules"
                    label="Utilisateur"
                    required
                    clearable
                    clear-icon="mdi-close-circle"
                  ></v-text-field>
                </v-list-item-title>
              </v-list-item>
            </v-list>
            <!-- PASSWORD -->
            <v-list id="password_field" class="pl-15 pr-15" height="80px">
              <v-list-item>
                <v-img
                  lazy-src="@/assets/icons/padlock.png"
                  width="40"
                  src="@/assets/icons/padlock.png"
                ></v-img>
                <v-list-item-title  class="ml-10">
                  <v-text-field
                    type="password"
                    label="Mot de passe"
                    required
                    clearable
                    clear-icon="mdi-close-circle"
                    filled
                    class="mt-8"
                    color="orange"
                    v-model="password"
                  ></v-text-field>
                </v-list-item-title>
              </v-list-item>
            </v-list>

            <!-- To login -->
            <router-link to="/login" class="to_login_text font-weight-thin mt-15">
              <a class="white--text">
                Déjà inscrit ?
              </a>
            </router-link>

            <v-btn
              class="valid_form_register pl-10 pr-10 mt-7 mb-7"
              :disabled="!valid"
              @click="validate"
              :loading="loading"
            >
              Je crée mon compte
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <SnackbarFailed color="red" message="Ce nom d'utilisateur est déjà utilisé."/>
  </div>
</template>

<script>
import SnackbarFailed from '@/components/Snackbar/SnackbarFailed.vue';
import axios from 'axios';
import jwt_decode from "jwt-decode";

export default {
  name: 'Register',
  components: {
    SnackbarFailed,
  },
  data() {
    return {
      valid: true,
      password: undefined,
      username: undefined,
      loading: false,
      usernameRules: [
        (v) => !!v || 'L\' utilisateur est requis',
        (v) => (v && v.length <= 20) || 'L\' utilisateur ne doit pas dépasser 20 characters',
      ],
      email: '',
      emailRules: [
        (v) => !!v || 'L\' e-mail est requis',
        (v) => /.+@.+\..+/.test(v) || 'L\' e-mail doit être valide',
      ],
    };
  },
  methods: {
    // Valid the register form
    validate() {
      this.loading = true;
      if (this.$refs.form.validate()) {
        const data = {
          email: this.email,
          username: this.username,
          password: this.password,
        };
        axios
            .post('http://localhost:8000/sign-up', data)
            .then((response) => {
              // Decode token
              const decodedToken = jwt_decode(response.data.token);
              // Stock in local storage username and token
              localStorage.token = response.data.token;
              localStorage.username = decodedToken[0];
              // Change route
              this.$router.push({ path: '/my_groups' });
            })
            .catch(() => {
              this.$root.$emit('SnackbarFailed');
              this.loading = false;
            });
      }
    },
  },
};
</script>

<style scoped>
  .user_logo,
  .ynov_logo,
  .project_logo{
    width: 50%;
    margin: auto;
  }
  .logo_to_bottom{
    width: 25%;
    position: absolute;
    bottom: 25px;
  }
  .card_register{
    background-color: #505050 !important;
    border: 2px solid black;
    border-radius: 20px !important;
  }
  #email_field,
  #password_field,
  #username_field{
    background-color: transparent !important;
  }
  .to_login_text{
    width: 50%;
    display: block;
    margin: 10px auto;
    text-align: center;
    text-decoration: none !important;
  }
  .to_login_text:hover > a{
    text-decoration: underline;
  }
  .valid_form_register{
    background-color: #E57750 !important;
    color: white !important;
    border-radius: 20px;
    display: block;
    margin: auto;
  }
  .register_view {
    background: url('./nou2.png') repeat;
    height: 100vh;
    background-size: 100px;
  }
</style>
