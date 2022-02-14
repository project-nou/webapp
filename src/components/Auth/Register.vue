<template>
  <div class="register_view">
    <v-row class="pa-0">
      <v-col class="col-md-3">
        <div class="logo_to_bottom">
          <v-img
            lazy-src="@/assets/informatique.png"
            width="150"
            src="@/assets/informatique.png"
            class="ynov_logo"
          ></v-img>
        </div>
      </v-col>

      <!-- Content -->
      <v-col class="col-md-6">
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
            >
              Je crée mon compte
            </v-btn>
          </v-form>
        </v-card>
      </v-col>

      <v-col class="col-md-3">
        <div class="logo_to_bottom">
          <v-img
            lazy-src="@/assets/nou.png"
            width="150"
            src="@/assets/nou.png"
            class="project_logo"
          ></v-img>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Register',
  data() {
    return {
      valid: true,
      password: undefined,
      username: undefined,
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
      if (this.$refs.form.validate()) {
        const data = {
          email: this.email,
          username: this.username,
          password: this.password,
        };
        axios
            .post('http://localhost:8000/sign-up', data)
            .then((response) => {
            console.log(response.data);
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
    background-color: rgba(255, 255, 255, 0.2) !important;
    border: 1px solid white;
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
</style>
