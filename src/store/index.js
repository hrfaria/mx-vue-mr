/******************************************************************************
 * @/store/index.js
 * 
 * Vuex store definition for the material reservations app. All methods below 
 * are self explanatory and are based on the Vuex framework. Further descripion
 * of each state property is provided below.
 * 
 * Visit https://vuex.vuejs.org/ for more information.
 * 
 *****************************************************************************/
import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from 'vuex-persistedstate';
// import Cookies from 'js-cookie';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        // Current page rendered on the main page.
        currentPage: {
            items: [], // Array of items contained in the current page
            pagenum: 1 // Current page number
        },
        totalCount: 0, // Total count of items returned by the server
        cart: {}, // Object representing the shoping cart with user's reservations
        where: 'status="ACTIVE" and item.itemtype="ITEM"', // Default where clause for inventory items main set
        apiKey: "", // Holds the API key to autheticate all API calls
        busy: false, // Busy state to let user know something is being processed
        reservations: [], // List of all reservations (INVUSE records) under the user's name
        profile: {} // User profile metadata
    },
    plugins: [
        createPersistedState(
            /**
             * Only use cookies if you want to send information back to the server, e.g. user information.
             * Note: vuex-persistedstate seems to have a problem with object type state properties. 
             **/
            /* {
                storage: {
                    getItem: key => Cookies.get(key),
                    setItem: (key, value) =>
                        Cookies.set(key, value, { expires: 3, secure: false }),
                    removeItem: key => Cookies.remove(key)
                }
            } */
        )
    ],
    getters: {
        getItems: (state) => { return state.currentPage.items },
        getPagenum: (state) => { return state.currentPage.pagenum },
        getTotalCount: (state) => { return state.totalCount },
        getCart: (state) => { return state.cart },
        getWhere: (state) => { return state.where },
        getApiKey: (state) => { return state.apiKey },
        isAuthenticated: (state) => { return !!state.apiKey },
        isBusy: (state) => { return state.busy },
        getReservations: (state) => { return state.reservations },
        // Find reservation by invuseid
        getReservation: (state) => 
            (invuseid) => {
                return state.reservations.find(reservation => reservation.invuseid == invuseid);   
        },
        getProfile: (state) => { return state.profile }
    },
    mutations: {
        updateCurrentPage(state, page) {
            state.currentPage.items = page.member;
            state.currentPage.pagenum = page.responseInfo.pagenum;
            state.totalCount = page.responseInfo.totalCount;
        },
        updatePagenum(state, pagenum) {
            state.currentPage.pagenum = pagenum;
        },
        updateCart(state, cart) {
            state.cart = cart;
        },
        updateWhere(state, where) {
            state.where = where;
        },
        updateApiKey(state, apiKey) {
            state.apiKey = apiKey;
        },
        updateBusy(state, busy) {
            state.busy = busy;
        },
        updateReservations(state, reservations) {
            state.reservations = reservations;
        },
        updateProfile(state, profile) {
            state.profile = profile;
        }
    },
    actions: {
        updateCurrentPage(context, page) {
            context.commit('updateCurrentPage', page);
        },
        updatePagenum(context, pagenum) {
            context.commit('updatePagenum', pagenum)
        },
        updateCart(context, cart) {
            context.commit('updateCart', cart);
        },
        updateWhere(context, where) {
            context.commit('updateWhere', where);
        },
        updateApiKey(context, apiKey) {
            context.commit('updateApiKey', apiKey);
        },
        updateBusy(context, busy) {
            context.commit('updateBusy', busy);
        },
        updateReservations(context, reservations) {
            context.commit('updateReservations', reservations);
        },
        updateProfile(context, profile) {
            context.commit('updateProfile', profile);
        }
    }
});