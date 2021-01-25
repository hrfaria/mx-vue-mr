<!-- ====================================================================== -->
<!-- ReservationSet.vue -->
<!-- View component used to render the reservations list under the logged
     in user's name. It's invoked in @/router/index.js. -->
<!-- ====================================================================== -->
<template>
  <div>
    <ReservationSet />
  </div>
</template>

<script>
import ReservationSet from "@/components/ReservationSet.vue";

export default {
  name: "ReservationSetView",
  components: {
    ReservationSet
  }
};
</script>
