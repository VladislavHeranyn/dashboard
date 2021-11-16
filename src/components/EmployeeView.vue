<template>
  <v-container class="mt-16" id="employee">
    <div v-for="(item, itemInx) in employeeData" :key="itemInx" class="group">
      <h2>{{ item.group }}</h2>
      <div
        v-for="(employee, empInx) in item.employees"
        :key="empInx"
        class="employee"
      >
        <div class="name" :class="getColor(employee.options.roi.value)">
          {{ employee.name }}
        </div>
        <div
          class="
            data-container
            ml-sm-10
            d-flex
            flex-grow-1
            justify-space-between
          "
        >
          <div
            class="option"
            v-for="(option, inx) in employee.options"
            :key="inx"
          >
            <div
              class="value"
              :class="getColor(employee.options.roi.value)"
              @click="showNoteHandler(employee.name, inx, $event)"
            >
              {{ option.value + option.valueType }}
            </div>
            <div class="label">{{ inx }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="end my-green">End</div>
    <div class="note-container">
      <div class="note pa-6 text-center">
        <div>Date: {{ note.date }}</div>
        <div>Details: {{ note.details }}</div>
      </div>
    </div>
  </v-container>
</template>
<script>
import leadLine from '@/mixins/leadLine';
import css from '@/mixins/css';

function getScreenWidth() {
  const width = window.innerWidth;
  if (width > 768) {
    return 'lg';
  } else if (width < 512) {
    return 'xs';
  }
  return 'sm';
}

export default {
  name: 'EmployeeView',
  mixins: [leadLine],
  data() {
    return {
      activeNote: null,
      screenWidth: getScreenWidth(),
      note: {
        date: '01/07/2021',
        details: 'Some extra details here'
      }
    };
  },
  watch: {
    screenWidth() {
      this.connectNodes(this.screenWidth);
    }
  },
  computed: {
    employeeData() {
      return this.$store.state.report.employees;
    }
  },
  methods: {
    showNoteHandler(name, option, e) {
      const note = document.querySelector('.note-container');
      const element = e.target;
      const pos = element.getBoundingClientRect();
      const elementX = pos.x;
      const elementY = pos.y;
      note.style.top = elementY - 200 + 'px';
      note.style.left = elementX - 80 + 'px';

      if (this.activeNote === option) {
        css.fadeOut(note);
        this.removeNoteLine();
        this.activeNote = null;
      } else {
        css.fadeIn(note);
        this.addNoteLine(element, note);
        this.activeNote = option;
      }
    },
    getColor(roi) {
      if (roi >= 30) {
        return 'my-green';
      }
      return 'my-red';
    },
    connectLg() {
      const employees = [...document.querySelectorAll('.employee')];
      employees.sort((next, curr) => {
        this.addLine(curr.firstChild, next.firstChild);
      });
      const pairs = [];
      employees.map((block) => {
        pairs.push([block.firstChild, ...block.querySelectorAll('.value')]);
        return pairs;
      });
      pairs.forEach((pair) => this.addLines({ nodeList: pair }));
    },
    connectSm() {
      const opt = {
        color: 'black',
        endPlug: 'behind',
        path: 'fluid',
        size: 2
      };
      const employee = document.querySelectorAll('.employee');
      employee.forEach((e) => {
        const name = e.querySelector('.name');
        const values = e.querySelectorAll('.value');
        values.forEach((v, vi) => {
          if (vi % 2 === 0) {
            this.addLine(name, v, opt);
          } else {
            this.addLine(values[vi - 1], v, opt);
          }
        });
      });
    },
    connectXs() {
      this.addLines({ className: '.name' });
      const values = [...document.querySelectorAll('.value')];
      let i = 0;
      values.sort((next, curr) => {
        if (i % 2 === 0) {
          this.addLine(curr, next);
        }
        i++;
      });
      this.addLine(
        [...document.querySelectorAll('.name')].reverse()[0],
        document.querySelector('.end')
      );
    },
    connectNodes(screenWidth) {
      this.destroyLines();
      if (screenWidth === 'lg') {
        this.connectLg();
      } else if (screenWidth === 'xs') {
        this.connectXs();
      } else if (screenWidth === 'sm') {
        this.connectSm();
      }
    }
  },
  async mounted() {
    await this.$store.dispatch('report/fetchEmployee');
    window.addEventListener('resize', () => {
      this.screenWidth = getScreenWidth();
    });
    document.querySelector('.end').addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    this.connectNodes(this.screenWidth);
  }
};
</script>
<style scoped>
.note-container {
  position: absolute;
  transition: opacity 0.32s ease;
  opacity: 0;
  z-index: 1;
  transform: translateX(-50%);
  filter: drop-shadow(2px 2px 9px rgba(194, 194, 194, 0.9));
  display: none;
}
.note {
  width: 200px;
  min-height: 100px;
  background-color: #ffffcc;
  clip-path: polygon(25% 0, 100% 0, 100% 100%, 0 100%, 0 35%);
}

.group {
  border-top: 1px dashed black;
  padding: 32px;
  text-align: center;
}
.employee {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  margin-top: 32px;
}
.name,
.end,
.value {
  background-color: #fff;
  border: 1px solid #8d8d8d;
  box-shadow: 0 0 20px #d3d3d3;

  display: flex;
  justify-content: center;
  align-items: center;
}

.name {
  height: 64px;
  width: 192px;
  border-radius: 8px;
}
.value,
.end {
  height: 64px;
  width: 64px;
  border-radius: 50%;
}

.end {
  position: relative;
  left: 50%;
  bottom: 16px;
  transform: translateX(-50%);
  text-decoration: underline;
  display: none;
}

.option {
  position: relative;
  display: flex;
  cursor: pointer;
  align-items: center;
  flex-direction: column;
}
.label {
  position: absolute;
  transform: translateY(-4px);
  text-transform: capitalize;
  bottom: 100%;
}

.my-green {
  border-color: #0ecb81;
  background-color: rgba(14, 203, 129, 0.32);
}

.my-red {
  border-color: #f6465d;
  background-color: rgba(246, 70, 93, 0.32);
}

@media (max-width: 768px) {
  .name {
    margin-right: 32px;
  }
  .data-container {
    flex-wrap: wrap;
  }
  .data-container > * {
    width: 50%;
    margin: 25px 0;
  }
}
@media (max-width: 512px) {
  .name {
    margin-right: 0;
  }
  h2 {
    text-align: left;
  }
  .employee {
    flex-direction: column;
    margin-top: 8px;
  }
  .data-container {
    margin-top: 16px;
    /*flex-direction: column;*/
    align-items: center;
  }
  .option > .label {
  }
  .end {
    display: flex;
  }
}
</style>
