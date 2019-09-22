import Vue from "vue";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap-grid.min.css";

Vue.config.productionTip = false;

window.EventHandler = new Vue();

new Vue({
  render: h => h(App)
}).$mount("#app");
