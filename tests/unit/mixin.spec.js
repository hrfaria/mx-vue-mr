/******************************************************************************
 * mixin.spec.js
 * 
 * Unit tests for the maximoRESTAPI mixin component.
 *****************************************************************************/
import { createLocalVue, mount } from "@vue/test-utils"
import maximoRESTAPI from "@/mixins/maximoRESTAPI";
import { mapGetters, mapActions } from "vuex";
import Vuex from "vuex";
import axios from "axios";
import store from "@/store";

// Enter the Maximo URL you're testing against here.
axios.defaults.baseURL = process.env.VUE_APP_MAXIMOURL;

// Creates a separate Vue component with the required Vuex getter and action mappings.
const Component = {
    template: "<div>mixin</div>",
    computed: {
        ...mapGetters(["getProfile", "isAuthenticated", "getApiKay", "getWhere", "getProfile", "getItems"])
    },
    methods: {
        ...mapActions(["updateApiKey", "updateProfile", "updateCurrentPage"])
    },
    mixins: [maximoRESTAPI]
}

// Create a scoped Vue constructor and tell it to use Vuex.
const localVue = createLocalVue();
localVue.use(Vuex);

// Mount the component and associate a store.
const wrapper = mount(Component, {
    localVue,
    store
});

var mrid = 0

describe("mixin", () => {
    // Test logging in with credentials given below.
    it("login", done => {
        expect.assertions(1);
        return wrapper.vm.login("wilson", "wilson").then((response) => {
            wrapper.vm.updateApiKey(response.data.apikey);
            expect(wrapper.vm.isAuthenticated).toBeTruthy();
            done();
        }).catch((error) => {
            console.log(error);
            done();
        });
    });

    // Test calling whoami API to fetch user profile information. 
    it("whoami", done => {
        expect.assertions(1);
        return wrapper.vm.loadAPI("whoami").then((response) => {
            wrapper.vm.updateProfile(response.data);
            expect(wrapper.vm.getProfile.defaultSite).toBeTruthy();
            done();
        }).catch((error) => {
            console.log(error);
            done();
        });
    });

    // Test the loading of inventory items. 
    it("items", done => {
        const select = "inventoryid,itemnum,itemsetid,location,siteid,avblbalance,item.description,item.itemtype,issueunit";

        expect.assertions(1);
        return wrapper.vm.loadSet("mxinventory", select).then((response) => {
            wrapper.vm.updateCurrentPage(response.data);
            expect(response.data.member).toBeTruthy();
            done();
        }).catch((error) => {
            console.log(error);
            done();
        });
    });

    // Test saving a shopping cart and creating a material reservation for it.
    it("checkout", done => {
        var cart = {
            mrlineuid: 0,
            description: "Shopping Cart - Unit Test",
            siteid: wrapper.vm.getProfile.defaultSite,
            mrline: []
        };

        const item = wrapper.vm.getItems[0];

        if (item) {
            cart.mrline[0] = {
                uid: 1,
                linetype: item.itemtype,
                itemnum: item.itemnum,
                orderunit: item.issueunit,
                description: item.item.description,
                qty: 1,
                storeloc: item.location,
                storelocsite: item.siteid,
                itemsetid: item.itemsetid
            };
        }

        expect.assertions(2);
        return wrapper.vm.add("v-mr", cart).then((response) => {
            return wrapper.vm.save("v-mr", response.data.mrid, { description: cart.description + " - Updated" });
        }).then((response) => {
            mrid = response.data.mrid;
            expect(mrid).toBeTruthy();
            expect(response.data.description).toMatch(cart.description + " - Updated");
            done();
        }).catch((error) => {
            console.log(error);
            done();
        });
    });

    // Test listing all reservations for current user.
    it("reservations", done => {
        const select = "invuseid,invusenum,fromstoreloc,status,statusdate,invuseline{invuselinenum,linetype,itemnum,description,quantity,inventory.issueunit}";
        const where = `v-mr.requestedby="${wrapper.vm.getProfile.userName}"`;

        expect.assertions(1);
        return wrapper.vm.loadSet("mxinvuse", select, 1, 100, where).then((response) => {
            expect(response.data.member).toBeTruthy();
            done();
        }).catch((error) => {
            console.log(error);
            done();
        });
    });

    // Test deleting the material reservation created previously for clean up purposes.
    it("delete", done => {
        expect.assertions(1);
        return wrapper.vm.delete("v-mr", mrid).then((response) => {
            var ok = response.status >= 200 && response.status < 300;
            expect(ok).toBeTruthy();
            done();
        }).catch((error) => {
            console.log(error);
            done();
        });
    });
})