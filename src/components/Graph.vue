<template>
  <div class="container">
    <div class="col-6">
      <VueApexCharts
        ref="realtimeChart"
        type="area"
        height="350"
        :options="chartOptions"
        :series="series"
      />
    </div>
  </div>
</template>

<script>
let datas = require("json-loader!yaml-loader!../../data.yml");
import VueApexCharts from "vue-apexcharts";

let pepe = [];

// var lastDate = 0;
// var data = [];

// function getDayWiseTimeSeries(baseval, count, yrange) {
//   var i = 0;
//   while (i < count) {
//     var x = baseval;
//     var y =
//       Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

//     data.push({
//       x,
//       y
//     });
//     lastDate = baseval;
//     baseval += 86400000;
//     i++;
//   }
// }

// getDayWiseTimeSeries(new Date("11 Feb 2017 GMT").getTime(), 10, {
//   min: 10,
//   max: 90
// });

// function getNewSeries(baseval, yrange) {
//   var newDate = baseval + 86400000;
//   lastDate = newDate;
//   data.push({
//     x: newDate,
//     y: Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
//   });
// }

// function resetData() {
//   data = data.slice(data.length - 10, data.length);
// }

export default {
  name: "Graph",
  components: {
    VueApexCharts
  },
  data() {
    return {
      counter: 0,
      series: [
        {
          data: []
        }
      ],
      chartOptions: {
        chart: {
          animations: {
            enabled: true,
            easing: "linear",
            dynamicAnimation: {
              speed: 2500
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
          text: "Dynamic Updating Chart",
          align: "left"
        },
        markers: {
          size: 0
        },
        xaxis: {
          type: "category",
          range: 777600000
        },
        legend: {
          show: false
        }
      }
    };
  },
  mounted() {
    console.log(datas);
    console.log(datas.power);
    console.log(datas.power[0]);
    this.intervals();
  },
  methods: {
    intervals() {
      window.setInterval(() => {
        pepe.push({
          x: datas.power.values[this.counter].time,
          y: datas.power.values[this.counter].value
        });

        this.$refs.realtimeChart.updateSeries([
          {
            data: pepe
          }
        ]);
        this.counter++;
      }, 5000);
      // window.setInterval(() => {
      //   getNewSeries(lastDate, {
      //     min: 10,
      //     max: 90
      //   });

      //   this.$refs.realtimeChart.updateSeries([
      //     {
      //       data: data
      //     }
      //   ]);
      // }, 1000);

      // every 60 seconds, we reset the data to prevent memory leaks
      // window.setInterval(() => {
      //   resetData();
      //   this.$refs.realtimeChart.updateSeries(
      //     [
      //       {
      //         data
      //       }
      //     ],
      //     false,
      //     true
      //   );
      // }, 60000);
    }
  }
};
</script>

<style scoped>
</style>
