<!-- ====================================================================== -->
<!-- Cart.vue -->
<!-- View component used to render the shopping cart containing the user's 
     reservations. It's invoked in @/router/index.js. -->
<!-- ====================================================================== -->
<template>
  <div>
    <!-- Call @/components/Cart.vue to render the shopping cart page. -->
    <Cart :mrid="mrid" />
  </div>
</template>

<script>
import Cart from "@/components/Cart.vue";

export default {
  name: "CartView",
  props: {
    mrid: Number
  },
  components: {
    Cart
  }
};
</script>