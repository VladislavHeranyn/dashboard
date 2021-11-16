<template>
  <v-card
    class="
      d-flex
      flex-sm-row flex-column
      justify-space-between
      align-center
      pa-1
      px-sm-5
      py-sm-3
      my-1 my-sm-3
    "
    width="100%"
  >
    <v-list-item-title class="mt-3 mt-sm-0 mr-0 mr-sm-8"
      >...{{ title }}</v-list-item-title
    >
    <v-list-item-group class="d-flex flex-row justify-center align-center">
      <v-list-item-icon class="mr-3 mr-sm-5"
        ><v-btn
          rounded
          depressed
          fab
          small
          @click="handleEdit"
          color="orange lighten-3"
          ><v-icon color="white">edit</v-icon></v-btn
        ></v-list-item-icon
      >
      <v-list-item-icon class="mx-0"
        ><v-btn
          rounded
          depressed
          fab
          small
          @click="handleDelete"
          color="red lighten-2"
          ><v-icon color="white">delete</v-icon></v-btn
        ></v-list-item-icon
      >
    </v-list-item-group>
  </v-card>
</template>

<script>
import cronstrue from 'cronstrue';

export default {
  name: 'SchedulerListItem',
  data() {
    return {
      open: false
    };
  },
  props: {
    scheduler: Object
  },
  computed: {
    title() {
      const parsedRule = cronstrue.toString(this.$props.scheduler.rule);
      return (
        parsedRule[0].toLowerCase() +
        parsedRule.slice(1, 9) +
        parsedRule.slice(9, 11).toLowerCase() +
        parsedRule.slice(11)
      );
    }
  },
  methods: {
    handleEdit() {
      this.$emit('onDialogOpen', {
        action: 'Edit',
        schedulerId: this.$props.scheduler.id
      });
    },
    handleDelete() {
      this.$store.dispatch('scheduler/deleteScheduler', this.scheduler);
    }
  }
};
</script>
