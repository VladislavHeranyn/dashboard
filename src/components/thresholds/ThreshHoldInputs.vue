<template>
  <v-dialog :value="open" @input="closeInputThreshold" max-width="400">
    <v-card>
      <v-card-title class="text-h5 grey lighten-2">
        Apply Threshold
      </v-card-title>

      <v-card-text class="pa-4">
        <v-text-field
          v-model.number="$data.form.minValue"
          type="number"
          label="MinValue"
          dense
          hide-details
        ></v-text-field>
        <span
          class="message-alert"
          v-if="submitted && !$v.form.minValue.required"
          >Min value is Required</span
        >

        <v-text-field
          v-model.number="$data.form.maxValue"
          type="number"
          label="MaxValue"
          dense
          hide-details
          class="mt-5"
        ></v-text-field>
        <span
          class="message-alert"
          v-if="submitted && !$v.form.maxValue.required"
          >Max value is Required</span
        >

        <v-card width="100%" class="d-flex justify-center mt-3" elevation="0">
          <v-color-picker
            v-model="$data.form.color"
            show-swatches
            hide-inputs
            hide-canvas
            swatches-max-height="150"
          ></v-color-picker>
        </v-card>

        <v-text-field
          v-model="$data.form.label"
          label="Label"
          hide-details
          dense
          class="mt-5"
        ></v-text-field>
        <span class="message-alert" v-if="submitted && !$v.form.label.required"
          >Label is Required</span
        >
        <span class="message-alert" v-if="submitted && !$v.form.label.minLength"
          >Label must have at least 3 letters</span
        >

        <v-card-actions class="d-flex justify-end">
          <v-btn text @click="closeInputThreshold"> Close</v-btn>
          <v-btn color="primary" @click="saveInputThreshold"> Submit</v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
const getDefaultState = () => ({
  minValue: '',
  maxValue: '',
  color: '',
  label: ''
});

import { required, minLength } from 'vuelidate/lib/validators';

export default {
  validations: {
    form: {
      minValue: { required },
      maxValue: { required },
      label: { required, minLength: minLength(3) }
    }
  },
  props: ['open', 'widget', 'threshold', 'id'],
  data: () => ({
    form: getDefaultState(),
    submitted: false
  }),
  methods: {
    closeInputThreshold() {
      this.$emit('onCloseInputThreshold');
    },
    saveInputThreshold() {
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) return;

      this.$emit('onCloseInputThreshold');
      this.$emit('onDialogChange', { threshold: this.$data.form });

      if (!this.$props.id) {
        this.$data.form = getDefaultState();
      }
      this.submitted = false;
    }
  },
  watch: {
    id() {
      if (!this.$props.id) {
        this.$data.form = getDefaultState();
      }
      let currentThreshold = this.$props.threshold.filter(
        (item) => item.id === this.$props.id
      );
      if (currentThreshold.length) {
        this.$data.form = {
          minValue: currentThreshold[0].minValue,
          maxValue: currentThreshold[0].maxValue,
          color: currentThreshold[0].color,
          label: currentThreshold[0].label
        };
      }
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
