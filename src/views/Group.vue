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

                    <v-btn color="red darken-1" text @click="reset">
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
            <!-- CONTENT -->
            <v-row class="mt-10">
              <v-container fluid class="wrapper">
                <v-row>
                  <!-- To do task -->
                  <v-col class="col-md-4">
                    <h2 class="title_task font-weight-thin">A faire</h2>
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
                            :class="{ 'selected' : selected.indexOf(item) > -1 }"
                            @click="toggleSelected(toDo, item)"
                            @cut="remove(toDo, item)"
                            :data="selection(item)"
                            :key="item.name"
                          >{{item.name}}</drag>
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
                  <v-col class="col-md-4">
                    <h2 class="title_task font-weight-thin">Finis</h2>
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
                            :class="{ 'selected' : selected.indexOf(item) > -1 }"
                            @cut="remove(done, item)"
                            @click="toggleSelected(done, item)"
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
        { name: 'Frozen Yogurt', calories: 159, fat: 6.0 },
        { name: 'Ice cream sandwich', calories: 237, fat: 9.0 },
        { name: 'Eclair', calories: 262, fat: 16.0 },
        { name: 'More ice cream sandwich', calories: 237, fat: 9.0 },
      ],
      done: [],
      selected: [],
      selectedList: 0,
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
    selection(item) {
      return this.selected.length > 0 ? this.selected : item;
    },
    /**
     * Inserts one or multiple selected done into the target
     * droplist
     *
     * @event {InsertEvent} - holds dragging data and drop index
     * @llistNameist String - name of the list in the data section
     */
    onInsert(event, listName = 'done') {
      if (event.data.length > 0) {
        event.data.forEach((e, idx) => {
          // event.index is the starting point of the target droplist
          // event.index + idx = appending the done one after the other
          this[listName].splice(event.index + idx, 0, e);
        });
      } else {
        // here we have just one item
        // @see https://codesandbox.io/s/droplist-ozs8b
        this[listName].splice(event.index, 0, event.data);
      }

      this.selected = [];
    },
    remove(array, value) {
      // Following logic is taken from https://codesandbox.io/s/easy-dnd-demo-9mbij
      // In addition if we have some done in the selection
      // we apply the same logic just with a loop

      if (this.selected.length > 0) {
        this.selected.forEach((e) => {
          const index = array.indexOf(e);
          array.splice(index, 1);
        });
      } else {
        const index = array.indexOf(value);
        array.splice(index, 1);
      }
    },
    /**
     * Inserts an item into the selected list.
     *
     * If you select an item from another list the selection of
     * the last list gets resetted.
     *
     * @see https://codesandbox.io/s/easy-dnd-demo-2-xnqbz
     * @listName String - name of the list in the data section
     * @item {Object} - the selected data in the list
     */
    toggleSelected(listName, item) {
      if (listName !== this.selectedList) {
        this.selected = [];
        this.selectedList = listName;
      }

      // Basic toggeling logic
      // If an item is in the list remove it
      // otherwise add it to the list
      const index = this.selected.indexOf(item);
      if (index > -1) {
        this.selected.splice(index, 1);
      } else {
        this.selected.push(item);
      }
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
