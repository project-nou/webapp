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
              v-if="isAdminOfGroup"
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

                    <v-btn color="red darken-1" text @click="reset">
                      Fermer
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-container>

            </v-card>
          </v-dialog>

          <v-container class="container--fluid">
            <!-- Groupe Title -->
            <div class="mt-10 group_information">
              <p class="text-h5 orange_personalize--text mr-10">
                NOM DU GROUPE : {{ this.$route.params.id }}
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
                    @click="leaveGroup(username, 1)">
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
            <v-row class="mt-10">
              <v-container fluid class="wrapper">
                <v-row>
                  <!-- Task -->
                  <v-col class="col-md-7">
                    <v-row>
                      <h2 class="orange_personalize--text font-weight-thin">Tâches</h2>
                    </v-row>
                    <v-row>
                      <!-- To do task -->
                      <v-col class="col-md-5 offset-1">
                        <h3 class="title_task font-weight-thin">A faire</h3>
                        <div class="content_list">
                          <drop-list
                            :items="toDo"
                            class="list"
                            @insert="onInsert($event, 'toDo')"
                            @reorder="$event.apply(toDo)"
                            mode="cut"
                          >
                            <template v-slot:item="{item}">
                              <drag
                                class="item"
                                @cut="remove(toDo, item)"
                                :data="selection(item)"
                                :key="item.name"
                              >
                                {{item.name}}
                              </drag>
                            </template>
                            <template v-slot:feedback="{data}">
                              <template v-if="selected.length > 0">
                                <div
                                  v-for="f in data"
                                  class="item feedback" :key="f.name">{{f.name}}
                                </div>
                              </template>
                              <template v-else>
                                <div class="item feedback" :key="data.name">{{data.name}}</div>
                              </template>
                            </template>
                          </drop-list>

                          <!-- Add Task -->
                          <v-hover v-slot="{ hover }">
                            <v-card
                              max-width="185"
                              max-height="200"
                              class="mx-auto add_task"
                              :elevation="hover ? 6 : 2"
                              :class="{ 'on-hover': hover }"
                              @click.stop="dialog = true"
                            >
                              <v-card-text class="pa-0">
                                <v-list class="add_task_text_content">
                                  <v-list-item>
                                    <v-img
                                      width="14px"
                                      src='@/assets/icons/plus.png'>
                                    </v-img>
                                    <v-list-item-title class="white--text ml-2 text_add_task">
                                      Ajouter une tache
                                    </v-list-item-title>
                                  </v-list-item>
                                </v-list>
                              </v-card-text>
                            </v-card>
                          </v-hover>
                        </div>
                      </v-col>

                      <!-- Done task -->
                      <v-col class="col-md-5 offset-1">
                      <h3 class="title_task font-weight-thin">Finis</h3>
                      <div class="content_list">
                        <drop-list
                          :items="done"
                          class="list"
                          @insert="onInsert($event, 'done')"
                          @reorder="$event.apply(done)"
                          mode="cut"
                        >
                          <template v-slot:item="{item}">
                            <drag
                              class="item"
                              @cut="remove(done, item)"
                              :data="selection(item)"
                              :key="item.name"
                            >{{item.name}}</drag>
                          </template>
                          <template v-slot:feedback="{data}">
                            <template v-if="selected.length > 0">
                              <div
                                v-for="f in data"
                                class="item feedback" :key="f.name">
                                {{f.name}}
                              </div>
                            </template>
                            <template v-else>
                              <div class="item feedback" :key="data.name">{{data.name}}</div>
                            </template>
                          </template>
                        </drop-list>
                      </div>
                    </v-col>
                    </v-row>
                  </v-col>

                  <!-- Divider -->
                  <v-col class="col-md-1">
                    <v-divider vertical class="white"></v-divider>
                  </v-col>

                  <!-- All files -->
                  <v-col class="col-md-4">
                    <v-row>
                      <h2 class="orange_personalize--text font-weight-thin">Fichiers déposés</h2>
                    </v-row>
                    <v-row>
                      <div class="col-md-2" v-for="files in filesGroup" :key="files.name">
                        <p>{{ files.name }}</p>
                      </div>
                    </v-row>
                  </v-col>
                </v-row>
              </v-container>
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
import { Drag, DropList } from 'vue-easy-dnd';
import HeaderBanner from '@/components/Banner/HeaderBanner.vue';
import Menu from '@/components/Menu/Menu.vue';
import SnackbarSuccess from '@/components/Snackbar/SnackbarSuccess.vue';
// import SnackbarFailed from '@/components/Snackbar/SnackbarFailed.vue';

