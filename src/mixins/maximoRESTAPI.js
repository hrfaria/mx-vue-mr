/******************************************************************************
 * maximoRESTAPI.js
 * 
 * mixin component that implements all the methods abstracting the HTTP calls
 * via axios to the Maximo REST API.
 *****************************************************************************/
import axios from "axios";
import store from "@/store";

export default {
    methods: {
        /**
         * Return one single object based on its internal uid.
         * 
         * @param {string} objectStructure - Object Structure name
         * @param {number} uid - Internal object's uid 
         */
        async load(objectStructure, uid) {
            return axios({
                method: "get",
                url: `/maximo/oslc/os/${objectStructure}/${uid}`,
                params: {
                    apikey: store.getters.getApiKey,
                    lean: 1
                },
            });
        },
        /**
         * Return a record set based on the parameters below.
         * 
         * @param {string} objectStructure - Object Structure name
         * @param {string} select - List of fields to be returned 
         * @param {number} pagenum - Page number to return
         * @param {number} perPage - Number of records per page 
         * @param {string} where - Where clause filter to be applied to the record set
         */
        async loadSet(objectStructure, select, pagenum, perPage, where) {
            const params = {};
            params.apikey = store.getters.getApiKey;
            params.pageno = (pagenum ? pagenum : 1);
            params.lean = 1;
            params["oslc.pageSize"] = (perPage ? perPage : 6);
            params["oslc.select"] = (select ? select : "*");
            params["oslc.where"] = (where ? where : store.getters.getWhere);

            return axios({
                method: "get",
                url: `/maximo/oslc/os/${objectStructure}`,
                params
            });
        },
        /**
         * Save changes passed via payload to the object identified by uid.
         * 
         * @param {string} objectStructure - Object Structure name
         * @param {string} uid - Internal object's uid 
         * @param {Object} data - Payload in JSON format with the changes to be applied to the record
         */
        async save(objectStructure, uid, data) {
            return axios({
                method: "post",
                url: `/maximo/oslc/os/${objectStructure}/${uid}`,
                headers: {
                    "x-method-override": "PATCH",
                    properties: "*"
                },
                params: {
                    apikey: store.getters.getApiKey,
                    lean: 1
                },
                data: data
            });
        },
        /**
         * Add a new object to the set represented in the objectStructure.
         * 
         * @param {string} objectStructure - Object Structure name 
         * @param {Object} data - Payload in JSON format with the new object definition
         */
        async add(objectStructure, data) {
            return axios({
                method: "post",
                url: `/maximo/oslc/os/${objectStructure}`,
                headers: {
                    properties: "*",
                },
                params: {
                    apikey: store.getters.getApiKey,
                    lean: 1,
                },
                data: data,
            });
        },
        /**
         * Delete an object by passing its internal uid.
         * 
         * @param {string} objectStructure - Object Structure name
         * @param {string} uid - Internal object's uid
         */
        async delete(objectStructure, uid) {
            return axios({
                method: "delete",
                url: `/maximo/oslc/os/${objectStructure}/${uid}`,
                params: {
                    apikey: store.getters.getApiKey
                }
            });
        },
        /**
         * Generate an API key with the passed username/password.
         * 
         * @param {string} username 
         * @param {string} password 
         */
        async login(username, password) {
            return axios({
                method: "post",
                url: "/maximo/oslc/apitoken/create",
                headers: {
                    "maxauth": btoa(username + ":" + password)
                },
                params: {
                    lean: 1
                },
                data: { expiration: 120 }
            });
        },
        /**
         * This method can be used to call APIs that return metadata like whoami.
         * 
         * @param {string} objectStructure - Object Structure name
         */
        async loadAPI(objectStructure) {
            return axios({
                method: "get",
                url: `/maximo/oslc/${objectStructure}`,
                params: {
                    apikey: store.getters.getApiKey,
                    lean: 1
                },
            });
        },
    }
}