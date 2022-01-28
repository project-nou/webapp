<template>
  <div class="my_groups_view">
    <HeaderBanner/>
      <!--  Content page -->
      <div class="my_groups_view_content">
        <v-row>
          <v-col class="col-md-2 pb-0">
            <Menu/>
          </v-col>

          <v-col class="col-md-10 pb-0">
            <v-container class="container--fluid">
              <!-- Page Title -->
              <div class="mt-10">
                <p class="text-h5 orange_personalize--text"> MES GROUPES </p>
                <v-divider class="white"></v-divider>
              </div>

              <v-row class="mt-10">
                <!-- All Groups -->
                <v-col
                  class="col-md-3"
                  v-for="group in groups" :key="group.name"
                >
                  <v-hover v-slot="{ hover }">
                    <v-card
                      class="mx-auto mb-4 mt-4 group"
                      max-width="300"
                      height="175"
                      :elevation="hover ? 16 : 2"
                      :class="{ 'on-hover': hover }"
                    >
                      <!-- Dropdown Action -->
                      <v-menu open-on-hover top offset-y>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn class="group_action" small v-bind="attrs" v-on="on">
                            <span class="orange_personalize--text font-weight-bold">. . .</span>
                          </v-btn>
                        </template>

                        <v-list class="dropdown_action" width="250">
                          <v-list-item v-for="(item, index) in items" :key="index"
                                       link class="link_action_group"
                                       @click="actionGroup(item.name, group.id, group.name)">
                            <v-img width="18px"
                              :src="require(`@/assets/icons/${item.icon}`)">
                            </v-img>

                            <v-list-item-title
                              class="dropdown_action_text">
                              {{ item.title }}
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>

                      <!-- Dropdown Action -->
                      <v-card-text class="text-left pa-0 group_name">
                        <p class="orange_personalize--text group_name"> {{ group.name }} </p>
                      </v-card-text>
                    </v-card>
                  </v-hover>
                </v-col>
                <!-- All Groups -->

                <!-- Add Group -->
                <v-col class="col-md-3">
                  <v-hover v-slot="{ hover }">
                    <v-card
                      class="mx-auto mb-4 mt-4 add_group"
                      max-width="300"
                      height="175"
                      :elevation="hover ? 16 : 2"
                      :class="{ 'on-hover': hover }"
                      @click.stop="dialog = true"
                    >
                      <v-card-text class="text-center pa-0">
                        <p class="text-h4"> + </p>
                        <p> Ajouter un groupe </p>
                      </v-card-text>
                    </v-card>
                  </v-hover>
                </v-col>

                <!-- Form Add Group -->
                <v-dialog v-model="dialog" max-width="390">
                  <v-card class="form_add_group">
                    <v-card-title class="text-h5 white--text">
                      Ajouter un nouveau groupe ?
                    </v-card-title>

                    <v-card-text class="white--text font-weight-thin">
                      Remplir le formulaire afin d'ajouter un nouveau groupe.
                    </v-card-text>

                    <v-container class="container--fluid">
                      <v-form
                        ref="form"
                        v-model="valid"
                        lazy-validation
                      >
                        <v-text-field
                          v-model="groupName"
                          :counter="20"
                          :rules="groupNameRules"
                          label="Nom du groupe"
                          required
                          color="white"
                          clearable
                          clear-icon="mdi-close-circle"
                        ></v-text-field>

                        <v-card-actions>
                          <v-spacer></v-spacer>

                          <v-btn
                            color="green darken-1"
                            text
                            :disabled="!valid"
                            @click="validate"
                          >
                            Créer le groupe
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
                <!-- Form Add Group -->
                <!-- Add Group -->
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
    <SnackbarFailed :message="snackbarMessage" :color="color"/>
  </div>
</template>

<script>
import HeaderBanner from '@/components/Banner/HeaderBanner.vue';
import Menu from '@/components/Menu/Menu.vue';
import SnackbarSuccess from '@/components/Snackbar/SnackbarSuccess.vue';
import SnackbarFailed from '@/components/Snackbar/SnackbarFailed.vue';

