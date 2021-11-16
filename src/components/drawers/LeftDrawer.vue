<template>
  <v-navigation-drawer
    :value="open"
    left
    temporary
    app
    @input="handleDrawerChange($event)"
    width="220"
  >
    <v-list dense>
      <v-btn @click="showInputFeld" class="ma-2" fab dark small color="primary">
        <v-icon dark> mdi-plus </v-icon>
      </v-btn>

      <v-list-item-group v-model="group" color="primary">
        <v-card
          class="d-flex flex-row justify-space-between align-center px-2"
          v-for="(dashboard, i) in dashboards"
          :key="i"
          :ref="'item' + dashboard.id"
          :class="
            $route.params.id && $route.params.id == dashboard.id
              ? 'primary ma-1'
              : 'ma-1'
          "
          flat
        >
          <Dashboard
            :dashboard="dashboard"
            @onSetItem="setDashboard"
            @onDelete="deleteItem"
            @onRename="setDashboardValue"
            @onCopy="setDashboardValue"
            @onShow="showWidgets"
            @onScheduleList="openScheduleList"
          />
        </v-card>

        <v-divider class="mx-4 my-2"></v-divider>
        <div @click="setPage(item)" v-for="item in items" :key="item.title">
          <v-list-item @click="item.onClick" v-if="item.type === 'button'" link>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <router-link v-else :to="item.to">
            <v-list-item link>
              <v-list-item-content>
                <v-list-item-title class="mx-2">{{
                  item.title
                }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-icon>
                <v-icon class="mx-4">{{ item.icon }}</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </router-link>
        </div>
      </v-list-item-group>
    </v-list>

    <AddDashboard
      :open="showNewItemModal"
      :dashboardName="dashboardName"
      :action="action"
      @onAddItem="addItem"
      @onCloseInput="closeInputFeld"
      @onSetInput="setValue"
    />

    <SchedulerListModal
      :open="showScheduleList"
      :dashboardId="activeItemId"
      v-on:onCloseSchedulerList="closeSchedulerList"
    />
  </v-navigation-drawer>
</template>

<script>
import AddDashboard from '../InputAddDashboard.vue';
import SchedulerListModal from '../schedulers/SchedulerListModal.vue';
import Dashboard from '../dashboard/DashboardList';
import { mapActions } from 'vuex';

const getDefaultState = () => ({
  showNewItemModal: false,
  showScheduleList: false,
  makeCopyDashboard: false,
  action: 'Create',
  activeItem: null,
  dashboardName: '',
  activeItemId: null,
  group: null,
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
    {
      title: 'Jobs',
      type: 'route',
      icon: 'mdi-table',
      to: '/jobs'
    }
  ]
});

export default {
  props: ['open', 'toggleDashboardList'],
  components: {
    AddDashboard,
    SchedulerListModal,
    Dashboard
  },

  data: () => getDefaultState(),

  computed: {
    dashboards() {
      return this.$store.state.dashboard.dashboards;
    }
  },

  methods: {
    ...mapActions('scheduler', ['fetchSchedulers']),
    handleDrawerChange(isOpened) {
      this.$emit('onChange', isOpened);
    },

    setPage(item) {
      if (item.title === 'Jobs') {
        this.$store.dispatch('job/fetchJobs', {
          page: 1
        });
      }
    },
    setDashboard(dashboard) {
      this.$data.activeItem = dashboard;
      this.$data.showNewItemModal = false;
      this.$data.showScheduleList = false;
    },
    onChangeToggleState() {
      this.toggle = !this.toggle;
    },

    addItem() {
      if (this.$data.activeItem && this.$data.makeCopyDashboard) {
        this.$store.dispatch('dashboard/copyDashboard', {
          id: this.activeItem.id,
          name: this.$data.dashboardName,
          openedDashboardId: this.$route.params.id
        });
      } else if (this.$data.activeItem) {
        this.$store.dispatch('dashboard/renameDashboard', {
          id: this.activeItem.id,
          name: this.$data.dashboardName,
          openedDashboardId: this.$route.params.id
        });
      } else {
        this.$store.dispatch('dashboard/addDashboard', {
          name: this.$data.dashboardName,
          openedDashboardId: this.$route.params.id
        });
      }
      this.$data.activeItem = null;
      this.$data.dashboardName = '';
      this.$data.makeCopyDashboard = false;
      this.$data.showNewItemModal = false;
    },

    deleteItem() {
      let openedDashboardId = this.$route.params.id;
      if (this.activeItem.id == this.$route.params.id) {
        this.$router.replace('/');
        openedDashboardId = null;
      }
      this.$store.dispatch('dashboard/deleteDashboard', {
        id: this.activeItem.id,
        openedDashboardId
      });
      this.$data.activeItem = null;
    },

    setDashboardValue(copy) {
      this.$data.action = copy.action;
      this.$data.makeCopyDashboard = copy.active;
      this.$data.dashboardName = this.activeItem.name;
      this.$data.showNewItemModal = true;
    },

    showInputFeld() {
      this.$data.action = getDefaultState().action;
      this.$data.showNewItemModal = !this.$data.showNewItemModal;
      this.$data.activeItem = null;
    },

    closeInputFeld() {
      this.$data.showNewItemModal = false;
      this.$data.dashboardName = '';
    },

    setValue(value) {
      this.$data.dashboardName = value;
    },

    showWidgets() {
      const path = `/dashboard/${this.$data.activeItem.id}`;
      if (this.$route.path != path) {
        this.$router.push(path).catch((err) => {});
      }
      this.$store.dispatch('dashboard/fetchWidgets', this.$data.activeItem.id);
    },

    async openScheduleList() {
      this.$data.activeItemId = this.$data.activeItem.id;
      this.$data.showScheduleList = true;
      this.fetchSchedulers(this.$data.activeItem.id);
    },

    closeSchedulerList() {
      this.$data.showScheduleList = false;
    }
  },

  async created() {
    this.$store.dispatch('dashboard/setLoading', true);
    await this.$store.dispatch('dashboard/fetchDashboards');
    await this.$store.dispatch('alerts/fetchMessages');

    const messaage = () => {
      setTimeout(async () => {
        await this.$store.dispatch('alerts/fetchMessages');
        return messaage();
      }, 15000);
    };

    messaage();

    await this.$store.dispatch('job/fetchJobs', {
      page: this.$store.state.job.page
    });
    if (this.$route.params.id) {
      await this.$store.dispatch(
        'dashboard/fetchWidgets',
        this.$route.params.id
      );
    }
    this.$store.dispatch('dashboard/setLoading', false);
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
