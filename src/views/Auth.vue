<template>
  <div class="auth_view">
    <div v-if="this.$route.name === 'Login'">
      <Login/>
    </div>
    <div v-else-if="this.$route.name === 'Register'">
      <Register/>
    </div>
  </div>
</template>

<script>
import HeaderBanner from '@/components/Banner/HeaderBanner.vue';
import Login from '@/components/Auth/Login.vue';
import Register from '@/components/Auth/Register.vue';

export default {
  name: 'Auth',
  components: {
    HeaderBanner,
    Login,
    Register,
  },
};
</script>

<style scoped>

</style>
