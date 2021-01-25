<!-- ====================================================================== -->
<!-- Reservation.vue -->
<!-- Component that fetches a single user reservation and shows its details
     based on the invuseid property passed on the reservation list page. -->
<!-- ====================================================================== -->
<template>
  <div>
    <!-- List all the lines of an individual reservation passing invuseid and assigning invuseline to items. -->
    <b-table
      id="reservation-table"
      striped
      hover
      :fields="fields"
      :items="getReservation(invuseid).invuseline"
    >
    </b-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Reservation",
  props: {
    invuseid: Number
  },
  computed: {
    // Vuex getter mappings.
    ...mapGetters(["getReservation"])
  },
  data() {
    return {
      fields: [
        {
          key: "itemnum",
          label: "Item #",
        },
        {
          key: "description",
        },
        {
          key: "quantity",
        },
      ]
    };
  },
};
</script>
