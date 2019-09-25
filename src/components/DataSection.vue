<template>
  <div class="row d-flex justify-content-center py-10">
    <div class="col-6 text-center">
      <h3 class="data-section-header">Last Data</h3>
      <div class="time-info">
        <p class="info-header">Time:</p>
        <p>{{lastData.time}}</p>
      </div>
      <div>
        <p class="info-header">Value:</p>
        <p>
          {{roundNumber(parseFloat(lastData.originalData))}}
          <span class="unit-info">{{startUnit}}</span>
        </p>
        <p>
          {{roundNumber(parseFloat(lastData.transformedData))}}
          <span class="unit-info">{{endUnit}}</span>
        </p>
      </div>
    </div>
    <div class="col-6 text-center">
      <h3 class="data-section-header">Last Minute Average</h3>
      <div class="time-info">
        <p class="info-header">Time:</p>
        <p>{{averageMinuteData.time}}</p>
      </div>
      <div>
        <p class="info-header">Value:</p>
        <p>
          {{roundNumber(parseFloat(averageMinuteData.originalData))}}
          <span
            class="unit-info"
          >{{startUnit}}</span>
        </p>
        <p>
          {{roundNumber(parseFloat(averageMinuteData.transformedData))}}
          <span
            class="unit-info"
          >{{endUnit}}</span>
        </p>
      </div>
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
      return +(Math.round(num + "e+" + this.decimals) + "e-" + this.decimals);
    }
  },
  mounted() {}
};
</script>

<style scoped>
.py-10 {
  padding-bottom: 10px;
  padding-top: 10px;
}

.data-section-header {
  font-weight: bold;
  margin-bottom: 0px;
  margin-top: 0px;
  padding-top: 6px;
  padding-bottom: 6px;
}

.info-header {
  font-weight: bold;
}
.time-info {
  padding-bottom: 4px;
  padding-top: 1px;
}
.unit-info {
  font-style: italic;
}
</style>