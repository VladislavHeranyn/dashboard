<template>
  <v-menu top :offset-x="true">
    <template v-slot:activator="{ on, attrs }">
      <v-list-item
        v-ripple="false"
        inactive
        class="d-flex flex-row justify-space-between align-center px-2"
      >
        <v-list-item-content>
          <v-list-item-title
            :class="
              $route.params.id && $route.params.id == dashboard.id
                ? 'text-bolt white--text'
                : 'text-bolt black--text'
            "
          >
            <h3 class="font-weight-light cursor-pointer">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <div v-bind="attrs" v-on="on">
                    {{ nameLength }}
                  </div>
                </template>
                <span>{{ dashboard.name }}</span>
              </v-tooltip>
            </h3>
          </v-list-item-title>
        </v-list-item-content>

        <v-btn
          class="mx-2"
          fab
          x-small
          elevation="0"
          @click="setDashboard(dashboard)"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon small>more_vert</v-icon>
        </v-btn>
      </v-list-item>
    </template>

    <ContextMenu
      @onDelete="$emit('onDelete')"
      @onRename="onRename"
      @onCopy="onCopy"
      @onShow="$emit('onShow')"
      @onScheduleList="$emit('onScheduleList')"
    />
  </v-menu>
</template>

<script>
import ContextMenu from '../ContextMenu.vue';
export default {
  name: 'Dashboard',
  props: ['dashboard'],
  computed: {
    nameLength() {
      const dashboard = this.$props.dashboard.name;
      if (dashboard.length > 12) return dashboard.slice(0, 12) + '...';
      return dashboard;
    }
  },
  methods: {
    setDashboard(dashboard) {
      this.$emit('onSetItem', dashboard);
    },
    onRename(dashboard) {
      this.$emit('onRename', dashboard);
    },
    onCopy(dashboard) {
      this.$emit('onCopy', dashboard);
    }
  },
  components: {
    ContextMenu
  }
};
</script>


