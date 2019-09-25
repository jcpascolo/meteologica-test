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
      isStopped: false,
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
          labels: {
            formatter: function(value) {
              return secondsToHour(value);
            },
            rotate: -10,
            rotateAlways: true
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
    EventHandler.$on("updateDatas", this.updateDatas);
    EventHandler.$on("changeChartDatas", chartId => {
      if (chartId == this.id) {
        this.showAllDatas = !this.showAllDatas;
        this.updateDatas();
      }
    });

    EventHandler.$on("startStopChartUpdateDatas", chartId => {
      if (chartId == this.id) {
        this.isStopped = !this.isStopped;
        if (this.isStopped) {
          EventHandler.$off("updateDatas", this.updateDatas);
        } else {
          EventHandler.$on("updateDatas", this.updateDatas);
        }
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
