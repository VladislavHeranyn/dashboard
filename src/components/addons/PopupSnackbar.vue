<template>
  <div>
    <v-snackbar :value="snackbar.isOpen">
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="closeSnackbar">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: 'PopupSnackbar',
  methods: {
    closeSnackbar() {
      this.$store.dispatch('errors/closeSnackbar');
    }
  },
  computed: {
    snackbar() {
      return this.$store.state.errors;
    }
  }
};
</script>
