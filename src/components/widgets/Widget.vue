<template>
  <v-card flat class="flip-container pa-0">
    <v-card flat>
      <v-card :class="flipType">
        <v-card
          flat
          v-for="(item, i) in widgetType"
          :key="i"
          class="d-flex align-center justify-center"
          min-width="100%"
          :class="item"
          @click="setWidget(widget.id, widget.dashboardId, widget.type)"
        >
          <v-menu top :offset-x="false">
            <template v-slot:activator="{ on, attrs }">
              <v-card
                elevation="5"
                class="d-flex flex-column justify-space-between"
                min-width="100%"
                height="250"
                :color="styleThreshold.color"
              >
                <v-card-actions
                  class="d-flex align-center justify-space-between"
                  min-width="100%"
                >
                  <div class="font-weight-light">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on"> mdi-key </v-icon>
                      </template>
                      <span>{{ widget.key }}</span>
                    </v-tooltip>
                  </div>

                  <div>
                    {{ widget.name }}
                  </div>

                  <div v-bind="attrs" v-on="on">
                    <v-icon> menu </v-icon>
                  </div>
                </v-card-actions>

                <v-card-actions v-if="widget.type === 'Base'" class="cardValue">
                  {{ baseValue.value }}
                  <span class="valueType">{{
                    baseValue.valueType !== 'number' ? baseValue.valueType : ''
                  }}</span>
                </v-card-actions>
                <div v-else-if="widget.type === 'Chart'">
                  <apexcharts
                    height="100%"
                    width="100%"
                    type="bar"
                    :options="chartOptions"
                    :series="series"
                  ></apexcharts>
                </div>
                <v-card-actions
                  class="d-flex align-center justify-space-between py-2"
                >
                  <div>
                    <div>
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on"> info </v-icon>
                        </template>

                        <div>
                          <h3 class="mb-4">Treshold info</h3>
                          <p>
                            Color:
                            <v-btn
                              fab
                              class="color-point"
                              :color="widgetDefaultStyle.color"
                            ></v-btn>
                          </p>

                          <p>Min: {{ widgetDefaultStyle.minValue }}</p>
                          <p>Max: {{ widgetDefaultStyle.maxValue }}</p>
                          <p>Label: {{ widgetDefaultStyle.label }}</p>
                        </div>
                      </v-tooltip>
                    </div>
                  </div>
                  <div class="font-weight-light">{{ dateCreate }}</div>
                </v-card-actions>
              </v-card>
            </template>

            <Threshold :widget="data" v-on:onOpen="toggleButton" />
          </v-menu>

          <ThresholdListModal
            :open="openThresholdModal"
            @onCloseThresholdList="toggleButton"
            :widget="data"
          />
        </v-card>
      </v-card>
    </v-card>
  </v-card>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';
import Threshold from '../thresholds/ThreshholdMenu.vue';
import ThresholdListModal from '../thresholds/ThresholdListModal';
import moment from 'moment';

const getDefaultState = () => ({
  widget: {
    data: [],
    thresholds: []
  },
  openThresholdModal: false,

  widgetDefaultStyle: {
    color: 'blue-grey lighten-4',
    minValue: 'min',
    maxValue: 'max',
    label: 'default'
  },
  widgetType: ['front', 'back'],
  chartOptions: {
    chart: {
      id: 'vuechart-example',
      offsetX: -5,
      offsetY: 10,
      toolbar: {
        show: false
      }
    },
    colors: [],
    xaxis: {
      type: 'category',
      categories: []
      // labels: {
      //   show: false
      // }
    },
    yaxis: {
      tickAmount: []
    },
    series: [
      {
        data: []
      }
    ]
  },
  subtitle: {
    text: 'text',
    offsetX: 5,
    offsetY: -5,
    floating: false,
    style: {
      fontSize: '14px'
    }
  },
  labels: [],
  series: [
    {
      name: 'value'
    }
  ]
});

export default {
  name: 'Widget',
  props: ['data'],

  data: () => getDefaultState(),

  beforeMount() {
    this.$data.widget = this.$props.data;

    this.$data.series[0].data = this.$props.data.data
      .reverse()
      .map((item) => item.value);


    this.$data.chartOptions.xaxis.categories = this.$data.widget.data.map(
      (item) => ''
    );

    this.$data.widget.data.map((item) => item.date);

    const thresholds = this.$data.widget.thresholds;

    const min = thresholds.map((item) => item.minValue);
    const max = thresholds.map((item) => item.maxValue);
    const color = thresholds.map((item) => item.color);

    this.$data.chartOptions.colors.push(function ({ value }) {
      for (let i = 0; i <= min.length; i++) {
        if (value >= min[i] && value <= max[i]) return color[i];
      }
      return '#000000';
    });
  },

  methods: {
    toggleButton() {
      this.$data.openThresholdModal = !this.$data.openThresholdModal;
    },
    setWidget(id, dashboardId, type) {
      const setType = type === 'Base' ? 'Chart' : 'Base';

      this.$data.widget.type = setType;

      this.$store.dispatch('widgets/setWidget', {
        id: id,
        dashboardId: dashboardId,
        type: setType
      });
      this.$data.currentId = id;
    }
  },
  components: {
    apexcharts: VueApexCharts,
    Threshold,
    ThresholdListModal
  },

  computed: {
    baseValue() {
      const valueArr = this.$data.widget.data;
      return valueArr[valueArr.length - 1];
    },

    dateCreate() {
      const valueArr = this.$data.widget.data;

      return moment(valueArr[valueArr.length - 1].date).format('L');
    },

    flipType() {
      if (this.$data.widget.type === 'Base') {
        return 'flipper-chart';
      } else if (this.$data.widget.type === 'Chart') {
        return 'flipper-base';
      }
    },

    styleThreshold() {
      const valueArr = this.$data.widget.data;

      const value = valueArr[valueArr.length - 1].value;

      if (this.$data.widget.thresholds.length > 0) {
        const result = this.$data.widget.thresholds.filter(
          (item) => item.minValue <= value && value <= item.maxValue
        );
        result.length > 0
          ? (this.$data.widgetDefaultStyle = result[0])
          : this.$data.widgetDefaultStyle;
        if (this.$data.widget.type === 'Chart') {
          return getDefaultState().widgetDefaultStyle;
        }
      }
      return this.$data.widgetDefaultStyle;
    }
  }
};
</script>

<style scoped>
.cardValue {
  display: flex;
  align-items: baseline;
  justify-content: center;
  font-weight: 300;
  font-size: 90px;
}

.cardValue .valueType {
  font-size: 60px;
}

.flip-container {
  min-width: 290px;
  max-width: 400px;
  height: 260px;
  flex: 1;
}

.flipper-base {
  transition: all 0.5s ease;
  transform-style: preserve-3d;
  position: relative;
  transform: rotateY(180deg);
}

.flipper-chart {
  transition: all 0.5s ease;
  transform-style: preserve-3d;
  position: relative;
  transform: rotateY(0deg);
}

.front,
.back {
  backface-visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
}

.front {
  z-index: 2;
  transform: rotateY(180deg);
}

.back {
  transform: rotateY(0deg);
}

.color-point {
  margin-left: 5px;
  height: 13px;
  width: 13px;
}
</style>
