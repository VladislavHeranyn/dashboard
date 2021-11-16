function redirect(path) {
  if (this.$route.path !== path) {
    this.$router.replace(path).catch(() => {});
  }
}

export default {
  methods: { redirect }
};
