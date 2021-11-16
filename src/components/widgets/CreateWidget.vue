<template>
  <v-dialog transition="dialog-top-transition" max-width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="ma-2"
        fab
        dark
        small
        v-bind="attrs"
        v-on="on"
        color="primary"
      >
        <v-icon dark> mdi-plus</v-icon>
      </v-btn>
    </template>

    <template v-slot:default="dialog" @submit.prevent>
      <v-card>
        <v-toolbar color="primary" dark>Create Widget</v-toolbar>
        <v-col class="d-flex flex-column" cols="12">
          <v-select
            :items="keys"
            filled
            label="Widget key"
            dense
            hide-details
            v-model="$data.form.key"
          ></v-select>
          <span class="message-alert" v-if="submitted && !$v.form.key.required"
            >Key is Required</span
          >
          <v-text-field
            v-model="$data.form.name"
            label="Widget title"
            filled
            hide-details
            class="mt-4"
          ></v-text-field>
          <span class="message-alert" v-if="submitted && !$v.form.name.required"
            >Label is Required</span
          >
        </v-col>
        <v-card-actions class="justify-end">
          <v-btn text @click="dialog.value = false">Close</v-btn>
          <v-btn v-if="$v.$invalid" color="primary" @click="createWidget"
            >Submit
          </v-btn>
          <v-btn
            v-else
            color="primary"
            @click="createWidget"
            @click.stop="dialog.value = false"
            >Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
const getDefaultForm = () => ({
  key: '',
  name: ''
});
import { required } from 'vuelidate/lib/validators';

export default {
  validations: {
    form: {
      key: { required },
      name: { required }
    }
  },
  data: () => ({
    form: getDefaultForm(),
    submitted: false
  }),
  created() {
    this.$store.dispatch('widgets/fetchKeys');
  },
  methods: {
    createWidget() {
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) return;

      const widget = this.$data.form;
      this.$store.dispatch('dashboard/addWidget', {
        dashboardId: this.$route.params.id,
        widget
      });
      this.$data.form = getDefaultForm();
      this.submitted = false;
    }
  },
  computed: {
    keys() {
      return this.$store.state.widgets.keys;
    }
  }
};
</script>

<style>
.message-alert {
  font-size: 12px;
  color: red;
}
</style>
