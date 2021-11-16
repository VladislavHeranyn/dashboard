<template>
  <div>
    <v-dialog
      v-model="open"
      @click:outside="handleClose"
      scrollabel
      max-width="600px"
    >
      <v-card>
        <v-card-title
          class="
            text-h5
            grey
            lighten-2
            py-5
            d-flex
            flex-column-reverse flex-sm-row
            justify-space-between
            align-center
          "
        >
          Sending this board...
          <v-btn
            rounded
            depressed
            fab
            small
            @click="handleDialogOpen({ action: 'Add', schedulerId: null })"
            color="primary"
            class="mb-2 mb-sm-0"
            ><v-icon color="white">mdi-plus</v-icon></v-btn
          >
        </v-card-title>
        <v-card-text class="px-0">
          <v-list
            v-if="!loading"
            class="
              d-flex
              flex-column
              justify-start
              align-center
              py-3 py-sm-5
              px-0
            "
            min-width="272px"
          >
            <div
              v-if="!schedulers.length"
              class="d-flex justify-center align-center"
            >
              No schedulers yet!
            </div>
            <v-list-item
              v-for="scheduler in schedulers"
              :key="scheduler.id"
              class="pa-0 scheduler"
            >
              <SchedulerListItem
                :scheduler="scheduler"
                @onDialogOpen="handleDialogOpen($event)" /></v-list-item
          ></v-list>
          <div v-else-if="loading" class="d-flex justify-center align-center">
            <Spinner /></div></v-card-text
      ></v-card>
    </v-dialog>
    <ScheduleDialog
      :open="dialog"
      :action="action"
      @onDialogChange="handleDialogChange($event)"
    />
  </div>
</template>

<script>
import SchedulerListItem from './SchedulerListItem.vue';
import ScheduleDialog from './ScheduleDialog.vue';
import Spinner from '../addons/Spinner.vue';

export default {
  name: 'SchedulerListModal',
  components: {
    SchedulerListItem,
    ScheduleDialog,
    Spinner
  },
  data() {
    return { dialog: false, action: '', schedulerId: null };
  },
  props: {
    open: Boolean,
    dashboardId: Number
  },
  computed: {
    schedulers() {
      return this.$store.getters['scheduler/getSchedulers'](this.dashboardId);
    },
    loading() {
      return this.$store.state.scheduler.loading;
    }
  },
  methods: {
    handleDialogChange({ action, rule }) {
      if (action === 'Add') {
        this.$store.dispatch('scheduler/addScheduler', {
          dashboardId: this.$props.dashboardId,
          rule
        });
      } else if (action === 'Edit') {
        this.$store.dispatch('scheduler/editScheduler', {
          dashboardId: this.$props.dashboardId,
          id: this.$data.schedulerId,
          rule
        });
      }
      this.$data.dialog = false;
    },
    handleDialogOpen({ action, schedulerId }) {
      this.$data.schedulerId = schedulerId;
      this.$data.action = action;
      this.$data.dialog = true;
    },
    handleClose() {
      this.$emit('onCloseSchedulerList');
    }
  }
};
</script>

<style scoped>
.scheduler {
  width: 80%;
  min-width: 272px;
}

.v-dialog__content >>> .v-dialog {
  margin: 12px !important;
}
</style>
