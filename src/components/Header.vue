<template>
  <v-app-bar app clipped-right>
    <v-app-bar-nav-icon @click="toggleLeftDrawer"></v-app-bar-nav-icon>
    <v-spacer></v-spacer>
    <v-menu v-model="menu" :close-on-content-click="false" max-width="300">
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-bind="attrs"
          v-on="on"
          hide-details
          dense
          flat
          solo
          background-color="#f5f5f5"
          :value="formatDate"
          class="shrink centered-input"
        ></v-text-field>
      </template>
      <v-date-picker
        full-width
        :value="date"
        @change="hidePicker"
      ></v-date-picker>
    </v-menu>
    <v-spacer></v-spacer>

    <v-btn depressed fab @click="changeDashboardView" class="d-none d-sm-block">
      <v-icon>view_module</v-icon>
    </v-btn>

    <v-btn depressed fab @click="toggleMessageDrawer">
      <v-badge
        color="red"
        :content="messages.length"
        overlap
        v-if="messages.length"
      >
        <v-icon>mail</v-icon>
      </v-badge>

      <v-icon v-else>mail</v-icon>
    </v-btn>

    <v-btn depressed fab @click="toggleRightDrawer">
      <v-icon>person</v-icon>
    </v-btn>
  </v-app-bar>
</template>
<script>
import moment from 'moment';

export default {
  name: 'Header',
  data() {
    return {
      menu: false,
      showDashboardList: false
    };
  },
  computed: {
    date() {
      return this.$store.state.app.date;
    },
    formatDate() {
      return this.date ? moment(this.date).format('ddd, MMM Do YYYY') : '';
    },
    messages() {
      return this.$store.state.alerts.message.filter(
        (item) => item.read === false
      );
    }
  },

  methods: {
    sendDate(event) {
      return this.$store.dispatch('app/setDate', event);
    },
    changeDashboardView() {
      return this.$store.dispatch('app/changeDashboardView');
    },
    hidePicker(event) {
      this.menu = false;
      this.sendDate(event);
    },
    toggleDashboardList() {
      this.showDashboardList = !this.showDashboardList;
    },
    toggleLeftDrawer() {
      this.$emit('onLeftDrawerToggle');
    },
    toggleMessageDrawer() {
      this.$emit('onMessageDrawerToggle');
    },
    toggleRightDrawer() {
      this.$emit('onRightDrawerToggle');
    }
  },
  watch: {
    date() {
      if (this.$route.params.id) {
        return this.$store.dispatch(
          'dashboard/fetchWidgets',
          this.$route.params.id
        );
      }
      if (this.$route.path === '/jobs') {
        console.log(this.$route.path, 'path');
        return this.$store.dispatch('job/fetchJobs', {
          page: 1
        });
      }
    }
  }
};
</script>

<style scoped>
.centered-input >>> input {
  text-align: center;
}
</style>
