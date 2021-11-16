<template>
  <v-navigation-drawer
    :value="open"
    @input="handleDrawerChange($event)"
    right
    app
    clipped
    temporary
    width="300"
    v-if="messages.length"
  >
    <v-list-item class='d-flex justify-space-between'>
      <v-list-item-title class='text-h5'>Alerts</v-list-item-title>
      <v-btn text @click='closeAlert'>Close</v-btn>
    </v-list-item>
    <v-divider></v-divider>

    <v-list class="pa-0">
      <div v-for="(message, i) in messages" :key="i" class="pa-0">
        <Alert :message="message" />
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import Alert from '../alert/Alert';

export default {
  name: 'AlertDrawer',
  props: ['open'],
  computed: {
    messages() {
      return this.$store.state.alerts.message;
    }
  },
  methods: {
    handleDrawerChange(isOpened) {
      this.$emit('onChange', isOpened);

    },
    closeAlert() {
      this.$emit('onCloseAlert');

    }
  },
  components: {
    Alert
  }
};
</script>
