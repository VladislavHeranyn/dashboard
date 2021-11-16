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
            flex-row
            justify-space-between
            align-center
          "
        >
          {{ $props.widget.name }}
          <v-btn
            rounded
            depressed
            fab
            small
            @click="handleDialogOpen({ action: 'Add', thresholdId: null })"
            color="primary"
          >
            <v-icon color="white">mdi-plus</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-list
            v-if="!loading"
            class="d-flex flex-column justify-start align-center py-5"
          >
            <div
              v-if="!thresholds.length"
              class="d-flex justify-center align-center"
            >
              No thresholds yet!
            </div>

            <v-list-item v-for="threshold in thresholds" :key="threshold.id">
              <ThresholdListItem
                :threshold="threshold"
                @onDialogOpen="handleDialogOpen($event)"
              />
            </v-list-item>
          </v-list>
          <div v-else-if="loading" class="d-flex justify-center align-center">
            <Spinner />
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <ThreshHoldInputs
      :open="dialog"
      :action="action"
      :widget="widget"
      :threshold="thresholds"
      :id="thresholdId"
      @onCloseInputThreshold="dialog = false"
      @onDialogChange="handleDialogChange($event)"
    />
  </div>
</template>

<script>
import Spinner from '../addons/Spinner.vue';
import ThreshHoldInputs from './ThreshHoldInputs';
import ThresholdListItem from './ThresholdListItem';

export default {
  name: 'ThresholdListModal',
  components: {
    ThreshHoldInputs,
    Spinner,
    ThresholdListItem
  },
  data() {
    return {
      dialog: false,
      action: '',
      thresholdId: null
    };
  },
  props: {
    open: Boolean,
    widget: Object
  },
  computed: {
    thresholds() {
      return this.$store.state.threshold.thresholds;
    },
    loading() {
      return this.$store.state.threshold.loading;
    }
  },

  methods: {
    async handleDialogChange({ threshold }) {
      if (this.$data.action === 'Add') {
        await this.$store.dispatch('threshold/addThreshold', {
          dashboardId: this.$props.widget.dashboardId,
          widgetId: this.$props.widget.id,
          threshold
        });
      } else if (this.$data.action === 'Edit') {
        await this.$store.dispatch('threshold/editThreshold', {
          dashboardId: this.$props.widget.dashboardId,
          widgetId: this.$props.widget.id,
          thresholdId: this.$data.thresholdId,
          newThreshold: threshold
        });
      }
      await this.$store.dispatch(
        'dashboard/fetchWidgets',
        this.$route.params.id
      );
      this.$data.dialog = false;
    },
    handleDialogOpen({ action, thresholdId }) {
      this.$data.thresholdId = thresholdId;
      this.$data.action = action;
      this.$data.dialog = true;
    },

    handleClose() {
      this.$emit('onCloseThresholdList');
    }
  }
};
</script>
