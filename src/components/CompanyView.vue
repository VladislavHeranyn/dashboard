<template>
  <div class="main-content">
    <v-row
      v-for="(group, groupId) in companyData"
      :key="groupId"
      :class="getProjectClassName(groupId, companyData)"
    >
      <h2 class="group-name">{{ group.group }}</h2>
      <v-col
        class="group-main col-6 col-lg-3 col-xl-2"
        v-for="(item, inx) in group.data"
        :key="inx"
      >
        <template v-if="!item.nested.length">
          <div class="project-group object">
            <div class="project-label">{{ item.main.name }}</div>
            <div class="project">{{ item.main.value }}</div>
          </div>
        </template>

        <template v-else-if="item.nested.length">
          <div
            class="project-group array"
            v-for="(obj, i) in item.nested"
            :key="i"
          >
            <div :class="getProjectSizeClass(false)">
              <div class="project-label">{{ obj.name }}</div>
              {{ obj.value }}
            </div>
            <template v-if="i === item.nested.length - 1">
              <div :class="getProjectSizeClass(true)">
                <div class="project-label">{{ item.main.name }}</div>
                {{ item.main.value || '+' }}
              </div>
            </template>
          </div>
        </template>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import leadLine from '../mixins/leadLine';

function typeOf(object) {
  if (Array.isArray(object)) {
    return 'array';
  } else if (typeof object === 'string') {
    return 'string';
  } else {
    return 'object';
  }
}

function getProjectClassName(inx, arr) {
  const first = inx === 0 ? ' first' : '';
  const last = inx === arr.length - 1 ? ' last' : '';
  return inx % 2
    ? 'project-block row-reverse' + last
    : 'project-block row' + first + last;
}

function getProjectSizeClass(bool) {
  if (!bool) {
    return 'project project-small';
  }
  return 'project';
}

export default {
  name: 'CompanyView',
  mixins: [leadLine],
  data() {
    return {
      limit: 50
    };
  },
  methods: {
    connectMain() {
      const items = [
        ...document.querySelectorAll('.project:not(.project-small)')
      ];
      items.sort((next, curr) => {
        const parent = curr.closest('.project-block');
        const children = parent.querySelectorAll(
          '.project:not(.project-small)'
        );
        const last = children[children.length - 1];

        const defaultOptions = {
          color: 'black',
          path: 'grid',
          endPlug: 'behind',
          startSocket: 'right',
          endSocket: 'left',
          startSocketGravity: 70,
          endSocketGravity: 70
        };

        if (!parent.classList.contains('row-reverse')) {
          if (curr === last) {
            this.addLine(curr, next, {
              ...defaultOptions,
              endSocket: 'right'
            });
          } else {
            this.addLine(curr, next, {
              ...defaultOptions
            });
          }
        } else {
          if (curr === last) {
            this.addLine(curr, next, {
              ...defaultOptions,
              startSocket: 'left'
            });
          } else {
            this.addLine(curr, next, {
              ...defaultOptions,
              startSocket: 'left',
              endSocket: 'right'
            });
          }
        }
      });
    },

    connectSub() {
      this.addLines({ className: '.group-main', child: '.project' });
    },
    getProjectClassName,
    getProjectSizeClass,
    typeOf
  },
  computed: {
    companyData() {
      return this.$store.state.report.company;
    }
  },
  async mounted() {
    await this.$store.dispatch('report/fetchCompany');
    this.connectMain();
    this.connectSub();
  }
};
</script>
<style>
.group-main {
  position: relative;
  margin: 50px 0;
}

.project-small > .project-label {
  position: absolute;
  min-width: 64px;
  transform: translateX(100%);
  max-width: 64px;
}

.project:not(.project-small) > .project-label {
  position: absolute;
  bottom: -8px;
  transform: translateY(100%);
}

.project-block {
  position: relative;
  min-height: 200px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  border-top: 2px dashed #8d8d8d;
  margin: 16px 0;
  padding: 32px;
}

.group-name {
  position: absolute;
  top: 50%;
  text-align: center;
  left: 16px;
  transform: translateX(-50%) translateY(-50%) rotate(-90deg);
}

.project-group {
  position: relative;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.object .project-label {
  display: inline-block;
  width: 150px;
  position: absolute;
  top: -10px;
  transform: translateY(-100%);
  color: #8d8d8d;
  margin-bottom: 8px;
}

.project,
.project-small {
  height: 80px;
  width: 80px;
  border-radius: 50%;
  background-color: #f5f5f5;
  box-shadow: 0 0 20px #d3d3d3;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.wrapper {
  display: flex;
  align-items: flex-end;
}

.project-small {
  margin-bottom: 16px;
  height: 64px;
  width: 64px;
}

.row-reverse {
  flex-direction: row-reverse;
}
@media (max-width: 768px) {
}

@media (max-width: 512px) {
  .project-block {
    flex-direction: column;
    align-items: center;
  }
}
</style>
