<template>
  <v-card max-width="220">
    <v-list dense>
      <v-list-item-group>
        <v-list-item
          @click="showWidgets"
          class="d-flex flex-row justify-center"
        >
          <v-list-item-icon color="grey">
            <v-icon>visibility</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title> Show </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="renameItem">
          <v-list-item-icon>
            <v-icon>edit</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title> Rename </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="mx-4"></v-divider>
        <v-list-item @click="makeCopyItem">
          <v-list-item-icon>
            <v-icon>content_copy</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title> Make a copy </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="scheduleList">
          <v-list-item-icon>
            <v-badge color="red" content="6" overlap dot>
              <v-icon>email</v-icon>
            </v-badge>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title> Schedule </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="deleteItem">
          <v-list-item-icon>
            <v-icon>delete </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title> Remove </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>
<script>
export default {
  props: ['open'],

  methods: {
    showWidgets() {
      this.$emit('onShow');
    },
    renameItem() {
      this.$emit('onRename', { active: false, action: 'Rename' });
    },
    makeCopyItem() {
      this.$emit('onCopy', { active: true, action: 'Copy' });
    },
    scheduleList() {
      this.$emit('onScheduleList');
    },
    deleteItem() {
      this.$emit('onDelete');
    }
  }
};
</script>
