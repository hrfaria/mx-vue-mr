/******************************************************************************
 * main.js
 * 
 * Entry point js file to initialize App.vue and set up plugins and 3rd party 
 * components.
 *****************************************************************************/
import "@babel/polyfill"
import "mutationobserver-shim"
import Vue from "vue"
import "./plugins/bootstrap-vue"
import App from "./App"
import router from "./router"
import store from "./store";
import axios from "axios";

/* Set axios.defaults.withCredentials to true if you want to use JSESSIONID 
   cookie based authetication. */
// axios.defaults.withCredentials = true;

/* Set up the base URL of the Maximo server you're connecting to. Use the URL 
   your Vue application is running off (e.g. http://localhost:8080) as a proxy
   if you have to bypass CORS policies on the server in case you don't have 
   admin privileges or do not intend to bypass them. Configure vue.config.js to
   define your Maximo server URL in this case. */
axios.defaults.baseURL = process.env.VUE_APP_MAXIMOURL;

/* axios interceptor responsible for detecting when user is not authenticated
   and redirecting to the login page. */
axios.interceptors.response.use(undefined,
  function (error) {
    if (error) {
      const originalRequest = error.config;
      if (error.response.status === 401 || (error.response.status === 400 && error.response.data.Error.reasonCode === "BMXAA9549E")) {
        // Logout - Clear APIKEY
        store.dispatch("updateApiKey", "");
        if (router.history.current.path != "/login") {
          router.push("/login");
        }
        return Promise.reject(error);
      }
    }
  });

// Redering main App.vue component. 
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")
