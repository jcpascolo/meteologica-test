<template>
  <div>
    <VueApexCharts
      ref="realtimeChart"
      type="area"
      height="300"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script>
// let datas = require("json-loader!yaml-loader!../../data.yml");
import VueApexCharts from "vue-apexcharts";

let secondsToHour = totalSeconds => {
  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds - hours * 3600) / 60);
  let seconds = totalSeconds - hours * 3600 - minutes * 60;

  let timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0");

  return timeString;
};

export default {
  name: "Graph",
  components: {
    VueApexCharts
  },
  props: ["datas", "endUnit", "chartTitle", "decimals"],
  data() {
    return {
      allDatas: [],
      counter: 0,
      series: [
        {
          name: this.endUnit,
          data: []
        }
      ],
      chartOptions: {
        chart: {
          animations: {
            enabled: true,
            easing: "linear",
            dynamicAnimation: {
              speed: 4000
            }
          },
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "smooth"
        },
        title: {
          text: this.chartTitle,
          align: "center",
          offsetY: 20,
          style: {
            fontSize: "16px",
            color: "#263238"
          }
        },
        markers: {
          size: 0,
          colors: "#023645",
          strokeColors: "#fff"
        },
        xaxis: {
          type: "numeric",
          range: 300,
          tickAmount: 5,
          style: {
            colors: "#ffffff",
            fontSize: "12px"
          },
          rotate: 0,
          labels: {
            formatter: function(value) {
              return secondsToHour(value);
            }
          },
          tooltip: {
            formatter: function(value) {
              return secondsToHour(value);
            }
          }
        },
        yaxis: {
          decimalsInFloat: this.decimals
        },
        tooltip: {
          enabled: true,
          y: {
            title: {
              formatter: seriesName => seriesName
            }
          }
        },
        legend: {
          show: false
        }
      }
    };
  },
  mounted() {
    EventHandler.$on("updateDatas", () => {
      this.$refs.realtimeChart.updateSeries([
        {
          data: this.datas
        }
      ]);
    });
  },
  methods: {}
};
</script>

<style scoped>
</style>
