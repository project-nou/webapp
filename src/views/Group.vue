<template>
  <div class="group_view">
    <!--  Content page -->
    <div class="group_view_content">
      <v-row>
        <v-col class="col-md-2 pb-0">
          <Menu/>
        </v-col>

        <v-col class="col-md-10 pb-0">
          <div class="authorized_user text-right pt-5 pr-5">
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

          <v-container class="container--fluid">
            <div class="mt-10 group_information">
              <!-- Groupe Title -->
              <p class="text-h5 orange_personalize--text mr-10">
                {{ this.group[0].name }}
              </p>
              <!-- Dropdown Action -->
              <v-menu open-on-hover top offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn x-small fab outlined
                         class="pa-4 mb-2 settings_btn group_action"
                         v-bind="attrs" v-on="on">
                    <v-img
                        lazy-src="@/assets/icons/settings.png"
                        width="20"
                        src="@/assets/icons/settings.png"
                    ></v-img>
                  </v-btn>
                </template>

                <v-list class="dropdown_action" width="250">
                  <v-list-item
                      link class="link_action_group"
                      @click="leaveGroup()">
                    <v-img width="18px"
                           src="@/assets/icons/leave.png">
                    </v-img>

                    <v-list-item-title
                        class="dropdown_action_text">
                      Quitter le groupe
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
            <v-divider class="white"></v-divider>
            <!-- CONTENT -->
            <v-row class="mt-10" id="group_content">
              <v-container fluid class="wrapper">
                <v-row>
                  <!-- Task -->
                  <v-col class="col-md-6">
                    <DragAndDropList :group-data="group"></DragAndDropList>
                  </v-col>
                  <v-divider vertical class="white ml-10"></v-divider>
                  <!-- All files -->
                  <v-col class="col-md-5 ml-10">
                    <ListFile :group-data="group"></ListFile>
                    <!-- Drag and drop file -->
                    <v-row class="mt-8">
                      <DropFile :group-data="group"></DropFile>
                    </v-row>
                  </v-col>
                </v-row>
              </v-container>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </div>

<!--    <SnackbarSuccess :message="snackbarMessage" :color="color"/>-->
<!--    <SnackbarFailed :message="snackbarMessage" :color="color"/>-->
  </div>
</template>

<script>
import Menu from '@/components/Menu/Menu.vue';
// import SnackbarSuccess from '@/components/Snackbar/SnackbarSuccess.vue';
import axios from 'axios';
// import SnackbarFailed from '@/components/Snackbar/SnackbarFailed.vue';
import jwt_decode from 'jwt-decode';
import DragAndDropList from '@/components/DragAndDropList/DragAndDropList.vue';
import ListFile from '@/components/ListFile/ListFile.vue';
import DropFile from '@/components/DropFile/DropFile.vue';

export default {
  name: 'Group',
  components: {
    Menu,
    // SnackbarSuccess,
    // SnackbarFailed,
    DragAndDropList,
    ListFile,
    DropFile,
  },
  data() {
    return {
      group: [],
      adminUsername: '',
      idGroup: this.$route.params.id,
      groupeName: undefined,
      authorizedUser: [],
      isAdminOfGroup: true,
      username: undefined,
      valid: true,
      dialog: false,
      email: undefined,
      emailRules: [
        (v) => !!v || 'L\' e-mail est requis',
        (v) => /.+@.+\..+/.test(v) || 'L\' e-mail doit être valide',
      ],
      // snackbarMessage: undefined,
      // color: undefined,
      file: '',
      dragging: false
    };
  },
  beforeMount() {
    this.getOneGroup(this.idGroup);
    this.getUsersFromGroup();
  },
  mounted() {
    this.getUser();
  },
  computed: {
    extension() {
      return (this.file) ? this.file.name.split('.').pop() : '';
    }
  },
  methods: {
    // Get user
    getUser() {
      this.username = localStorage.getItem('username');
    },
    selection(item) {
      return item;
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
    async getOneGroup() {
      await axios.get('http://localhost:8000/group/' + this.$route.params.id)
          .then((response) => {
            this.groupeName = response.data.name;
            this.group.push({
              name: response.data.name,
              id: response.data.group_id,
              admin: response.data.admin
            });
            ;
          });
    },
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
    leaveGroup() {
      axios
          .delete('http://localhost:8000/user/' + jwt_decode(localStorage.getItem('token')).user_id + '/group/' + this.group[0].id + '/leave')
          .then(() => {
            this.snackbarMessageException('success', 'Vous avez quitté le groupe avec succes');
            this.$router.push('/my_groups');
          })
          .catch(() => {
            this.snackbarMessageException('error', 'Une erreur est survenue');
          });
    },
  },
};
</script>

<style scoped>
  .group_view {
    height: calc(100vh - 100px);
  }

  .logo_project {
    width: 75px;
    position: fixed;
    bottom: 40px;
    right: 40px;
  }

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

  #email_field, .task_content {
    background-color: transparent;
  }

  .group_information {
    display: block ruby;
  }

  .settings_btn {
    border: none;
  }

  .settings_btn:hover {
    background-color: rgba(229, 119, 80, 0.3);
  }

  #group_content {
    max-height: 80vh !important;
    overflow: auto;
    overflow-x: hidden;
  }

  .dropdown_action {
    background-color: #2F3437 !important;
    border: 1px solid #fff !important;
    border-radius: 12px !important;
  }

  .dropdown_action_text {
    color: white;
    margin-left: 10px;
  }

  .link_action_group:hover {
    background-color: rgba(229, 119, 80, 0.4);
  }
</style>
