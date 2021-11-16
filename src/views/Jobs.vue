<template>
  <div>
    <div class="center" v-if="loading">
      <Spinner />
    </div>

    <v-card v-if="jobs.jobs.length < 1 && !loading" flat class="center">
      <h2>Not jobs yet!</h2>
    </v-card>

    <div v-else-if="jobs.jobs.length >= 1">
      <div :class="cardWidth">
        <v-card width="100%" flat class="table">
          <v-card
            tile
            width="100%"
            height="50px"
            flat
            class="d-flex flex-row justify-space-around"
          >
            <v-card
              tile
              v-for="(item, i) in titleTable"
              :key="i"
              :width="item.width"
              class="d-flex flex-row justify-space-around align-center"
            >
              <v-card
                width="100%"
                height="100%"
                flat
                class="d-flex justify-center align-center"
                @click="sortHendler(item)"
              >
                <div>
                  {{ item.name }}
                </div>

                <v-card
                  class="d-flex justify-center align-center"
                  color="rgb(255, 0, 0, 0.0)"
                  flat
                  width="20px"
                >
                  <v-icon
                    small
                    v-if="
                      jobs.orderBy === item.orderBy && jobs.orderTo === 'ASC'
                    "
                    >arrow_upward</v-icon
                  >
                  <v-icon
                    small
                    v-if="
                      jobs.orderBy === item.orderBy && jobs.orderTo === 'DESC'
                    "
                    >arrow_downward</v-icon
                  >
                </v-card>
              </v-card>
            </v-card>
          </v-card>

          <v-list-item
            flat
            width="100%"
            class="d-flex justify-space-around pa-0"
            min-height="50px"
            v-for="(item, i) in jobs.jobs"
            :key="i"
          >
            <v-card
              tile
              width="25%"
              min-height="50px"
              class="d-flex align-center justify-center"
            >
              <div class="text" v-text="item.jobName"></div>
            </v-card>
            <v-card
              tile
              width="25%"
              min-height="50px"
              class="d-flex align-center justify-center"
            >
              <div class="text" v-text="dateMoment(item.date)"></div>
            </v-card>

            <v-card
              tile
              width="10%"
              min-height="50px"
              class="d-flex align-center justify-center"
            >
              <v-btn
                elevation="2"
                icon
                plain
                x-small
                class="status"
                :class="item.status == 1 && 'red'"
              ></v-btn>
            </v-card>
            <v-card
              tile
              width="40%"
              min-height="50px"
              class="px-3 d-flex align-center justify-center"
            >
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-card
                    v-bind="attrs"
                    v-on="on"
                    class="text"
                    flat
                    v-text="item.error"
                  ></v-card>
                </template>
                <span class="errorHover">{{ item.error }}</span>
              </v-tooltip>
            </v-card>
          </v-list-item>
        </v-card>
      </div>

      <div @click="setPage" class="d-flex align-center justify-center mt-5">
        <v-pagination
          v-model="jobs.page"
          v-show="lengthJobs(jobs.total) > 1"
          :length="lengthJobs(jobs.total)"
          :total-visible="10"
        ></v-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import Spinner from '../components/addons/Spinner.vue';

export default {
  name: 'Jobs',
  data() {
    return {
      titleTable: [
        { name: 'Job name', orderBy: 'jobName', orderTo: 'ASC', width: '25%' },
        { name: 'Date', orderBy: 'date', orderTo: 'ASC', width: '25%' },
        { name: 'Status', orderBy: 'status', orderTo: 'ASC', width: '10%' },
        { name: 'Error', orderBy: 'error', orderTo: 'ASC', width: '40%' }
      ]
    };
  },
  methods: {
    lengthJobs(total) {
      return Math.ceil(total / this.$store.state.job.limit) || 0;
    },
    dateMoment(date) {
      return moment(date).format('MMMM Do YYYY, h:mm:ss a');
    },
    errorHandler(error) {
      if (error.length > 30) {
        return error.slice(0, 30) + '...';
      }
      return error;
    },
    setPage() {
      if (this.$store.state.job.orderBy === undefined) {
        return this.$store.dispatch('job/fetchJobs', {
          page: this.$store.state.job.page
        });
      }

      return this.$store.dispatch('job/fetchJobs', {
        page: this.$store.state.job.page,
        orderBy: this.$store.state.job.orderBy,
        orderTo: this.$store.state.job.orderTo
      });
    },
    sortHendler(setItem) {
      this.$store.state.job.orderTo === 'DESC'
        ? (setItem.orderTo = 'ASC')
        : (setItem.orderTo = 'DESC');

      this.$store.dispatch('job/fetchJobs', {
        page: this.$store.state.job.page,
        orderBy: setItem.orderBy,
        orderTo: setItem.orderTo
      });
    }
  },
  computed: {
    jobs() {
      return this.$store.state.job || [];
    },
    loading() {
      return this.$store.state.dashboard.loading;
    },
    cardWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return 'scroll';
        case 'sm':
          return 'scroll';
        case 'md':
          return '';
        default:
          return '';
      }
    }
  },
  components: {
    Spinner
  }
};
</script>

<style scoped>
.table {
  min-width: 800px;
  display: flex;
  flex-direction: column;
}

.not_jobs {
  font-weight: 400;
}

.scroll {
  overflow-x: scroll;
}

.status {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0, 204, 0);
}

.errorHover {
  display: block;
  max-width: 300px;
  white-space: wrap;
}

.text {
  white-space: nowrap;
  overflow: hidden;
  padding: 3px;
  text-overflow: ellipsis;
}

.center {
  display: flex;
  font-weight: 400;
  width: 100%;
  height: 500px;
  justify-content: center;
  align-items: flex-end;
}
</style>