export default {
  name: 'Group',
  components: {
    Drag,
    DropList,
    HeaderBanner,
    Menu,
    SnackbarSuccess,
    // SnackbarFailed,
  },
  data() {
    return {
      toDo: [
        { name: 'Fait la vaisselle wola j\'téclate', id: 1 },
        { name: 'Aziz lumière', id: 2 },
        { name: 'MagicarpéDiem', id: 3 },
      ],
      done: [
        { name: 'Guimares jtm', id: 123 },
      ],
      filesGroup: [],
      selected: [],
      selectedList: 0,
      idGroup: this.$route.params.id,
      authorizedUser: [],
      isAdminOfGroup: true,
      username: 'Luca Sardellitti',
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
    this.getAllFiles();
  },
  methods: {
    selection(item) {
      return item;
    },
    /**
     * Inserts one selected done into the target
     * droplist
     *
     * @event {InsertEvent} - holds dragging data and drop index
     * @llistNameist String - name of the list in the data section
     */
    onInsert(event, listName = 'done') {
      this[listName].splice(event.index, 0, event.data);
      this.selected = [];

      console.log(event.data.name);
      // switch (listName) {
      //   case 'toDo':
      //     this.toDo.push(event.data.name, event.data.id);
      //     break;
      //   case 'done':
      //     this.done.push(event.data.name, event.data.id);
      //     break;
      //   default:
      // }
    },
    remove(array, value) {
      const index = array.indexOf(value);
      array.splice(index, 1);
      // }
    },
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
    },
    inviteUser() {
      console.log(this.email);
      // this.axios.post(`/user=${this.email}`)
      //   .then((response) => {
      //     console.log(response.data);
      this.snackbarMessageException('success', `L'invation à ${this.email} a bien été envoyé`);
      //   });
    },
    // Leave group
    leaveGroup(user, idGroup) {
      console.log(user, idGroup);
      // this.axios.delete(`/user=${user}&idGroup=${idGroup}`)
      //   .then((response) => {
      //     console.log(response.data);
      this.snackbarMessageException('success', 'Vous avez quitté le groupe avec succès');
      this.$router.push({ path: '/my_groups' });
      //   });
    },
    // Get all files
    getAllFiles() {
      // this.axios.get(`/idGroup=${this.idGroup}`)
      //   .then((response) => {
      // console.log(response.data);
      this.filesGroup.push({ name: 'test.txt' });
      this.filesGroup.push({ name: 'test.pdf' });
      // });
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
  }
  .authorized_user{
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
  .group_information{
    display: block ruby;
  }
  .settings_btn{
    border: none;
  }
  .settings_btn:hover{
    background-color: rgba( 229, 119, 80 , 0.3);
  }
  .title_task{
    color: white;
  }
  /*.drop-in {*/
  /*  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);*/
  /*}*/
  .add_task{
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    margin-bottom: 20px;
  }
  .add_task_text_content{
    width: 80%;
    margin: auto;
    background-color: transparent;
  }
  .content_list {
    border-right: 1px solid #E57750;
    width: 250px;
    min-height: 10vh;
    max-height: 55vh;
    overflow-y: auto;
  }
  .text_add_task{
    font-size: 12px;
  }
  .dropdown_action{
    background-color: #2F3437 !important;
    border: 1px solid #fff !important;
    border-radius: 12px !important;
  }
  .dropdown_action_text{
    color: white;
    margin-left: 10px;
  }
  .link_action_group:hover{
    background-color: rgba( 229, 119, 80, 0.4);
  }
</style>

<style scoped lang="scss">
.wrapper {
  .list {
    margin: auto;
    width: 200px;
    min-height: 100px;

    .item {
      padding: 20px;
      margin: 10px;
      background-color: rgba(255, 255, 255, 0.6);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;

      &.selected {
        border: 2px solid white;
      }

      &.feedback {
        background-color: rgba(255, 255, 255, 0.3);
        border: 2px dashed #E57750;
      }

      &.drag-image {
        background-color: white;
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>
