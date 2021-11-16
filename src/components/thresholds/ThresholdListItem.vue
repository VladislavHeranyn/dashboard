<template>
  <v-card
    :value="$props.open"
    class="d-flex flex-row justify-space-between align-center px-5 py-3 my-3"
    min-width="450px"
  >
    <v-list-item-content>
      <v-list-item-title
        ><strong>{{ $props.threshold.label }}</strong></v-list-item-title
      >
      <v-list-item-subtitle>
        {{ $props.threshold.minValue }}
        <v-icon>mdi-arrow-right-bold-outline</v-icon>
        {{ $props.threshold.maxValue }}
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-group class="d-flex flex-row justify-center align-center">
      <v-list-item-icon class="mr-3">
        <v-btn
          rounded
          depressed
          fab
          small
          @click="handleEdit"
          color="orange lighten-3"
        >
          <v-icon color="white">edit</v-icon>
        </v-btn>
      </v-list-item-icon>
      <v-list-item-icon>
        <v-btn
          rounded
          depressed
          fab
          small
          @click="handleDelete"
          color="red lighten-2"
        >
          <v-icon color="white">delete</v-icon>
        </v-btn>
      </v-list-item-icon>
    </v-list-item-group>
  </v-card>
</template>

<script>
export default {
  name: 'ThresholdListItem',
  props: {
    open: Boolean,
    threshold: Object
  },
  methods: {
    handleEdit() {
      this.$emit('onDialogOpen', {
        action: 'Edit',
        thresholdId: this.$props.threshold.id,
        threshold: this.$props.threshold
      });
      this.$store.dispatch('dashboard/fetchWidgets', this.$route.params.id);
    },
    async handleDelete() {
      await this.$store.dispatch('threshold/deleteThreshold', {
        dashboardId: this.$route.params.id,
        widgetId: this.$props.threshold.widgetId,
        thresholdId: this.$props.threshold.id
      });
      await this.$store.dispatch(
        'dashboard/fetchWidgets',
        this.$route.params.id
      );
    }
  }
};
</script>
