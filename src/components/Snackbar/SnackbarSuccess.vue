<template>
  <v-snackbar
    v-model="snackbar"
    :timeout="timeout"
    absolute
    bottom
    :color="color"
    text
    elevation="24"
    class="mb-5"
  >
    {{ message }}

    <template v-slot:action="{ attrs }">
      <v-btn
        :color="color"
        text
        v-bind="attrs"
        @click="snackbar = false"
      >
        Fermer
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: 'SnackbarSuccess',
  props: ['message', 'color'],
  data: () => ({
    snackbar: false,
    timeout: 3000,
  }),
  mounted() {
    this.$root.$on('SnackbarSuccess', () => {
      this.snackbar = true;
    });
  },
};
</script>

<style scoped>

</style>
