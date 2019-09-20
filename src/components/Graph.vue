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

// let allDatas = [];

export default {
  name: "Graph",
  components: {
    VueApexCharts
  },
  data() {
    return {
      allDatas: [],
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
          type: "numeric",
          range: 5,
          tickAmount: 5,
          labels: {
            formatter: function(value, timestamp) {
              // console.log("EN DONDE QUIERO");
              // console.log(value);
              // console.log(timestamp);
              return "pepe: " + value; // The formatter function overrides format property
            }
          },
          tooltip: {
            formatter: function(val, opts) {
              // console.log(val);
              // console.log(opts.dataPointIndex);
              // console.log(opts.series);
              // console.log(opts.series[0][opts.dataPointIndex]);
              return "00:00:" + val;
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
    this.intervals();
  },
  methods: {
    intervals() {
      window.setInterval(() => {
        this.allDatas.push({
          // x: datas.power.values[this.counter].time,
          x: this.counter + 1,
          y: datas.power.values[this.counter].value
        });

        this.$refs.realtimeChart.updateSeries([
          {
            data: this.allDatas
          }
        ]);
        this.counter++;
      }, 6000);
    }
  }
};
</script>

<style scoped>
</style>
