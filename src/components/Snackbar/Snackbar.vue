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
  name: 'Snackbar',
  data: () => ({
    snackbar: false,
    color: '',
    message: '',
    timeout: 3000,
  }),
  mounted() {
    this.$root.$on('Snackbar', snackbarInfo => {
      this.snackbar = true;
      this.color = snackbarInfo.type
      this.message = snackbarInfo.message
    });
  },
};
</script>

<style scoped>

</style>
