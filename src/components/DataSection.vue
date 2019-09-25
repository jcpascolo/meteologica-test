<template>
  <div class="row d-flex justify-content-center">
    <div class="col-6">
      <h5>Last Recibed Data</h5>
      <div>Time: {{lastData.time}}</div>
      <!-- <div>Original Data: {{roundNumber(parseFloat(lastData.originalData))}} {{startUnit}}</div>
      <div>Transformed Data: {{roundNumber(parseFloat(lastData.transformedData))}} {{endUnit}}</div>-->
    </div>
    <div class="col-6">
      <h5>Last Minute Average Recibed Data</h5>
      <div>Time: {{averageMinuteData.time}}</div>
      <div>Original Data: {{roundNumber(parseFloat(averageMinuteData.originalData))}} {{startUnit}}</div>
      <div>Transformed Data: {{roundNumber(parseFloat(averageMinuteData.transformedData))}} {{endUnit}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DataSection",
  props: ["lastData", "averageMinuteData", "startUnit", "endUnit", "decimals"],
  data() {
    return {};
  },
  methods: {
    roundNumber(num) {
      //return +parseFloat(num).toPrecision(this.decimals);
      // console.log(num);
      return +(Math.round(num + "e+" + this.decimals) + "e-" + this.decimals);
    }
  },
  mounted() {}
};
</script>

<style scoped>
</style>