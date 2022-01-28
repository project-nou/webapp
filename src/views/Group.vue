<template>
  <div class="group_view">
    <HeaderBanner/>
    <!--  Content page -->
    <div class="group_view_content">
      <v-row>
        <v-col class="col-md-2 pb-0">
          <Menu/>
        </v-col>

        <v-col class="col-md-10 pb-0">
          <div class="authorized_user text-right pt-5 pr-5">
            <!-- Auhtorized user -->
            <v-btn
              class="authorized_user_content"
              fab x-small outlined color="orange"
              v-for="user in authorizedUser" :key="user.username">
              {{ user.username.charAt(0) }}
            </v-btn>
            <!-- Add user -->
            <v-btn
              @click.stop="dialog = true"
              class="authorized_user_content"
              fab x-small outlined color="white">
              +
            </v-btn>
          </div>

          <!-- Form Add user -->
          <v-dialog v-model="dialog" max-width="390">
            <v-card class="form_add_user_to_group">
              <v-card-title class="text-h5 white--text">
                Inviter un utilisateur ?
              </v-card-title>

              <v-card-text class="white--text font-weight-thin">
                Remplir le formulaire afin d'inviter un nouvel utilisateur.
              </v-card-text>

              <v-container class="container--fluid">
                <v-form
                  ref="form"
                  v-model="valid"
                  lazy-validation
                >
                  <v-list id="email_field">
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
                          color="orange"
                          clearable
                          clear-icon="mdi-close-circle"
                        ></v-text-field>
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>

                  <v-card-actions class="mt-10">
                    <v-spacer></v-spacer>
                    <v-btn
                      color="green darken-1"
                      text
                      :disabled="!valid"
                      @click="validate"
                    >
                      Ajouter l'utilisateur
                    </v-btn>

                    <v-btn
                      color="red darken-1"
                      text
                      @click="reset"
                    >
                      Fermer
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-container>

            </v-card>
          </v-dialog>

          <v-container class="container--fluid">
            <!-- Page Title -->
            <div class="mt-10">
              <p class="text-h5 orange_personalize--text">
                NOM DU GROUPE : {{ this.$route.params.id }}
              </p>
              <v-divider class="white"></v-divider>
            </div>

            <v-row class="mt-10">

            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </div>

    <!-- Logo project -->
    <v-img
      class="logo_project"
      lazy-src="@/assets/nou.png"
      src="@/assets/nou.png"
    ></v-img>

    <SnackbarSuccess :message="snackbarMessage" :color="color"/>
<!--    <SnackbarFailed :message="snackbarMessage" :color="color"/>-->
  </div>
</template>

<script>
import HeaderBanner from '@/components/Banner/HeaderBanner.vue';
import Menu from '@/components/Menu/Menu.vue';
import SnackbarSuccess from '@/components/Snackbar/SnackbarSuccess.vue';
// import SnackbarFailed from '@/components/Snackbar/SnackbarFailed.vue';

export default {
  name: 'Group',
  components: {
    HeaderBanner,
    Menu,
    SnackbarSuccess,
    // SnackbarFailed,
  },
  data() {
    return {
      idGroup: this.$route.params.id,
      authorizedUser: [],
      valid: true,
      dialog: false,
      email: undefined,
      emailRules: [
        (v) => !!v || 'L\' e-mail est requis',
        (v) => /.+@.+\..+/.test(v) || 'L\' e-mail doit être valide',
      ],
      // userEmail: 'luca.sardellit.1995@gmail.com',
      snackbarMessage: undefined,
      color: undefined,
    };
  },
  created() {
    this.getOneGroup(this.idGroup);
    this.getAuthorizedUserToGroup();
  },
  methods: {
    // Valid the invit user form
    validate() {
      if (this.$refs.form.validate()) {
        this.inviteUser();
        this.reset();
      }
    },
    reset() {
      this.$refs.form.reset();
      this.dialog = false;
    },
    getOneGroup(/* id */) {
      // this.axios.get(`/id=${id}`)
      //   .then((response) => {
      //     console.log(response);
      //   });
    },
    getAuthorizedUserToGroup() {
      this.authorizedUser.push({ username: 'Luca Sardellitti', id: 1 });
      this.authorizedUser.push({ username: 'Florian Berrot', id: 2 });
      this.authorizedUser.push({ username: 'Antoine Mousset', id: 3 });
      console.log(this.groups);
    },
    inviteUser() {
      console.log(this.email);
      // this.axios.post(`/user=${this.email}`)
      //   .then((response) => {
      //     console.log(response.data);
      this.snackbarMessageException('success', `L'invation à ${this.email} a bien été envoyé`);
      //   });
    },
    // Exception snackbar
    snackbarMessageException(type, message) {
      this.snackbarMessage = message;
      this.color = type;
      switch (type) {
        case 'success':
          this.$root.$emit('SnackbarSuccess');
          break;
        // case 'error':
        //   this.$root.$emit('SnackbarFailed');
        //   break;
        default:
      }
    },
  },
};
</script>

<style scoped>
  .group_view{
    height: calc(100vh - 100px);
  }
  .logo_project{
    width: 75px;
    position: fixed;
    bottom: 40px;
    right: 40px;
  }.authorized_user{
    position: absolute;
    right: 25px;
     }
  .authorized_user_content{
    background-color: #575c5d;
   margin-left: -10px;
  }
  .form_add_user_to_group{
    background-color: #575c5d !important;
    border: 1px solid #ccc;
  }
  #email_field{
    background-color: transparent;
  }
  .orange_personalize--text{
    color: #E57750;
  }
</style>
