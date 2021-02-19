<!-- ====================================================================== -->
<!-- Reservation.vue -->
<!-- View component used to render the reservation details. It's invoked
     in @/router/index.js. -->
<!-- ====================================================================== -->
<template>
  <div>
    <Reservation :invuseid="invuseid"/>
  </div>
</template>

<script>
import Reservation from "@/components/Reservation.vue";

export default {
  name: "ReservationView",
  props: {
    invuseid: String
  },
  components: {
    Reservation
  }
};
</script>
