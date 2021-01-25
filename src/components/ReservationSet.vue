<!-- ====================================================================== -->
<!-- ReservationSet.vue -->
<!-- Component that implements the list of inventory usage records created 
     from material reservations requested by the current user. -->
<!-- ====================================================================== -->
<template>
  <div v-if="reservations.length == 0" style="text-align: center">
    You have no reservations.
  </div>
  <div v-else>
    <b-table
      id="reservations-table"
      striped
      hover
      :fields="fields"
      :items="reservations"
    >
      <template v-slot:cell(invusenum)="data">
        <router-link v-bind:to="'reservations/' + data.item.invuseid">{{
          data.item.invusenum
        }}</router-link>
      </template>
      <template v-slot:cell(status)="data">
        <b-icon-box-arrow-in-right
          v-b-tooltip.hover
          :title="data.item.status"
        />
      </template>
      <template v-slot:cell(statusdate)="data">
        {{ toDate(data.item.statusdate) }}
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import maximoRESTAPI from "../mixins/maximoRESTAPI";
import { BIcon, BIconCart4, BIconBoxArrowInRight } from "bootstrap-vue";

export default {
  name: "ReservationSet",
  components: {
    BIcon,
    BIconCart4,
    BIconBoxArrowInRight
  },
  // Fetch all invetory usage records created by material reservations requested by the current user.
  mounted() {
    var where = `v-mr.requestedby="${this.profile.userName}"`;
    this.updateBusy(true);

    this.loadSet("mxinvuse", this.select, 1, 100, where)
      .then((response) => {
        // Save reservations to local store.
        this.updateReservations(response.data.member);
      })
      .catch((error) => {
        console.log(error);
      });

    this.$nextTick(() => {
      this.updateBusy(false);
    });
  },
  data: function () {
    return {
      // TODO: Make this a property that will be passed to the component
      fields: [
        {
          key: "invusenum",
          label: "Reservation #",
        },
        {
          key: "fromstoreloc",
          label: "Store",
        },
        {
          key: "status",
        },
        {
          key: "statusdate",
          label: "Status Date",
        },
        {
          key: "resline",
          label: "",
        },
      ],
      select:
        "invuseid,invusenum,fromstoreloc,status,statusdate,invuseline{invuselinenum,linetype,itemnum,description,quantity,inventory.issueunit}",
    };
  },
  computed: {
    // Vuex getter mappings.
    ...mapGetters({
      isBusy: "isBusy",
      reservations: "getReservations",
      profile: "getProfile",
    }),
  },
  methods: {
    // Vuex action mappings.
    ...mapActions(["updateBusy", "updateReservations"]),
    // Return two-digit representation of the date element in question.
    ten: function (num) {
      return (num < 10 ? "0" : "") + num;
    },
    // Return yyyy-mm-dd date format.
    toDate: function (value) {
      var date = new Date(value);

      return (
        date.getFullYear() +
        "-" +
        this.ten(date.getMonth() + 1) +
        "-" +
        this.ten(date.getDate())
      );
    },
  },
  mixins: [maximoRESTAPI]
};
</script>
