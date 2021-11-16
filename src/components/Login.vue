<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col>
        <div class="text-center">
          <h2>Welcome to company dashboard application</h2>
          <p>Sign In to your account</p>
          <v-btn @click="signIn" class="blue white--text">Google Login</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import router from '../mixins/router';
export default {
  name: 'Login',
  mixins: [router],
  methods: {
    async signIn() {
      await this.$store.dispatch('auth/login', this.$gAuth);
      this.redirect('/employee');
    }
  }
};
</script>
