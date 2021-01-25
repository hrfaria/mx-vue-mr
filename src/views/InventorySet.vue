<!-- ====================================================================== -->
<!-- InventorySet.vue -->
<!-- View component used to render the list of inventory items on the main 
     page. It's invoked in @/router/index.js. -->
<!-- ====================================================================== -->
<template>
  <div>
    <InventorySet />
  </div>
</template>

<script>
import InventorySet from "@/components/InventorySet.vue";

export default {
  name: "InventorySetView",
  components: {
    InventorySet
  },
};
</script>
