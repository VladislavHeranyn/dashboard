<template>
  <v-card max-width="100%">
    <v-list max-width="100%">
      <v-list-item-group>
        <v-list-item @click="openWidgetDetail">
          <v-list-item-icon>
            <v-icon>info</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title> Detail</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="openModal">
          <v-list-item-icon>
            <v-icon>warning</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title> Threshold</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="deleteWidget">
          <v-list-item-icon>
            <v-icon>delete</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title> Remove</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>
import ThresholdListModal from './ThresholdListModal';

export default {
  props: ['widget'],
  components: { ThresholdListModal },
  data() {
    return {
      showThresholdList: false
    };
  },
  methods: {
    openModal() {
      this.$emit('onOpen');
      this.$store.dispatch('threshold/fetchThresholds', {
        dashboardId: this.$props.widget.dashboardId,
        widgetId: this.$props.widget.id
      });
    },

      deleteWidget() {
      this.$store.dispatch('dashboard/deleteWidget', {
        dashboardId: this.$props.widget.dashboardId,
        widgetId: this.$props.widget.id
      });
    },

    openWidgetDetail() {
      this.$router.push(`${this.$route.path}/widget/${this.$props.widget.id}`);
    }
  }
};
</script>
