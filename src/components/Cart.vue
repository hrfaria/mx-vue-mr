<!-- ====================================================================== -->
<!-- Cart.vue -->
<!-- Component that implements the logic and renders the details of the 
     shopping cart containing the user's reservations. Users can add items
     to the the cart and make changes before submitting the order. -->
<!-- ====================================================================== -->
<template>
  <div v-if="cartIsEmpty()" style="text-align: center">Your cart is empty.</div>
  <div v-else>
    <b-table
      id="cart-table"
      striped
      hover
      :fields="fields"
      :items="cart.mrline"
    >
      <template v-slot:cell(itemnum)="data">
        <b-link v-b-tooltip.click :title="data.item.description">{{
          data.item.itemnum
        }}</b-link>
      </template>
      <template v-slot:cell(qty)="data">
        <b-input-group>
          <b-input-group-prepend>
            <b-button
              variant="outline-info"
              v-on:click="data.item.qty -= data.item.qty > 1 ? 1 : 0"
              class="d-none d-sm-block"
              >-</b-button
            >
          </b-input-group-prepend>

          <b-form-input
            type="number"
            v-model.number="data.item.qty"
          ></b-form-input>

          <b-input-group-append>
            <b-button
              variant="outline-info"
              v-on:click="data.item.qty += 1"
              class="d-none d-sm-block"
              >+</b-button
            >
          </b-input-group-append>
        </b-input-group>
      </template>
      <template v-slot:cell(trash)="data">
        <b-button
          title="Delete Item"
          v-on:click="removeLine(data.item.uid)"
          variant="info"
        >
          <b-icon-trash />
        </b-button>
      </template>
    </b-table>
    <b-form-group>
      <b-button-group class="ml-2">
        <b-button v-on:click="saveCart()" variant="primary">Save</b-button>
      </b-button-group>
      <b-button-group class="ml-2">
        <b-overlay
          :show="isBusy"
          rounded
          opacity="0.6"
          spinner-small
          spinner-variant="primary"
          class="d-inline-block"
        >
          <b-button v-on:click="checkOut()" variant="primary"
            >Check Out</b-button
          >
        </b-overlay>
      </b-button-group>
    </b-form-group>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import maximoRESTAPI from "../mixins/maximoRESTAPI";
import { BIcon, BIconTrash } from "bootstrap-vue";

export default {
  name: "Cart",
  props: {
    mrid: Number,
  },
  components: {
    BIcon,
    BIconTrash,
  },
  mounted() {
    this.cart = JSON.parse(JSON.stringify(this.getCart));
  },
  data: function () {
    return {
      // TODO: Make this a property that will be passed to the component
      fields: [
        {
          key: "itemnum",
          label: "Item #",
        },
        {
          key: "description",
        },
        {
          key: "qty",
          label: "Quantity",
        },
        {
          key: "trash",
          label: "",
        },
      ],
      cart: {},
    };
  },
  computed: {
    // Vuex getter mappings.
    ...mapGetters(["getCart", "isBusy"]),
  },
  methods: {
    // Vuex action mappings.
    ...mapActions(["updateCart", "updateBusy"]),
    // If car is empty show a message on the main page.
    cartIsEmpty: function () {
      if (Object.keys(this.getCart).length === 0) {
        return true;
      } else if (!this.getCart.mrline) {
        return true;
      } else if (this.getCart.mrline.length === 0) {
        return true;
      } else {
        return false;
      }
    },
    // Gets invoked when the trash can icon is clicked to remove the line.
    removeLine: function (uid) {
      this.cart.mrline.forEach((line, index, array) => {
        if (line.uid === uid) {
          array.splice(index, 1);
        }
      });
    },
    // Commit changes to the local store.
    saveCart: function () {
      this.updateCart(this.cart);
      this.$bvToast.toast("Changes saved to store.", {
        title: "Save",
        autoHideDelay: 3000,
      });
    },
    // Send order to the server and create a material reservation.
    checkOut: function () {
      this.updateCart(this.cart);
      this.updateBusy(true);

      /* In order to change status via V-MR object structure:
       *
       *  1) Set Inbound Processing Class to psdi.iface.mic.StatefulMicSetIn
       *  2) Set STATUS and STATUSDATE fields to Restricted
       *
       */
      this.add("v-mr", this.cart)
        .then((response) => {
          return this.save("v-mr", response.data.mrid, { status: "APPR" });
        })
        .then((response) => {
          this.updateCart({});
        })
        .catch((error) => {
          console.log(error);
        });

      this.$nextTick(() => {
        this.updateBusy(false);
      });

      this.$bvToast.toast("Your order was successfully submitted.", {
        title: "Check Out",
        autoHideDelay: 3000,
      });
    },
  },
  mixins: [maximoRESTAPI],
};
</script>
