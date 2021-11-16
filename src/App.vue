<template>
  <v-app>
    <template v-if="isLoggedIn">
      <Header
        @onLeftDrawerToggle="handleDrawerToggle('left')"
        @onRightDrawerToggle="handleDrawerToggle('right')"
        @onMessageDrawerToggle="handleDrawerToggle('message')"
      />
      <RightDrawer
        :open="rightDrawer"
        @onChange="handleDrawerChange($event, 'right')"
      />
      <LeftDrawer
        :open="leftDrawer"
        @onChange="handleDrawerChange($event, 'left')"
      />
      <AlertDrawer
        :open="messageDrawer"
        @onChange="handleDrawerChange($event, 'message')"
        @onCloseAlert="closeAlertDrawer"
      />
    </template>

    <v-main>
      <v-container fluid>
        <router-view />
        <popup-snackbar />
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
import router from './mixins/router';
import Header from './components/Header';
import LeftDrawer from './components/drawers/LeftDrawer';
import RightDrawer from './components/drawers/RightDrawer';
import AlertDrawer from './components/drawers/AlertDrawer';
import PopupSnackbar from './components/addons/PopupSnackbar';
export default {
  name: 'App',
  mixins: [router],
  data() {
    return {
      leftDrawer: false,
      rightDrawer: false,
      messageDrawer: false,
      scheduleDialog: false
    };
  },
  beforeCreate() {
    this.$store.dispatch('auth/init');
  },
  computed: {
    isLoggedIn: function () {
      return this.$store.getters['auth/isLogged'];
    }
  },
  methods: {
    handleDrawerToggle(type) {
      if (type === 'left') {
        this.leftDrawer = !this.leftDrawer;
      } else if (type === 'right') {
        this.rightDrawer = !this.rightDrawer;
      } else if (type === 'message') {
        this.messageDrawer = !this.messageDrawer;
      }
    },
    handleDrawerChange(isOpened, type) {
      if (type === 'left') {
        this.leftDrawer = isOpened;
      } else if (type === 'right') {
        this.rightDrawer = isOpened;
      } else if (type === 'message') {
        this.messageDrawer = isOpened;
      }
    },
    closeAlertDrawer() {
      this.messageDrawer = false
    }
  },
  watch: {
    isLoggedIn(curr) {
      if (!curr) {
        this.redirect('/login');
      }
    },
    leftDrawer(curr) {
      if (curr) {
        this.rightDrawer = false;
        this.messageDrawer = false;
      }
    },
    rightDrawer(curr) {
      if (curr) {
        this.leftDrawer = false;
        this.messageDrawer = false;
      }
    },
    messageDrawer(curr) {
      if (curr) {
        this.leftDrawer = false;
        this.rightDrawer = false;
      }
    }
  },
  components: {
    Header,
    LeftDrawer,
    RightDrawer,
    AlertDrawer,
    PopupSnackbar
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Manrope&display=swap');
html {
  scrollbar-width: none;
}

html::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.v-application {
  font-family: 'Manrope', sans-serif;
}
</style>
