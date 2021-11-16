<template>
  <v-container fluid class="pa-0">
    <CreateWidget />
    <draggable
      v-if="!loading && widgets.length"
      v-model="widgets"
      v-bind="dragOptions"
      drag-class="draggable-ghost"
      class="d-flex align-center justify-start flex-wrap pa-0"
      @end="rememberWidgetPositions(widgets)"
    >
      <v-col
        v-for="widget in widgets"
        :key="widget.id"
        :class="dashboardView"
        class="pa-0 pa-sm-3"
      >
        <Widget :data="widget" />
      </v-col>
    </draggable>
    <div v-if="loading" class="spinner">
      <Spinner />
    </div>
  </v-container>
</template>

<script>
import constants from '../constants';
import CreateWidget from '../components/widgets/CreateWidget';
import Widget from '../components/widgets/Widget';
import Spinner from '../components/addons/Spinner.vue';
import draggable from 'vuedraggable';

export default {
  name: 'Dashboard',
  data() {
    return {
      cardOne: true,
      showCardBack: false,
      currentId: null
    };
  },
  components: {
    Widget,
    CreateWidget,
    Spinner,
    draggable
  },
  methods: {
    rememberWidgetPositions(widgets) {
      const indexWidget = widgets.map((item) => item.id);
      this.$store.dispatch('dashboard/rememberWidgetPositions', {
        dashboardId: this.$route.params.id,
        indexWidget
      });
    }
  },

  computed: {
    widgets: {
      get() {
        return (
          this.$store.getters['dashboard/getWidgets'](this.$route.params.id) ||
          []
        );
      },
      set(widgets) {
        this.$store.dispatch('dashboard/setWidgetPositions', {
          dashboardId: this.$route.params.id,
          widgets
        });
      }
    },

    loading() {
      return this.$store.state.dashboard.loading;
    },
    dashboardView() {
      return this.$store.state.app.dashboardView
        ? 'col-12'
        : this.widgets.length >= 4
        ? 'col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 centerWidget'
        : this.widgets.length === 3
        ? 'col-12 col-sm-6 col-md-4 centerWidget'
        : 'col-12 col-sm-6 centerWidget';
    },
    dragOptions() {
      return {
        disabled: false,
        group: 'widgets',
        ghostClass: 'ghost',
        animation: 200
      };
    }
  },
  mounted() {
    if (this.$route.query.token) {
      this.$store.dispatch('dashboard/fetchDataToSend', {
        dashboardId: this.$route.params.id,
        token: this.$route.query.token
      });
    } else {
      window.setInterval(() => {
        if (this.$route.params.id) {
          this.$store.dispatch('dashboard/fetchWidgets', this.$route.params.id);
        }
      }, constants.boardRefreshRate);
    }
  }
};
</script>

<style scoped>
.draggable-ghost {
  opacity: 0;
}

.ghost {
  opacity: 1;
}

.spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 600px;
}

.card {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  min-width: 300px;
  max-width: 400px;
  margin: 10px;
  flex: 1;
}

.centerWidget {
  text-align: -webkit-center;
}
</style>