export default {
  name: 'MyGroups',
  components: {
    HeaderBanner,
    Menu,
    SnackbarSuccess,
    SnackbarFailed,
  },
  data() {
    return {
      userEmail: 'luca.sardellit.1995@gmail.com',
      idGroup: undefined,
      dialog: false,
      valid: true,
      snackbarMessage: undefined,
      color: undefined,
      groupName: undefined,
      groupNameRules: [
        (v) => !!v || 'Le nom du groupe est requis',
        (v) => (v && v.length <= 20) || 'Le nom ne doit pas dépasser 20 characters',
      ],
      groups: [],
      items: [
        { title: 'Ajouter un fichier', icon: 'plus.png', name: 'addFile' },
        { title: 'Editer', icon: 'edit.png', name: 'edit' },
        { title: 'Supprimer', icon: 'trash-bin.png', name: 'delete' },
      ],
    };
  },
  created() {
    this.getAllGroups();
  },
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.createGroup();
      }
      this.reset();
    },
    reset() {
      this.$refs.form.reset();
      this.dialog = false;
    },
    // Get all group by user
    getAllGroups() {
      // this.axios.get(`/email=${this.userEmail}`)
      //   .then((response) => {
      // console.log(response.data);
      this.groups.push({ name: 'Ta reum', id: 1 });
      this.groups.push({ name: 'Double Fuck', id: 2 });
      this.groups.push({ name: 'Enlécu', id: 3 });
      console.log(this.groups);
      // });
    },
    // Create group
    createGroup() {
      // const data = {
      //   user: this.userEmail,
      //   name: this.groupName,
      // };
      // this.axios.post('', data)
      //   .then((response) => {
      //     console.log(response.data);
      this.snackbarMessageException('success', `Le groupe ${this.groupName} a bien été créé.`);
      // this.getAllGroups();
      //   })
      //   .catch((error) => {
      //     console.log(error);
      // eslint-disable-next-line max-len
      // this.snackbarMessageException('error', `Le groupe ${this.groupName} n'a pas pu être créé.`);
      //   });
      this.reset();
    },
    actionGroup(action, id, groupName) {
      console.log(action, id, groupName);
      switch (action) {
        case 'addFile':
          console.log('add file');
          break;
        case 'edit':
          console.log('edit');
          break;
        case 'delete':
          this.deleteGroup(id, groupName);
          console.log('delete');
          break;
        default:
          console.log('default');
      }
    },
    // Delete an group
    deleteGroup(id, groupName) {
      // this.axios.delete(`/id=${id}`)
      //   .then(() => {
      this.snackbarMessageException('success', `Le groupe ${groupName} a bien été supprimé.`);
      // this.getAllGroups();
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
        case 'error':
          this.$root.$emit('SnackbarFailed');
          break;
        default:
      }
    },
  },
};
</script>

<style scoped>
  .my_groups_view{
    height: calc(100vh - 100px);
  }
  .logo_project{
    width: 75px;
    position: fixed;
    bottom: 40px;
    right: 40px;
  }
  .group{
    background-color:rgba(255, 255, 255, 0.1) !important;
    border: 1px solid #fff !important;
    border-radius: 12px !important;
  }
  .group.v-card.on-hover{
    border: 1px solid #E57750 !important;
    cursor: pointer;
  }
  .group.v-card.on-hover > .orange_personalize--text{
    color: white !important;
  }
  .group_action{
    background-color: transparent !important;
    box-shadow: none;
    position: absolute;
    right: 0;
  }
  .group_name{
    color: #E57750;
    bottom: 0;
    left: 15px;
    position: absolute;
  }
  .add_group{
    background-color:rgba(255, 255, 255, 0.03) !important;
    background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='white' stroke-width='2' stroke-dasharray='20' stroke-dashoffset='6' stroke-linecap='square'/%3e%3c/svg%3e");
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .add_group.v-card.on-hover{
    background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='orange' stroke-width='2' stroke-dasharray='20' stroke-dashoffset='6' stroke-linecap='square'/%3e%3c/svg%3e");
    cursor: pointer;
  }
  .add_group p{
    color: white;
    line-height: 12px;
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
  .form_add_group{
    background-color: #575c5d !important;
    border: 1px solid #ccc;
  }
  .orange_personalize--text{
    color: #E57750;
  }
</style>
