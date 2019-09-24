<template>
  <div class="row d-flex justify-content-center">
    <div class="col-6">
      <h5>Last Recibed Data</h5>
      <div>Time: {{lastData.time}}</div>
      <div>Original Data: {{parseFloat(lastData.originalData).toFixed(2)}} {{startUnit}}</div>
      <div>Transformed Data: {{parseFloat(lastData.transformedData).toFixed(2)}} {{endUnit}}</div>
    </div>
    <div class="col-6">
      <h5>Last Minute Average Recibed Data</h5>
      <div>Time: {{averageMinuteData.time}}</div>
      <div>Original Data: {{parseFloat(averageMinuteData.originalData).toFixed(2)}} {{startUnit}}</div>
      <div>Transformed Data: {{parseFloat(averageMinuteData.transformedData).toFixed(2)}} {{endUnit}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DataSection",
  props: ["lastData", "averageMinuteData", "startUnit", "endUnit"],
  data() {
    return {};
  },
  methods: {},
  mounted() {}
};
</script>

<style scoped>
</style>