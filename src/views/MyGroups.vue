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
                  <v-hover
                    v-slot="{ hover }"
                  >
                    <v-card
                      class="mx-auto mb-4 mt-4 group"
                      max-width="300"
                      height="175"
                      :elevation="hover ? 16 : 2"
                      :class="{ 'on-hover': hover }"
                    >
                      <!-- Dropdown Action -->
                      <v-menu
                        open-on-hover
                        top
                        offset-y
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="group_action"
                            small
                            v-bind="attrs"
                            v-on="on"
                          >
                            <span class="orange_personalize--text font-weight-bold">. . .</span>
                          </v-btn>
                        </template>
                        <v-list class="dropdown_action" width="250">
                          <v-list-item
                            v-for="(item, index) in items"
                            :key="index"
                            link
                            class="link_action_group"
                          >
                            <v-img
                              width="18px"
                              :src="require(`@/assets/icons/${item.icon}`)"></v-img>
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
                  <v-hover
                    v-slot="{ hover }"
                  >
                    <v-card
                      class="mx-auto mb-4 mt-4 add_group"
                      max-width="300"
                      height="175"
                      :elevation="hover ? 16 : 2"
                      :class="{ 'on-hover': hover }"
                    >
                      <v-card-text class="text-center pa-0">
                        <p class="text-h4"> + </p>
                        <p> Ajouter un groupe </p>
                      </v-card-text>
                    </v-card>
                  </v-hover>
                </v-col>
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
  </div>
</template>

<script>
import HeaderBanner from '@/components/Banner/HeaderBanner.vue';
import Menu from '@/components/Menu/Menu.vue';

export default {
  name: 'MyGroups',
  components: {
    HeaderBanner,
    Menu,
  },
  data() {
    return {
      groups: [
        { name: 'Ta reum' },
        { name: 'Double Fuck' },
        { name: 'Enlécu' },
      ],
      items: [
        { title: 'Ajouter un fichier', icon: 'plus.png' },
        { title: 'Editer', icon: 'edit.png' },
        { title: 'Supprimer', icon: 'trash-bin.png' },
      ],
    };
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
  .orange_personalize--text{
    color: #E57750;
  }
</style>
