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

//Change a Number of seconds to a formated hour String HH:mm:ss. It is used by the chart to display the X-axis and a tooltip
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

//This is the Graph Component. I use ApexChart, an open-source modern charting library.
//You can find all the documentation about chart options on https://apexcharts.com/docs/vue-charts/
export default {
  name: "Graph",
  components: {
    VueApexCharts
  },
  props: {
    //The id of the chart.
    id: [Number, String],

    //All loaded and transformed datas.
    allDatas: Array,

    //All minute averages that have been calculated from the loaded and transformed datas.
    averageMinuteData: Array,

    //The final unit. It is used to display the unit is the chart.
    endUnit: String,

    //The title of the chart.
    chartTitle: String,

    //The accuracy that is wanted to show about the datas on the chart.
    decimals: [Number, String]
  },
  data() {
    return {
      //It inform which datas must be displayed. True => prop allDatas || False => prop averageMinuteData.
      showAllDatas: true,

      //It inform if the chart should be updated.
      isStopped: false,

      //It has the datas that must be displayed. Apexchart nomenclature.
      series: [
        {
          name: this.endUnit,
          data: this.allDatas
        }
      ],

      //Options of Apexchart.
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
    //To update the chart.
    EventHandler.$on("updateDatas", this.updateDatas);

    //To change the datas that must be shown
    EventHandler.$on("changeChartDatas", chartId => {
      if (chartId == this.id) {
        this.showAllDatas = !this.showAllDatas;
        this.updateDatas();
      }
    });

    //To stop or restart the update event in order to update or not the chart.
    EventHandler.$on("startStopChartUpdateDatas", chartId => {
      if (chartId == this.id) {
        this.isStopped = !this.isStopped;
        if (this.isStopped) {
          EventHandler.$off("updateDatas", this.updateDatas);
        } else {
          EventHandler.$on("updateDatas", this.updateDatas);
          this.updateDatas();
        }
      }
    });
  },
  methods: {
    //@vuese
    //Calls the Apexchart method updateSeries() to make a realtime chart.
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
