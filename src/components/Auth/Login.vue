<template>
  <div class="login_view">
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
        <p class="to_register_text white--text font-weight-thin mt-15">
          Pas encore inscrit ? Créé toi un compte
        </p>
      </v-col>

      <!-- Login Form -->
      <v-col class="col-md-4 offset-md-2">
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
                  v-model="email"
                  :rules="emailRules"
                  label="E-mail"
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
          >
            Se connecter
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      valid: true,
      email: '',
      emailRules: [
        (v) => !!v || 'L\' e-mail est requis',
        (v) => /.+@.+\..+/.test(v) || 'L\' e-mail doit être valide',
      ],
    };
  },
  methods: {
    validate() {
      this.$refs.form.validate();
    },
  },
};
</script>

<style scoped>
  .logo_project{
    margin: auto;
  }
  .to_register_text{
    text-align: center;
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
