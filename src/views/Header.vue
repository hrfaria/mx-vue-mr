<!-- ====================================================================== -->
<!-- Header.vue -->
<!-- Component used to render the top header containing th enavigation bar
     elements: breadcrumb, search, and user profile. -->
<!-- ====================================================================== -->
<template>
  <div>
    <b-navbar toggleable="sm" type="dark" variant="info" class="mb-2">
      <b-navbar-nav>
        <b-breadcrumb :items="crumbs" />
      </b-navbar-nav>

      <!-- Search field listening on click and enter events. -->
      <b-navbar-nav>
        <b-nav-form>
          <b-form-input
            type="search"
            size="sm"
            class="mx-2"
            placeholder="Search..."
            v-model="searchText"
            v-on:keydown.enter.prevent.native="search()"
            v-on:input="clearSearch()"
          ></b-form-input>
        </b-nav-form>
      </b-navbar-nav>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <!-- Link to reservations. -->
          <b-nav-item to="reservations"
            ><b-icon-box v-b-tooltip.hover title="Reservations"
          /></b-nav-item>
          <!-- Link to shopping cart. -->
          <b-nav-item to="cart"
            ><b-icon-cart4 v-b-tooltip.hover title="Shopping Cart"
          /></b-nav-item>
          <b-nav-item-dropdown right no-caret>
            <template v-slot:button-content>
              <b-avatar variant="primary" size="sm" :text="getUserInitials()" />
            </template>
            <b-dropdown-item v-b-modal.modal-profile>Profile</b-dropdown-item>
            <!-- Modal component used to shou user profile information. -->
            <b-modal
              id="modal-profile"
              header-border-variant="light"
              hide-footer
            >
              <template v-slot:modal-title>
                <b-form inline>
                  <b-avatar
                    variant="primary"
                    :text="getUserInitials()"
                    class="mr-3"
                  />
                  <b-modal-title :title="profile.loginID" />
                </b-form>
              </template>
              <b-table
                stacked
                :fields="profileFields"
                :items="[profile]"
                small
              ></b-table>
            </b-modal>
            <!-- Call logout function to sign out. -->
            <b-dropdown-item v-on:click="logout">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import { BIcon, BIconCart4, BIconSearch, BIconBox } from "bootstrap-vue";
import { mapActions } from "vuex";
import { mapGetters } from "vuex";
import maximoRESTAPI from "../mixins/maximoRESTAPI";
import router from "../router";
import BModalTitle from "./BModalTitle";

export default {
  name: "HeaderView",
  components: {
    BIcon,
    BIconCart4,
    BIconSearch,
    BIconBox,
    BModalTitle
  },
  data: function () {
    return {
      searchText: "",
      select:
        "inventoryid,itemnum,itemsetid,location,siteid,avblbalance,item.description,item.itemtype,issueunit",
      defaultWhere: 'status="ACTIVE" and item.itemtype="ITEM"',
      pagenum: 1,
      perPage: 6,
      profileFields: ["userName", "displayname", "email", "defaultSite"]
    };
  },
  methods: {
    // Vuex action mappings.
    ...mapActions([
      "updateCurrentPage",
      "updateWhere",
      "updateBusy",
      "updateApiKey"
    ]),
    // Update the where clause in the Vuex store and reloads the inventory set.
    search: function () {
      this.updateWhere(
        this.defaultWhere +
          (this.searchText.trim()
            ? ` and item.description="%${this.searchText}%"`
            : "")
      );

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

      // Wait until the next tick to set busy to false.
      this.$nextTick(() => {
        this.updateBusy(false);
      });
    },
    // Triggered when search field is cleared and calls search function.
    clearSearch: function () {
      if (!this.searchText) {
        this.search();
      }
    },
    // Sign out, clear the API key in the store, and redirects to login page.
    logout: function () {
      this.updateApiKey("");
      router.push("/login");
    },
    // Get logged in user's initials
    getUserInitials: function () {
      var initials = "";

      if (this.profile.firstname) {
        initials += this.profile.firstname.charAt(0).toUpperCase();
      }

      if (this.profile.lastname) {
        initials += this.profile.lastname.charAt(0).toUpperCase();
      }

      if (!initials) {
        initials = this.profile.loginID.charAt(0).toUpperCase();
      }

      return initials;
    },
  },
  computed: {
    // Vuex getter mappings.
    ...mapGetters({
      where: "getWhere",
      isBusy: "isBusy",
      profile: "getProfile",
    }),
    // Generates the breadcrumb components based on the $route.matched array.
    crumbs: function () {
      var params = this.$route.params;
      var breadcrumbs = [
        {
          to: "/",
          text: "Home",
        },
      ];

      this.$route.matched.forEach(function (route, routeIdx) {
        if (route.meta.breadCrumb) {
          let path = route.path;

          Object.entries(params).forEach(function ([key, value]) {
            path = path.replace(":" + key, value);
          });

          breadcrumbs.push({
            to: path,
            text: route.meta.breadCrumb,
          });
        }
      });

      return breadcrumbs;
    }
  },
  mixins: [maximoRESTAPI]
};
</script>