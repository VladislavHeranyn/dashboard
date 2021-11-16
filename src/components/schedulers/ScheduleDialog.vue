<template>
  <v-dialog
    :value="open"
    @input="handleClick('close')"
    class="text-center"
    width="600"
  >
    <v-card>
      <v-card-title class="text-h5 grey lighten-2">
        Schedule email notification
      </v-card-title>
      <v-card-text class="pa-4">
        <div class="ma-2 mb-3">This dashboard will be sent you regularly</div>
        <v-form>
          <v-text-field
            v-model="interval"
            label="Every"
            outlined
            type="number"
            v-if="intervalType === 'Day'"
            hide-details
            class="mt-5"
          ></v-text-field>
          <span
            class="message-alert"
            v-if="submitted && (!$v.interval.minValue || !$v.interval.maxValue)"
            >Select day from 1 to 31</span
          >
          <v-select
            v-model="intervalType"
            :items="every"
            label="Interval"
            outlined
            hide-details
            class="mt-5"
          ></v-select>
          <v-select
            v-model="day"
            :items="on"
            label="On"
            outlined
            v-if="intervalType === 'Week'"
            hide-details
            class="mt-5"
          ></v-select>
        </v-form>

        <span v-if="errorIsShown" class="message-alert"
          >Fill the required fields!</span
        >
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="handleClick('close')">Close</v-btn>
        <v-btn color="primary lighten-2" @click="handleClick(action)"
          >{{ action }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import cronTime from 'cron-time-generator';
import { minValue, maxValue } from 'vuelidate/lib/validators';

export default {
  validations: {
    interval: { minValue: minValue(1), maxValue: maxValue(31) }
  },
  name: 'ScheduleDialog',
  props: ['open', 'action'],
  data() {
    return {
      interval: '',
      intervalType: '',
      day: '',
      every: ['Day', 'Week', 'Month'],
      on: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      errorIsShown: false,
      submitted: false
    };
  },
  methods: {
    handleClick(action = '') {
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) return;

      let rule;
      if (action !== 'close' && this.formIsValid()) {
        if (this.intervalType === 'Day') {
          this.$v.interval.required = true;

          rule = cronTime.every(parseInt(this.interval)).days();
        } else if (this.intervalType === 'Week') {
          rule = cronTime.everyWeekAt(
            this.on.findIndex((day) => day === this.day) + 1
          );
        } else if (this.intervalType === 'Month') {
          rule = cronTime.everyMonth();
        }
        this.interval = this.intervalType = this.day = this.errorIsShown = '';
        this.$emit('onDialogChange', { action, rule });
      } else if (action === 'close') {
        this.interval = this.intervalType = this.day = this.errorIsShown = '';
        this.$emit('onDialogChange', { action, rule });
      } else {
        this.errorIsShown = true;
      }
      console.log(this.$v);

      this.submitted = false;
    },
    formIsValid() {
      return (
        (this.intervalType === 'Day' && this.interval) ||
        (this.intervalType === 'Week' && this.day) ||
        this.intervalType === 'Month'
      );
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
