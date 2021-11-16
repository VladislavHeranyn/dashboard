<template>
  <v-navigation-drawer
    :value="open"
    @input="handleDrawerChange($event)"
    right
    app
    clipped
    temporary
  >
    <v-list-item>
      <v-list-item-avatar>
        <v-img :src="img"></v-img>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>{{ name }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <v-list>
      <div v-for="item in items" :key="item.title">
        <v-list-item @click="item.onClick" v-if="item.type === 'button'" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <router-link v-else :to="item.to">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>
      </div>
    </v-list>
    <template v-slot:append>
      <div class="pa-2">
        <v-btn block color="pink lighten-2" dark @click="logout">
          Logout
        </v-btn>
      </div>
    </template>
    <ScheduleDialog
      :open="dialog"
      action="Add"
      @onDialogChange="handleDialogChange($event)"
    />
  </v-navigation-drawer>
</template>
<script>
import router from '../../mixins/router';
import ScheduleDialog from '../schedulers/ScheduleDialog';
export default {
  name: 'RightDrawer',
  props: ['open'],
  mixins: [router],
  computed: {
    img: function () {
      return this.$store.state.auth.img;
    },
    name: function () {
      return this.$store.state.auth.name;
    }
  },
  data() {
    return {
      dialog: false,
      items: [
        {
          title: 'Employee',
          type: 'route',
          icon: 'mdi-account-group',
          to: '/employee'
        },
        {
          title: 'Company',
          type: 'route',
          icon: 'mdi-briefcase-account ',
          to: '/company'
        },
        { title: 'Jobs', type: 'route', icon: 'mdi-table', to: '/jobs' }
      ]
    };
  },
  methods: {
    handleDrawerChange(isOpened) {
      this.$emit('onChange', isOpened);
    },
    handleDialogChange(action = '') {
      if (action === 'Add') {
        console.log('adding item');
      }
      this.dialog = false;
    },
    openDialog() {
      this.dialog = true;
    },
    async logout() {
      await this.$store.dispatch('auth/logout');
      this.redirect('/login');
    }
  },
  components: {
    ScheduleDialog
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
