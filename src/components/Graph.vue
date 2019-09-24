<template>
  <div class="chart">
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
  props: [
    "id",
    "allDatas",
    "averageMinuteData",
    "endUnit",
    "chartTitle",
    "decimals"
  ],
  data() {
    return {
      showAllDatas: true,
      counter: 0,
      series: [
        {
          name: this.endUnit,
          data: this.allDatas
        }
      ],
      chartOptions: {
        chart: {
          animations: {
            enabled: true,
            easing: "linear",
            dynamicAnimation: {
              speed: 1000
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
          show: true,
          curve: "smooth",
          colors: ["#333333"],
          lineCap: "butt",
          width: 3
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
    // this.series.data = this.allDatas;
    EventHandler.$on("updateDatas", this.updateDatas);

    EventHandler.$on("changeChartDatas", chartId => {
      if (chartId == this.id) {
        this.showAllDatas = !this.showAllDatas;
      }
    });

    EventHandler.$on("stopUpdateDatas", chartId => {
      if (chartId == this.id) {
        EventHandler.$off("updateDatas", this.updateDatas);
      }
    });

    EventHandler.$on("restartUpdateDatas", chartId => {
      if (chartId == this.id) {
        EventHandler.$on("updateDatas", this.updateDatas);
      }
    });
  },
  methods: {
    updateDatas() {
      if (this.showAllDatas) {
        this.$refs.realtimeChart.updateSeries([
          {
            data: this.allDatas
          }
        ]);
      } else {
        this.$refs.realtimeChart.updateSeries([
          {
            data: this.averageMinuteData
          }
        ]);
      }
    }
  }
};
</script>

<style scoped>
</style>
