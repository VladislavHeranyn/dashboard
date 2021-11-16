<template>
  <v-row justify="space-around">
    <v-col cols="auto">
      <v-dialog
        transition="dialog-top-transition"
        max-width="600"
        :value="open"
      >
        <template v-slot:default="dialog">
          <v-card>
            <v-toolbar color="primary" dark
              >Schedule email notification</v-toolbar
            >
            <v-card-text>
              <div class="text-h2 pa-12">Hello world!</div>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn text @click="dialog.value = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'DashboardSchedule',
  props: ['open']
};
</script>

<style scoped></style>
