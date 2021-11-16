<template>
  <div class="d-flex flex-column justify-center align-center container">
    <v-progress-circular
      :size="50"
      color="primary"
      indeterminate
    ></v-progress-circular>
  </div>
</template>

<script>
export default {
  name: 'Spinner'
};
</script>

<style scoped>
.container {
  height: 100px;
}
</style>
