<!-- ====================================================================== -->
<!-- App.vue -->
<!-- Top level Vue component. -->
<!-- ====================================================================== -->
<template>
  <div id="app">
    <!-- Call @/views/Header.vue to render the navigation bar header. Header will not show up if user is not properly authenticated. -->
    <top-header v-if="isAuthenticated" />
    <!-- Main page dynamic place holder that will render different componets based on @router/index.js definition. -->
    <router-view />
  </div>
</template>

<script>
import Header from "@/views/Header.vue";
import { mapGetters } from "vuex";

export default {
  name: "App",
  components: {
    "top-header": Header,
  },
  computed: {
    // Vuex getter mappings.
    ...mapGetters(["isAuthenticated"]),
  },
};
</script>
