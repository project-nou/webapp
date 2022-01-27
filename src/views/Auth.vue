<template>
  <div class="auth_view">
    <HeaderBanner/>
    <div v-if="this.$route.query.page = '/login'" class="">
      <Login/>
    </div>
    <div v-else-if="this.$route.query.page = '/register'" class="">
      <h1>Register page</h1>
    </div>
  </div>
</template>

<script>
import HeaderBanner from '@/components/Banner/HeaderBanner.vue';
import Login from '@/components/Auth/Login.vue';

export default {
  name: 'Auth',
  components: {
    HeaderBanner,
    Login,
  },
  created() {
    this.getUrl();
  },
  methods: {
    getUrl() {
      console.log(this.$route.path);
    },
  },
};
</script>

<style scoped>

</style>
