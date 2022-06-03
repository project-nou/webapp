<template>
  <div class="group_view">
    <!--  Content page -->
    <div class="group_view_content">
      <v-row>
        <!-- MENU -->
        <v-col class="col-md-2 pb-0">
          <Menu/>
        </v-col>
        <!-- CONTENT -->
        <v-col class="col-md-10 pb-0">
          <!-- TOP CONTENT -->
          <v-row class="mt-10">
            <!-- Group Title -->
            <v-col class="col-md-7">
              <div class="group_information">
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
            </v-col>
            <!-- User authorized -->
            <v-col class="col-md-5">
              <UserAuthorizedInitials :group-data="group"></UserAuthorizedInitials>
            </v-col>
          </v-row>
          <v-divider class="white mt-5 mr-5"></v-divider>
          <!-- BODY CONTENT-->
          <v-row>
            <v-container class="container--fluid">
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
          </v-row>
        </v-col>
      </v-row>
    </div>

<!--    <SnackbarSuccess :message="snackbarMessage" :color="color"/>-->
<!--    <SnackbarFailed :message="snackbarMessage" :color="color"/>-->
  </div>
</template>

<script>
// import SnackbarSuccess from '@/components/Snackbar/SnackbarSuccess.vue';
import axios from 'axios';
// import SnackbarFailed from '@/components/Snackbar/SnackbarFailed.vue';
import jwt_decode from 'jwt-decode';
import Menu from '@/components/Menu/Menu.vue';
import UserAuthorizedInitials from '@/components/UserAuthorizedInitials/UserAuthorizedInitials.vue';
import DragAndDropList from '@/components/DragAndDropList/DragAndDropList.vue';
import ListFile from '@/components/ListFile/ListFile.vue';
import DropFile from '@/components/DropFile/DropFile.vue';

export default {
  name: 'Group',
  components: {
    Menu,
    // SnackbarSuccess,
    // SnackbarFailed,
    UserAuthorizedInitials,
    DragAndDropList,
    ListFile,
    DropFile,
  },
  data() {
    return {
      group: [],
      idGroup: this.$route.params.id,
      groupName: undefined,
      isAdminOfGroup: true,
      username: undefined,

      file: '',
    };
  },
  beforeMount() {
    this.getOneGroup(this.idGroup);
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
    async getOneGroup() {
      await axios.get('http://localhost:8000/group/' + this.$route.params.id)
          .then((response) => {
            this.groupName = response.data.name;
            this.group.push({
              name: response.data.name,
              id: response.data.group_id,
              admin: response.data.admin
            });
            ;
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
