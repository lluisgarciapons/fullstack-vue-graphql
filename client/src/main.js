import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/vuetify";

import ApolloClient from "apollo-boost";
import VueApollo from "vue-apollo";

import FormAlert from "./components/Shared/FormAlert";

// Register Global Component
Vue.component("form-alert", FormAlert);

Vue.use(VueApollo);

// Setup ApolloClient
// make it exportable to Vuex
export const defaultClient = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  // include auth token with requests mado to backend
  fetchOptions: {
    credentials: "include"
  },
  request: operation => {
    // if no token with key of "token" in localStorage, add it
    if (!localStorage.token) {
      localStorage.setItem("token", "");
    }

    // operation adds the token to an authorization header, which is sent to backend
    operation.setContext({
      headers: {
        authorization: localStorage.getItem("token")
      }
    });
  },
  onError: ({ graphQLErrors, newtworkError }) => {
    if (newtworkError) {
      console.log("[networkError]", newtworkError);
    }

    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        console.dir(err);
        if (err.name === "AuthenticationError") {
          // set auth error in state (to show in snackbar)
          store.commit("setAuthError", err);
          // signout user (to clear error)
          store.dispatch("signoutUser");
        }
      }
    }
  }
});

const apolloProvider = new VueApollo({
  defaultClient
});

Vue.config.productionTip = false;

new Vue({
  apolloProvider,
  router,
  store,
  render: h => h(App),
  created() {
    // execute getCurrentUser query
    this.$store.dispatch("getCurrentUser");
  }
}).$mount("#app");
