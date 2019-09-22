<template>
  <div id="app">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 col-md-6 px-0 px-md-3">
          <Graph
            :datas="allTemperatureLoadedDatas"
            :endUnit="temperatureEndUnit"
            decimals="2"
            chartTitle="Temperatura media"
          />
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
            :datas="allPowerLoadedDatas"
            :endUnit="powerEndUnit"
            decimals="4"
            chartTitle="Energía"
          />
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
    this.currentTemperatureDatas.push(
      parseFloat(Datas.temperature.values[0].value)
    );
    this.currentPowerDatas.push(parseFloat(Datas.power.values[0].value));
    this.intervals();
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
    averageTemperature(currentDatasTemp) {
      let averageTemperature = 0;
      currentDatasTemp.forEach(temp => {
        averageTemperature += temp;
      });
      return averageTemperature / currentDatasTemp.length;
    },
    averagePower(currentDatasPower) {
      let averagePower = 0;
      currentDatasPower.forEach(power => {
        averagePower += power;
      });
      return averagePower / currentDatasPower.length;
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
              this.averageTemperature(this.currentTemperatureDatas)
            )
          });

          this.lastMinAverageTemp = {
            time: Datas.temperature.values[this.counter].time,
            originalData: this.averageTemperature(this.currentTemperatureDatas),
            transformedData: this.kelvinToCelsius(
              this.averageTemperature(this.currentTemperatureDatas)
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
            y: this.powerToEnergy(this.averagePower(this.currentPowerDatas))
          });

          this.lastMinAveragePower = {
            time: Datas.power.values[this.counter].time,
            originalData: this.averagePower(this.currentPowerDatas),
            transformedData: this.powerToEnergy(
              this.averagePower(this.currentPowerDatas)
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

      window.setInterval(() => {
        EventHandler.$emit("updateDatas");
      }, 5000);
    }
  }
};
</script>

<style>
</style>
