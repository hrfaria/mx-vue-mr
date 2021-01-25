<!-- ====================================================================== -->
<!-- Login.vue -->
<!-- Component that implements the authentication. If username and password
     entered are valid and the user is successfully authenticated, it saves
     the API key returned by the server in th elocal store. -->
<!-- ====================================================================== -->
<template>
  <div>
    <b-form class="mx-auto login-view" v-on:submit.prevent="onSubmit()">
      <b-form-group>
        <b-form-input
          v-model="username"
          placeholder="User Name"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group>
        <b-form-input
          type="password"
          v-model="password"
          placeholder="Password"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group>
        <b-overlay
          :show="isBusy"
          rounded
          opacity="0.6"
          spinner-small
          spinner-variant="primary"
          class="d-inline-block"
        >
          <b-button type="submit" :disabled="isBusy" variant="primary"
            >Login</b-button
          >
        </b-overlay>
      </b-form-group>
      <b-form-text class="mb-4">{{ errorMessage }}</b-form-text>
    </b-form>
  </div>
</template>

<script>
import maximoRESTAPI from "../mixins/maximoRESTAPI";
import { mapActions } from "vuex";
import { mapGetters } from "vuex";

export default {
  name: "Login",
  data: function () {
    return {
      username: "",
      password: "",
      errorMessage: "",
    };
  },
  computed: {
    // Vuex getter mappings.
    ...mapGetters(["isBusy"]),
  },
  methods: {
    // Vuex action mappings.
    ...mapActions(["updateApiKey", "updateBusy", "updateProfile"]),
    // Generate and store API key by passing username/password to the server.
    onSubmit: function () {
      this.updateBusy(true);

      this.login(this.username, this.password)
        .then((response) => {
          this.updateApiKey(response.data.apikey);
          return this.loadAPI("whoami");
        })
        .then((response) => {
          this.updateProfile(response.data);
          this.$router.push("/");
        })
        .catch((error) => {
          if (error.response.data.Error) {
            this.errorMessage = error.response.data.Error.message;
          } else {
            console.log(error);
            this.errorMessage =
              "Oops, something went wrong. Check your console for details.";
          }
        });

      this.$nextTick(() => {
        this.updateBusy(false);
      });
    },
  },
  mixins: [maximoRESTAPI]
};
</script>

<style scoped>
.login-view {
  width: 200px;
}
</style>
