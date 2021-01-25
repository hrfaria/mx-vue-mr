<!-- ====================================================================== -->
<!-- InventorySet.vue -->
<!-- Component that implements the logic for the inventory list item 
     including pagination and adding items to the shopping cart. -->
<!-- ====================================================================== -->
<template>
  <div>
    <b-container>
      <b-row>
        <b-col>
          <div align="center">
            <b-overlay
              :show="isBusy"
              rounded
              opacity="0.6"
              spinner-small
              spinner-variant="primary"
              class="d-inline-block"
            >
              <!-- Pagination element to break set into pages and facilitate the navigation. -->
              <b-pagination
                v-model="pagenum"
                pills
                size="sm"
                :total-rows="totalCount"
                :per-page="perPage"
                hide-goto-end-buttons
                first-number
                last-number
                align="center"
                :disabled="isBusy"
              ></b-pagination>
            </b-overlay>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          v-for="item in items"
          :key="item.inventoryid"
          cols="12"
          md="6"
          lg="4"
        >
          <b-card :title="item.itemnum" class="mb-2">
            <b-card-text v-b-tooltip.hover :title="item.item.description">
              <v-clamp autoresize :max-lines="1">{{
                item.item.description
              }}</v-clamp>
              <b>Qty Available:</b>
              {{ item.avblbalance }}
              <br />
              <b>Storeroom:</b>
              {{ item.location }}
              <br />
            </b-card-text>
            <b-button
              v-on:click="addToCart(item)"
              :disabled="isBusy"
              variant="primary"
              >Add to Cart</b-button
            >
          </b-card>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <div align="center">
            <b-overlay
              :show="isBusy"
              rounded
              opacity="0.6"
              spinner-small
              spinner-variant="primary"
              class="d-inline-block"
            >
              <!-- Pagination element to break set into pages and facilitate the navigation. -->
              <b-pagination
                v-model="pagenum"
                pills
                size="sm"
                :total-rows="totalCount"
                :per-page="perPage"
                hide-goto-end-buttons
                first-number
                last-number
                align="center"
                :disabled="isBusy"
              ></b-pagination>
            </b-overlay>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { mapGetters } from "vuex";
import VClamp from "vue-clamp";
import maximoRESTAPI from "../mixins/maximoRESTAPI";

export default {
  name: "InventorySet",
  components: {
    VClamp
  },
  data: function () {
    return {
      select:
        "inventoryid,itemnum,itemsetid,location,siteid,avblbalance,item.description,item.itemtype,issueunit",
      busy: false,
    };
  },
  props: {
    perPage: { 
      type: Number,
      default: 6 
    }
  },
  // Fetch the inventory items from the server and populate local store.
  mounted() {
    this.updateBusy(true);

    this.loadSet(
      "mxinventory",
      this.select,
      this.pagenum,
      this.perPage,
      this.where
    )
      .then((response) => {
        this.updateCurrentPage(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    this.$nextTick(() => {
      this.updateBusy(false);
    });
  },
  computed: {
    // Vuex getter mappings.
    ...mapGetters({
      items: "getItems",
      totalCount: "getTotalCount",
      cart: "getCart",
      where: "getWhere",
      isBusy: "isBusy",
      profile: "getProfile"
    }),
    // Setter and getter method to react to page number changes when user clicks on the pagination component.
    pagenum: {
      get() {
        return this.$store.state.currentPage.pagenum;
      },
      set(value) {
        this.$store.commit("updatePagenum", value);
      }
    },
  },
  // Listens on page number changes and loads the corresponding page via API call.
  watch: {
    pagenum: function () {
      this.updateBusy(true);

      this.loadSet(
        "mxinventory",
        this.select,
        this.pagenum,
        this.perPage,
        this.where
      )
        .then((response) => {
          this.updateCurrentPage(response.data);
        })
        .catch((error) => {
          console.log(error);
        });

      this.$nextTick(() => {
        this.updateBusy(false);
      });
    },
  },
  methods: {
    // Vuex action mappings.
    ...mapActions(["updateCurrentPage", "updateCart", "updateBusy"]),
    // Add current item card to the shopping cart.
    addToCart: function (item) {
      var cart = JSON.parse(JSON.stringify(this.cart));

      if (Object.keys(cart).length === 0) {
        cart = {
          mrlineuid: 0,
          description: "Shopping Cart",
          siteid: this.profile.defaultSite,
          mrline: [],
        };
      } else if (!cart.mrline) {
        cart.mrlineuid = 0;
        cart.mrline = [];
      } else if (cart.mrline.length === 0) {
        cart.mrlineuid = 0;
      }

      var newLine = {
        uid: cart.mrlineuid++,
        linetype: item.itemtype,
        itemnum: item.itemnum,
        orderunit: item.issueunit,
        description: item.item.description,
        qty: 1,
        storeloc: item.location,
        storelocsite: item.siteid,
        itemsetid: item.itemsetid,
      };

      cart.mrline.push(newLine);
      this.updateCart(cart);
      this.$bvToast.toast(`Item ${item.itemnum} added to cart.`, {
        title: "Add to Cart",
        autoHideDelay: 3000,
      });
    },
  },
  mixins: [maximoRESTAPI]
};
</script>