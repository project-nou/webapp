<template>
  <div class="my_groups_view">
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

              <v-row class="mt-10" id="my_groups_content">
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
                      :to='/group/+group.id'
                    >
                      <small class="ml-2 mt-3 orange_personalize--text" :class="hover ? 'admin-name--hover' : ''" v-if="username !== group.author"> Admin : <strong>{{ group.author }}</strong></small>
                      <!-- Dropdown Action -->
                      <v-menu open-on-hover top offset-y>
                        <template v-slot:activator="{ on, attrs }">
                          <v-img v-if="username === group.author" width="15" class="mt-2 ml-3 admin-logo" :src="require(`@/assets/icons/crown-outline.png`)"></v-img>
                          <v-btn v-if="username === group.author" class="group_action" small v-bind="attrs" v-on="on">
                            <span class="orange_personalize--text font-weight-bold">. . .</span>
                          </v-btn>
                        </template>

                        <v-list class="dropdown_action" style="box-shadow: none; left: 900Px" width="250">
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
                        <p class="orange_personalize--text"> {{ group.name }} </p>
                      </v-card-text>
                    </v-card>
                  </v-hover>
                </v-col>
                <!-- Form Edit Group -->
<!--                <v-dialog v-model="dialogEditGroup" max-width="390">-->
<!--                  <v-card class="form_edit_group">-->
<!--                    <v-card-title class="text-h5 white&#45;&#45;text">-->
<!--                      Voulez-vous modifier le groupe ?-->
<!--                    </v-card-title>-->

<!--                    <v-container class="container&#45;&#45;fluid">-->
<!--                      <v-form-->
<!--                        ref="formEdit"-->
<!--                        v-model="validEdit"-->
<!--                        lazy-validation-->
<!--                      >-->
<!--                        <v-text-field-->
<!--                          v-model="groupSelected"-->
<!--                          :counter="20"-->
<!--                          :rules="groupNameRules"-->
<!--                          label="Nom du groupe"-->
<!--                          required-->
<!--                          color="white"-->
<!--                          clearable-->
<!--                          clear-icon="mdi-close-circle"-->
<!--                        ></v-text-field>-->

<!--                        <v-card-actions>-->
<!--                          <v-spacer></v-spacer>-->

<!--                          <v-btn-->
<!--                            color="green darken-1"-->
<!--                            text-->
<!--                            :disabled="!validEdit"-->
<!--                            @click="validateEdit(groupSelected, groupIdSelected)"-->
<!--                          >-->
<!--                            Enregistrer-->
<!--                          </v-btn>-->

<!--                          <v-btn-->
<!--                            color="red darken-1"-->
<!--                            text-->
<!--                            @click="resetEdit"-->
<!--                          >-->
<!--                            Fermer-->
<!--                          </v-btn>-->
<!--                        </v-card-actions>-->
<!--                      </v-form>-->
<!--                    </v-container>-->

<!--                  </v-card>-->
<!--                </v-dialog>-->
                <!-- Form Edit Group -->
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
                      @click.stop="dialogAddGroup = true"
                    >
                      <v-card-text class="text-center pa-0 card_text">
                        <p class="text-h4"> + </p>
                        <p> Ajouter un groupe </p>
                      </v-card-text>
                    </v-card>
                  </v-hover>
                </v-col>

                <!-- Form Add Group -->
                <v-dialog v-model="dialogAddGroup" max-width="390">
                  <v-card class="form_add_group">
                    <v-card-title class="text-h5 white--text">
                      Ajouter un nouveau groupe ?
                    </v-card-title>

                    <v-card-text class="white--text font-weight-thin">
                      Remplir le formulaire afin d'ajouter un nouveau groupe.
                    </v-card-text>

                    <v-container class="container--fluid">
                      <v-form
                        ref="formAdd"
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
                            color="orange darken-1"
                            text
                            :disabled="!valid"
                            @click="validate"
                          >
                            Créer le groupe
                          </v-btn>

                          <v-btn
                            color="white darken-1"
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

    <SnackbarSuccess :message="snackbarMessage" :color="color"/>
    <SnackbarFailed :message="snackbarMessage" :color="color"/>
  </div>
</template>

<script>
import Menu from '@/components/Menu/Menu.vue';
import SnackbarSuccess from '@/components/Snackbar/SnackbarSuccess.vue';
import SnackbarFailed from '@/components/Snackbar/SnackbarFailed.vue';
import axios from 'axios';

