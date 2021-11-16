<template>
  <div @mouseover="checkMessage(message)">
    <v-alert
      class="mb-1"
      :class="readingMessage"
      border="left"
      elevation="2"
      colored-border
      :type="setColorMessage"
    >
      <div class="d-flex align-center">
        <div class="mr-5">
          <div class="pa-0">{{ message.text }}</div>
          <a :href="message.url">{{ urlLength }}</a>
        </div>

        <v-btn
          @click="removeAlert(message)"
          elevation="2"
          :color="setColorMessage"
          fab
          x-small
        >
          <v-icon>mdi-window-close</v-icon>
        </v-btn>
      </div>
    </v-alert>
  </div>
</template>

<script>
export default {
  name: 'Alert',
  props: ['message'],
  mounted() {
    // console.log(this.$props.message);
  },
  computed: {
    setColorMessage() {
      if (this.$props.message.type === 'error') {
        return 'error';
      } else if (this.$props.message.type === 'info') {
        return 'warning';
      }
    },
    readingMessage() {
      return this.$props.message.read ? 'blue-grey lighten-4' : '';
    },

    urlLength() {
      const url = this.$props.message.url;
      if (url.length > 20) {
        return url.slice(0, 20) + '...';
      } else {
        return url.text;
      }
    }
  },
  methods: {
    removeAlert(message) {
      this.$store.dispatch('alerts/deleteAlert', message);
    },
    checkMessage(message) {
      if (!message.read) {
        this.$store.dispatch('alerts/checkMessage', message);
      }
    }
  }
};
</script>


