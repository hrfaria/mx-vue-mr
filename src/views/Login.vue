<!-- ====================================================================== -->
<!-- Login.vue -->
<!-- View component used to render the login page. This is the fallback 
     page when user is not authenticated or token has expired. It's invoked
     in @/router/index.js. -->
<!-- ====================================================================== -->
<template>
  <div>
    <img alt="Vue logo" src="../assets/logo.png" />
    <h2>mx-vue</h2>
    <p>A Vue Client for Maximo</p>

    <!-- Call @/components/Login.vue to render the login form. -->
    <Login/>

    <ul>
      <li>
        <a
          href="https://www.ibm.com/ca-en/products/maximo"
          target="_blank"
          rel="noopener"
          >Maximo</a
        >
      </li>
      <li>
        <a
          href="https://vuejs.org/"
          target="_blank"
          rel="noopener"
          >Vue</a
        >
      </li>
    </ul>
  </div>
</template>

<script>
import Login from "@/components/Login.vue";

export default {
  name: "LoginView",
  components: {
    Login
  }
};
</script>

<style scoped>
h2 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

div {
  text-align: center
}
</style>