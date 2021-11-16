import LeaderLine from 'leader-line-new';

const options = {
  color: 'black',
  endPlug: 'behind',
  path: 'straight',
  size: 2
};

export default {
  data() {
    return {
      lines: [],
      noteLine: null
    };
  },
  methods: {
    addLine(start, end, opt) {
      const line = new LeaderLine(start, end, opt || options);
      this.lines.push(line);
    },
    addNoteLine(start, end) {
      if (this.noteLine) {
        this.noteLine.remove();
        this.noteLine = null;
      }
      this.noteLine = new LeaderLine(start, end, {
        path: 'magnet',
        color: 'black',
        startSocket: 'left',
        size: 2
      });
    },
    removeNoteLine() {
      if (this.noteLine) {
        this.noteLine.remove();
        this.noteLine = null;
      }
    },
    addLines({ className = '', nodeList = [], child = '', opt = '' }) {
      let elements = [];
      if (className) {
        elements = [...document.querySelectorAll(className)];
        if (child) {
          elements.forEach((el) => {
            const childElements = [...el.querySelectorAll(child)];
            childElements.sort((next, curr) => {
              this.addLine(curr, next, opt);
            });
          });
          return;
        }
      } else {
        elements = nodeList;
      }
      elements.sort((next, curr) => {
        this.addLine(curr, next, opt);
      });
    },
    destroyLines() {
      if (this.lines.length) {
        this.lines.forEach((line) => line.remove());
        this.lines = [];
      }
      this.removeNoteLine();
    }
  },
  beforeDestroy() {
    this.destroyLines();
  }
};