export default {
  name: 'MyGroups',
  components: {
    Menu,
    SnackbarSuccess,
    SnackbarFailed,
  },
  data() {
    return {
      username: undefined,
      idGroup: undefined,
      dialogAddGroup: false,
      // dialogEditGroup: false,
      valid: true,
      // validEdit: true,
      groupSelected: undefined,
      groupIdSelected: undefined,
      snackbarMessage: undefined,
      color: undefined,
      groupName: undefined,
      groupNameRules: [
        (v) => !!v || 'Le nom du groupe est requis',
        (v) => (v && v.length <= 20) || 'Le nom ne doit pas dépasser 20 characters',
      ],
      groups: [],
      items: [
        // { title: 'Editer', icon: 'edit.png', name: 'edit' },
        { title: 'Supprimer', icon: 'trash-bin.png', name: 'delete' },
      ],
    };
  },
  beforeMount() {
    this.getUser()
    this.getAllGroups();
    console.log(this.username);
    console.log(this.groups);
  },
  methods: {
    validate() {
      if (this.$refs.formAdd.validate()) {
        this.createGroup();
        this.reset();
      }
    },
    // validateEdit(groupName, groupId) {
    //   if (this.$refs.formEdit.validate()) {
    //     this.editGroup(groupId, groupName);
    //     this.resetEdit();
    //   }
    // },
    reset() {
      this.$refs.formAdd.reset()
      this.dialogAddGroup = false;
    },
    // resetEdit() {
    //   this.$refs.formEdit.reset()
    //   this.dialogEditGroup = false;
    // },
    // Get user
    getUser() {
      this.username = localStorage.getItem('username');
    },
    // Get all group by user
    getAllGroups() {
      axios
        .get("http://localhost:8000/groups/"+localStorage.getItem('username'))
        .then((response) => {
          response.data.groups.forEach(el => {
            this.groups.push({ name: el.group_name, id: el.group_id, author: el.author });
          })
        })
    },
    // Create group
    createGroup() {
      const data = {
        name: this.groupName,
        username: this.username,
      };
      axios.post('http://127.0.0.1:8000/group', data)
        .then((response) => {
          this.snackbarMessageException('success', `Le groupe ${response.data.groupname} a bien été créé.`);
          this.groups.push({ name: response.data.groupname, id: response.data.group_id, author: response.data.author})
        })
        .catch((error) => {
          console.log(error)
          this.snackbarMessageException('error', `Le groupe n'a pas pu être créé.`);
        });
      this.reset();
    },
    // Edit group
    // editGroup(groupId, groupName) {
    //   const data = {
    //     group_id: groupId,
    //     group_name: groupName,
    //   };
    //
    //   this.groups.map(el => {
    //     if (el.id === groupId) {
    //       axios.patch('http://localhost:8000/group', data)
    //         .then(() => {
    //           this.snackbarMessageException('success', `Le groupe a été renommé en ${groupName}.`);
    //         })
    //         .catch(() => {
    //           this.snackbarMessageException('error', `Le groupe n'a pas pu être renommé.`);
    //         })
    //       // Set name
    //       el.name = groupName
    //     }
    //   })
    //   this.resetEdit();
    // },
    actionGroup(action, groupId, groupName) {
      switch (action) {
        // case 'addFile':
        //   console.log('add file');
        //   break;
        // case 'edit':
        //   this.dialogEditGroup = true;
        //   this.groupSelected = groupName;
        //   this.groupIdSelected = groupId;
        //   break;
        case 'delete':
          this.deleteGroup(groupId, groupName);
          break;
        default:
          console.log('default');
      }
    },
    // Delete an group
    deleteGroup(groupId, groupName) {
      // Counter equal array index value
      let count = 0;
      this.groups.map(el => {
        if (el.id === groupId) {
          axios.delete(`http://127.0.0.1:8000/group/${groupId}/${this.username}`)
            .then(() => {
              this.snackbarMessageException('success', `Le groupe ${groupName} a bien été supprimé.`);
            })
            .catch((error) => {
              console.log(error);
            })
          // Remove value in array
          this.groups.splice(count, 1);
        }
        count ++;
      })
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
  #my_groups_content {
    max-height: 80vh !important;
    overflow: auto;
    overflow-x: hidden;
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
  .group:hover > .group_name p,
  .group:hover > .group_action span{
    color: white;
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
  .add_group .card_text p:nth-child(0),
  .add_group .card_text p:nth-child(1){
    transition: 0.5s;
  }
  .add_group:hover > .card_text p:nth-child(0),
  .add_group:hover > .card_text p:nth-child(1){
    margin-top: -8px;
    transition: 0.5s;
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
  .form_add_group, .form_edit_group{
    background-color: #575c5d !important;
    border: 1px solid #ccc;
  }
  .orange_personalize--text{
    color: #E57750;
  }
  .admin-logo {
    position: absolute !important;
  }
  .admin-name--hover {
    color: #E57750;
  }
  .admin-name {
    color: white;
  }
</style>
