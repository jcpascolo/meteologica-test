<template>
  <div id="app">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 col-md-6 px-0 px-md-3">
          <Graph
            id="0"
            :allDatas="allTemperatureLoadedDatas"
            :averageMinuteData="minuteAverageTemperatureDatas"
            :endUnit="temperatureEndUnit"
            decimals="2"
            chartTitle="Temperatura media"
          />
          <button @click="changeChartDatas(0)">Change to all datas</button>
          <button @click="changeChartDatas(0)">Change to minute average</button>
        </div>
        <div class="col-12 col-md-6">
          <DataSection
            :lastData="lastTemp"
            :averageMinuteData="lastMinAverageTemp"
            :startUnit="temperatureStartUnit"
            :endUnit="temperatureEndUnit"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-md-6 px-0 px-md-3">
          <Graph
            id="1"
            :allDatas="allPowerLoadedDatas"
            :averageMinuteData="minuteAveragePowerDatas"
            :endUnit="powerEndUnit"
            decimals="4"
            chartTitle="Energía"
          />
          <button @click="changeChartDatas(1)">Change to all datas</button>
          <button @click="changeChartDatas(1)">Change to minute average</button>
        </div>
        <div class="col-12 col-md-6">
          <DataSection
            :lastData="lastPower"
            :averageMinuteData="lastMinAveragePower"
            :startUnit="powerStartUnit"
            :endUnit="powerEndUnit"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let Datas = require("json-loader!yaml-loader!../data.yml");

import Graph from "./components/Graph";
import DataSection from "./components/DataSection";

let changes = {
  m: 1e-3,
  c: 1e-2,
  d: 1e-1,
  unit: 1,
  da: 1e1,
  h: 1e2,
  k: 1e3,
  M: 1e4
};

