import { axiosInstance } from '@/utils/axios';

// Filter records by date
function removeDeprecated(data) {
  const latestData = [];
  data.forEach((item) => {
    const record = data
      .filter((rec) => rec.key === item.key)
      .sort((next, curr) => curr.date - next.date)[0];

    const recordFound = latestData.find((i) => i.key === record.key);
    if (!recordFound) {
      latestData.push(record);
    }
  });
  return latestData;
}

export default {
  namespaced: true,
  state: {
    employees: [],
    company: []
  },
  actions: {
    async fetchEmployee(ctx) {
      let { data } = await axiosInstance.get('/company/employees');

      data = removeDeprecated(data);

      const parsed = data.map((item) => {
        const keys = item.key.split('/');
        return {
          group: keys[0],
          name: keys[2],
          options: {
            [keys[3].toLowerCase()]: {
              value: item.value,
              date: item.date,
              details: item.details,
              valueType: item.valueType
            }
          }
        };
      });

      const employees = [];
      parsed.forEach((item) => {
        let groupIndex = employees.findIndex((e) => e.group === item.group);
        if (groupIndex === -1) {
          employees.push({
            group: item.group,
            employees: []
          });
          groupIndex = employees.findIndex((e) => e.group === item.group);
        }

        let props = {};
        const allRecords = parsed.filter((e) => e.name === item.name);
        allRecords.forEach((i) => {
          props = { ...props, ...i.options };
        });

        const employee = {
          name: item.name,
          options: props
        };

        const employeeExists = employees[groupIndex].employees.find(
          (e) => e.name === item.name
        );

        if (!employeeExists) {
          employees[groupIndex].employees.push(employee);
        }
      });
      ctx.commit('SET_EMPLOYEES', employees);
    },

    async fetchCompany(ctx) {
      let { data } = await axiosInstance.get('/company/general');

      data = removeDeprecated(data);

      const parsed = data.map((item) => {
        const [group, ...projects] = item.key.split('/');
        return {
          group,
          projects: projects,
          date: item.date,
          value: item.value,
          details: item.details
        };
      });

      const company = [];
      parsed.forEach((item) => {
        const group = company.find((e) => e.group === item.group);
        const nested = parsed.filter((d) => d.group === item.group);
        const result = [];
        nested.forEach((d) => {
          const resultId = result.findIndex((i) => {
            if (result.length) {
              return i.main.name === d.projects[0];
            }
            return false;
          });
          const isNested = d.projects.length > 1;
          if (resultId === -1) {
            if (isNested) {
              result.push({
                main: {
                  name: d.projects[0]
                },
                nested: [
                  {
                    name: d.projects[1],
                    value: d.value,
                    date: d.date,
                    details: d.details
                  }
                ]
              });
            } else {
              result.push({
                main: {
                  name: d.projects[0],
                  value: d.value,
                  date: d.date,
                  details: d.details
                },
                nested: []
              });
            }
          } else {
            if (isNested) {
              result[resultId].nested.push({
                name: d.projects[1],
                value: d.value,
                date: d.date,
                details: d.details
              });
            } else {
              result[resultId].main = {
                name: d.projects[0],
                value: d.value,
                date: d.date,
                details: d.details
              };
            }
          }
        });
        if (!group) {
          company.push({
            group: item.group,
            data: result
          });
        }
      });
      ctx.commit('SET_COMPANY', company);
    }
  },
  mutations: {
    SET_EMPLOYEES(state, payload) {
      state.employees = payload;
    },
    SET_COMPANY(state, payload) {
      state.company = payload;
    }
  }
};
