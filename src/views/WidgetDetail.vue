<template>
  <v-card
    v-if="series.length"
    class="pa-2 pa-sm-4 pa-md-6 my-8 mx-auto"
    max-height="80vh"
    max-width="90vw"
  >
    <apexcharts
      type="area"
      height="700px"
      :options="chartOptions"
      :series="series"
    ></apexcharts>
  </v-card>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';
import PopupSnackbar from '../components/addons/PopupSnackbar';

export default {
  name: 'WidgetDetail',
  components: {
    PopupSnackbar,
    apexcharts: VueApexCharts
  },
  async mounted() {
    await this.$store.dispatch('widgets/fetchAllWidgetData', {
      dashboardId: this.$route.params.dashboardId,
      widgetId: this.$route.params.widgetId
    });
  },
  computed: {
    series() {
      return this.$store.state.widgets.valuesDetail;
    },

    chartOptions() {
      return {
        chart: {
          height: '100%',
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          },
          animations: {
            easing: 'easein',
            dynamicAnimation: {
              speed: 850
            }
          }
        },
        dataLabels: {
          enabled: false
        },
        title: {
          text: this.$store.state.widgets.data.name,
          style: {
            fontSize: '20px',
            fontFamily: 'monospace'
          }
        },
        subtitle: {
          align: 'right',
          offsetX: -15,
          offsetY: 0,
          text: this.$store.state.widgets.data.key,
          style: {
            fontSize: '16px',
            fontFamily: 'monospace',
            color: '#9699a2'
          }
        },
        xaxis: {
          categories: this.$store.state.widgets.categoriesDetail,
          axisTicks: {
            show: false
          },
          title: {
            text: 'Update time',
            style: {
              color: '#c6c7d0'
            }
          }
        },
        stroke: {
          curve: 'smooth'
        },
        colors: ['#3b3434'],
        fill: {
          colors: ['#48b73b'],
          type: 'gradient',
          gradient: {
            type: 'vertical',
            shadeIntensity: 0,
            opacityFrom: 0.8,
            opacityTo: 0.1,
            gradientToColors: ['#d5a52c']
          }
        },
        responsive: [
          {
            breakpoint: 770,
            options: {
              chart: {
                height: '400px',
                zoom: {
                  autoScaleYaxis: true
                }
              },
              title: {
                style: {
                  fontSize: '16px'
                }
              },
              subtitle: {
                offsetX: 0,
                offsetY: 25,
                style: {
                  fontSize: '14px'
                }
              },
              xaxis: {
                title: {
                  text: undefined
                }
              }
            }
          },
          {
            breakpoint: 480,
            options: {
              chart: {
                height: '300px'
              },
              title: {
                style: {
                  fontSize: '12px'
                }
              },
              subtitle: {
                style: {
                  fontSize: '10px'
                }
              },
              xaxis: {
                labels: {
                  show: false
                }
              },
              yaxis: {
                labels: {
                  show: false
                }
              }
            }
          }
        ]
      };
    }
  }
};
</script>

<style>
.container {
  z-index: 5;
}
</style>
