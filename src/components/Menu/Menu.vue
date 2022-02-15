<template>
  <div class="menu">
    <!-- Hello User -->
    <div id="presentation">
      <v-list id="presentation_content" class="pt-5">
        <v-list-item>
          <v-img
            lazy-src="@/assets/user.png"
            width="40"
            src="@/assets/user.png"
          ></v-img>
          <v-list-item-title>
            <p class="mb-0 ml-5">{{ username }}</p>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </div>
    <!-- Menu -->
    <v-list class="action_menu mt-15" height="420">
      <v-list-item
        v-for="(item, index) in items"
        :key="index"
        link
        class="link_action_menu active"
      >
        <v-img
          width="30px"
          :src="require(`@/assets/icons/${item.icon}`)"></v-img>
        <v-list-item-title
          class="menu_action_text text-h7 ml-7">
          <router-link :to="item.link">
            <a class="white--text">
              {{ item.title }}
            </a>
          </router-link>
        </v-list-item-title>
      </v-list-item>

      <v-list-item link class="logout_action link_action_menu" @click="logout">
        <v-img
          lazy-src="@/assets/icons/logout.png"
          width="30"
          src="@/assets/icons/logout.png"></v-img>
        <v-list-item-title class="menu_action_text text-h7 ml-7">
          Déconnexion
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <!-- Logo Ynov -->
    <v-divider class="white mt-5"></v-divider>
    <div class="logo_content">
      <v-img
        class="logo_ynov"
        lazy-src="@/assets/informatique.png"
        src="@/assets/informatique.png"
      ></v-img>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Menu',
  data() {
    return {
      username: 'Luca SARDELLITTI',
      userEmail: 'luca.sardellit.1995@gmail.com',
      items: [
        { title: 'Mes groupes', icon: 'folder.png', link: '/my_groups' },
      ],
    };
  },
  methods: {
    // Logout user
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      this.$router.push({ path: '/login' });
    },
  },
};
</script>

<style scoped>
  .menu{
    /*height: calc(100vh - 100px);*/
    height: 100vh;
    background-color:rgba(255, 255, 255, 0.1) !important;
  }
  /*#presentation{*/
  /*  display: flex;*/
  /*}*/
  #presentation_content{
    margin: auto;
    background-color: transparent;
  }
  #presentation_content p{
    margin-left: 20px;
    color: white;
  }
  .active{
    background-color: rgba( 255, 255, 255, 0.1);
  }
  .action_menu{
    position: relative;
  }
  .action_menu,
  .logout_action{
    background-color: transparent !important;
  }
  .logout_action{
    position: absolute;
    bottom: 0;
    width: -moz-available;

  }
  .link_action_menu:hover{
    background-color: rgba( 229, 119, 80, 0.4) !important;
  }
  .menu_action_text{
    color: white;
  }
  .menu_action_text a{
    text-decoration: none;
  }
  .logo_content{
    width: 15%;
    position: absolute;
    bottom: 40px;
    left: 0;
  }
  .logo_ynov{
    width: 125px;
    margin: auto;
  }
</style>
