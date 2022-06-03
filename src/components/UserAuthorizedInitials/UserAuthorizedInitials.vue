<template>
  <div class="user_initials_content">
    <div class="authorized_user text-right pr-5">
      <!-- Auhtorized user -->
      <v-tooltip>
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="authorized_user_content"
                 fab small outlined color="orange"
                 v-bind="attrs" v-on="on">
            <div
              class="crown"
            >
              <v-img
                lazy-src="@/assets/icons/crown-outline.png"
                width="15"
                src="@/assets/icons/crown-outline.png"
              ></v-img>
            </div>
            {{ adminUsername.charAt(0) }}
          </v-btn>
        </template>
        <span>{{ adminUsername }}</span>
      </v-tooltip>

      <v-tooltip v-for="user in authorizedUser" :key="user.username">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="authorized_user_content"
            fab small outlined color="blue"
            v-bind="attrs" v-on="on"
          >
            {{ user.username.charAt(0) }}
          </v-btn>
        </template>
        <span>{{ user.username }}</span>
      </v-tooltip>

      <!-- Add user -->
      <v-btn
        @click.stop="dialog = true"
        class="authorized_user_content"
        fab small outlined color="white">
        +
      </v-btn>

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
                  color="orange darken-1"
                  text
                  :disabled="!valid"
                  @click="validate"
                >
                  Ajouter l'utilisateur
                </v-btn>

                <v-btn color="white darken-1" text @click="reset">
                  Fermer
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-container>

        </v-card>
      </v-dialog>
    </div>

    <SnackbarSuccess :message="snackbarMessage" :color="color"/>
    <SnackbarFailed :message="snackbarMessage" :color="color"/>
  </div>
</template>

<script>
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import SnackbarSuccess from '@/components/Snackbar/SnackbarSuccess.vue';
import SnackbarFailed from '@/components/Snackbar/SnackbarFailed.vue';

export default {
  name: "UserAuthorizedInitials",
  components :{
    SnackbarSuccess,
    SnackbarFailed,
  },
  props: {
    groupData: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      group: this.groupData,
      idGroup: this.$route.params.id,
      adminUsername: '',
      authorizedUser: [],
      dialog: false,
      valid: true,
      email: undefined,
      emailRules: [
        (v) => !!v || 'L\' e-mail est requis',
        (v) => /.+@.+\..+/.test(v) || 'L\' e-mail doit être valide',
      ],
      snackbarMessage: undefined,
      color: undefined,
    }
  },
  beforeMount() {
    this.getUsersFromGroup();
  },
  methods : {
    getUsersFromGroup() {
      axios.get('http://localhost:8000/group/' + this.$route.params.id + '/users')
        .then((response) => {
          const participants = response.data.groups[0].participants;
          const admin = response.data.groups[0].admin;
          for (let i = 0; i < participants.length; i++) {
            if (participants[i].id !== admin.id) {
              this.authorizedUser.push({
                username: participants[i].username,
                id: participants[i].id
              });
            } else {
              this.adminUsername = admin.username;
            }
          }
          this.verifyIfUserInGroup();
        });
    },
    verifyIfUserInGroup() {
      let usernames = [];
      this.authorizedUser.map((el) => {
        usernames.push(el.username);
      });
      if (!usernames.includes(jwt_decode(localStorage.getItem('token')).username) && this.adminUsername !== jwt_decode(localStorage.getItem('token')).username) {
        this.$router.push('/my_groups');
      }
    },
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
    inviteUser() {
      const email = this.email;
      axios.get('http://localhost:8000/users/' + email + '/groupes/' + this.idGroup + '/sendInvit')
        .then(() => {
          this.snackbarMessageException('success', 'L\'invation à ' + email + ' a bien été envoyée');
        })
        .catch(() => {
          this.snackbarMessageException('error', 'L\'invation à ' + email + ' n\'a pas été envoyée');
        });
    },
    // Exception snackbar
    snackbarMessageException(type, message) {
      this.snackbarMessage = message;
      this.color = type;
      switch (type) {
        case 'success':
          this.$root.$emit('SnackbarSuccess');
          break;
        case 'error':
          this.$root.$emit('SnackbarFailed');
          break;
        default:
      }
    },
  }
}
</script>

<style scoped>

.authorized_user {
  position: absolute;
  right: 25px;
}

.authorized_user_content {
  background-color: #575c5d;
  margin-left: -10px;
}
.hover-pseudo {
  font-size: 10px;
  color: white;
  margin-top: 40px;
  box-shadow: none!important;
}
.crown {
  margin-left: -18px;
}

.form_add_user_to_group {
  background-color: #575c5d !important;
  border: 1px solid #ccc;
}

#email_field {
  background-color: transparent;
}
</style>
