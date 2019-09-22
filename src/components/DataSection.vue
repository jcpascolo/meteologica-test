<template>
  <div class="d-flex justify-content-center">
    <div>
      <h5>Last Recibed Data</h5>
      <div>Time: {{lastData.time}}</div>
      <div>Original Data: {{lastData.originalData.toFixed(2)}}{{startUnit}}</div>
      <div>Transformed Data: {{lastData.transformedData.toFixed(2)}}{{endUnit}}</div>

      <h5>Last Minute Average Recibed Data</h5>
      <div>Time: {{averageMinuteData.time}}</div>
      <div>Original Data: {{averageMinuteData.originalData.toFixed(2)}}{{startUnit}}</div>
      <div>Transformed Data: {{averageMinuteData.transformedData.toFixed(2)}}{{endUnit}}</div>
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