export default {
  name: "app",
  components: {
    Graph,
    DataSection
  },
  data() {
    return {
      fields: [],
      allTemperatureLoadedDatas: [],
      allPowerLoadedDatas: [],
      minuteAverageTemperatureDatas: [],
      minuteAveragePowerDatas: [],
      currentTemperatureDatas: [],
      currentPowerDatas: [],
      temperatureStartUnit: Datas.temperature.unit,
      powerStartUnit: Datas.power.unit,
      temperatureEndUnit: "ºC",
      powerEndUnit: "kWh",
      lastTemp: {},
      lastMinAverageTemp: {},
      lastPower: {},
      lastMinAveragePower: {},
      counter: 0
    };
  },
  mounted() {
    Object.keys(Datas).forEach((field, index) => {
      //endUnit and changeUnitFunc are hardcoded but in a real case they could be in the data file
      //and it would be scalable (more than two fields)
      let endUnit = field == "temperature" ? "Celsius" : "kWh";
      let changeUnitFunc =
        field == "temperature" ? this.kelvinToCelsius : this.powerToEnergy;
      this.fields.push({
        id: index,
        fieldName: field,
        allLoadedDatas: [],
        minuteAverageDatas: [],
        currentDatas: [parseFloat(Datas[field].values[0].value)],
        startUnit: Datas[field].unit,
        endUnit,
        changeUnitFunc,
        lastValue: {
          time: Datas[field].values[0].time,
          originalData: Datas[field].values[0].value,
          transformedData: changeUnitFunc(Datas[field].values[0].value)
        },
        lastMinAverageValue: {
          time: Datas[field].values[0].time,
          originalData: this.averageResult([
            parseFloat(Datas[field].values[0].value)
          ]),
          transformedData: changeUnitFunc([
            parseFloat(Datas[field].values[0].value)
          ])
        }
      });
    });

    this.currentTemperatureDatas.push(
      parseFloat(Datas.temperature.values[0].value)
    );
    this.currentPowerDatas.push(parseFloat(Datas.power.values[0].value));
    this.intervals();
    this.updateDatas();
  },
  methods: {
    hourToSecond(hour) {
      let dividedTime = hour.split(":");
      return (
        parseInt(dividedTime[0]) * 3600 +
        parseInt(dividedTime[1]) * 60 +
        parseInt(dividedTime[2])
      );
    },
    changeUnit(startUnit, endUnit) {
      return endUnit == "unit"
        ? changes[startUnit.substr(0, startUnit.length - 1)] / changes["unit"]
        : changes[startUnit.substr(0, startUnit.length - 1)] /
            changes[endUnit.substr(0, endUnit.length - 1)];
    },
    averageResult(currentDatas) {
      let average = 0;
      currentDatas.forEach(value => {
        average += value;
      });
      return average / currentDatas.length;
    },
    kelvinToCelsius(kelvin) {
      let change = this.changeUnit(Datas.temperature.unit, "unit");
      return kelvin * change - 273.15;
    },
    powerToEnergy(power, time = 60) {
      let change = this.changeUnit(Datas.power.unit, "kW");
      return (power * change) / time;
    },
    intervals() {
      window.setInterval(() => {
        this.allTemperatureLoadedDatas.push({
          x: this.hourToSecond(Datas.temperature.values[this.counter].time),
          y: this.kelvinToCelsius(Datas.temperature.values[this.counter].value)
        });

        this.lastTemp = {
          time: Datas.temperature.values[this.counter].time,
          originalData: Datas.temperature.values[this.counter].value,
          transformedData: this.kelvinToCelsius(
            Datas.temperature.values[this.counter].value
          )
        };

        if (
          this.hourToSecond(Datas.temperature.values[this.counter].time) % 60 ==
          0
        ) {
          this.minuteAverageTemperatureDatas.push({
            x: this.hourToSecond(Datas.temperature.values[this.counter].time),
            y: this.kelvinToCelsius(
              this.averageResult(this.currentTemperatureDatas)
            )
          });

          this.lastMinAverageTemp = {
            time: Datas.temperature.values[this.counter].time,
            originalData: this.averageResult(this.currentTemperatureDatas),
            transformedData: this.kelvinToCelsius(
              this.averageResult(this.currentTemperatureDatas)
            )
          };

          this.currentTemperatureDatas = [];
          this.currentTemperatureDatas.push(
            parseFloat(Datas.temperature.values[this.counter].value)
          );
        } else {
          this.currentTemperatureDatas.push(
            parseFloat(Datas.temperature.values[this.counter].value)
          );
        }

        this.allPowerLoadedDatas.push({
          x: this.hourToSecond(Datas.power.values[this.counter].time),
          y: this.powerToEnergy(Datas.power.values[this.counter].value)
        });

        this.lastPower = {
          time: Datas.power.values[this.counter].time,
          originalData: parseFloat(Datas.power.values[this.counter].value),
          transformedData: this.powerToEnergy(
            Datas.power.values[this.counter].value
          )
        };

        if (
          this.hourToSecond(Datas.power.values[this.counter].time) % 60 ==
          0
        ) {
          this.minuteAveragePowerDatas.push({
            x: this.hourToSecond(Datas.power.values[this.counter].time),
            y: this.powerToEnergy(this.averageResult(this.currentPowerDatas))
          });

          this.lastMinAveragePower = {
            time: Datas.power.values[this.counter].time,
            originalData: this.averageResult(this.currentPowerDatas),
            transformedData: this.powerToEnergy(
              this.averageResult(this.currentPowerDatas)
            )
          };

          this.currentPowerDatas = [];
          this.currentPowerDatas.push(
            parseFloat(Datas.power.values[this.counter].value)
          );
        } else {
          this.currentPowerDatas.push(
            parseFloat(Datas.power.values[this.counter].value)
          );
        }

        this.counter++;
      }, 5000);
    },

    updateDatas() {
      window.setInterval(() => {
        EventHandler.$emit("updateDatas");
      }, 5000);
    },

    changeChartDatas(chartId) {
      EventHandler.$emit("changeChartDatas", chartId);
      EventHandler.$emit("updateDatas");
    }
  }
};
</script>

<style>
body {
  background: linear-gradient(90deg, #009688, #3f51b5);
}
</style>
