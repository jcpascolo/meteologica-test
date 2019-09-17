<template>
  <div id="app">APP</div>
</template>

<script>
let datas = require("json-loader!yaml-loader!../data.yml");

export default {
  name: "app",
  components: {},
  mounted() {
    try {
      console.log(datas.power.values[0]);
    } catch (e) {
      console.log(e);
    }
  }
};
</script>

<style>
</style>
