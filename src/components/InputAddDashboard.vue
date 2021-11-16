<template>
  <v-dialog :value="open" @input="closeInputField" max-width="400">
    <v-card>
      <v-card-title class="text-h5 grey lighten-2">
        {{ action }} dashboard
      </v-card-title>
      <v-card-text class="px-4 py-1">
        <v-form>
          <v-text-field
            v-model="form.name"
            @input="setInput"
            label="Name"
            :rules="[(v) => !!v || 'Please enter name']"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="closeInputField" class="mr-4"> Close </v-btn>

        <v-btn color="primary" :disabled="disabledButton" @click="addItem">
          Add
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
const getDefaultState = () => ({
  form: {
    name: ''
  }
});

export default {
  props: ['open', 'dashboardName', 'action'],

  data() {
    return getDefaultState();
  },

  watch: {
    dashboardName() {
      this.form.name = this.$props.dashboardName;
    }
  },

  computed: {
    disabledButton() {
      return this.$props.dashboardName.trim() ? false : true;
    }
  },

  methods: {
    setInput() {
      this.$emit('onSetInput', this.form.name);
    },

    addItem() {
      this.$emit('onAddItem');
    },

    closeInputField() {
      this.$emit('onCloseInput');
    }
  }
};
</script>
