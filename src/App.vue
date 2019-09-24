<template>
  <div id="app">
    <div class="container-fluid">
      <div class="row card my-2 mx-auto" v-for="field in fields" :key="field.id">
        <div class="col-12 col-md-6 px-0 px-md-3">
          <Graph
            :id="field.id"
            :allDatas="field.allLoadedDatas"
            :averageMinuteData="field.minuteAverageDatas"
            :endUnit="field.endUnit"
            :decimals="field.accuracy"
            :chartTitle="field.title"
          />
        </div>
        <div class="col-12 col-md-6 d-flex">
          <div class="row my-auto">
            <div class="col-12 px-2 px-md-3" @click="changeChartDatas(field.id)">
              <ToggleButton />
            </div>
            <div class="col-12">
              <DataSection
                :lastData="field.lastValue"
                :averageMinuteData="field.lastMinAverageValue"
                :startUnit="field.startUnit"
                :endUnit="field.endUnit"
              />
              <button @click="stopUpdateDatas(field.id)">Stop</button>
              <button @click="restartUpdateDatas(field.id)">Start</button>
              <button @click="field.isTotallyStopped = !field.isTotallyStopped">Stop / Start</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let Datas = require("json-loader!yaml-loader!../data.yml");

import Graph from "./components/Graph";
import DataSection from "./components/DataSection";
import ToggleButton from "./components/ToggleButton";

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
    DataSection,
    ToggleButton
  },
  data() {
    return {
      fields: [],
      isActive: true
    };
  },
  mounted() {
    Object.keys(Datas).forEach((field, index) => {
      //endUnit, changeUnitFunc, accuracy and chartTitle are hardcoded but in a real case
      //they could be in the data file and it would be scalable (more than two fields)
      let endUnit = field == "temperature" ? "Celsius" : "kWh";
      let changeUnitFunc =
        field == "temperature" ? this.kelvinToCelsius : this.powerToEnergy;
      let accuracy = field == "temperature" ? 2 : 4;
      let title = field == "temperature" ? "Average Temperature" : "Energy";

      this.fields.push({
        id: index,
        fieldName: field,
        allLoadedDatas: [
          {
            x: this.hourToSecond(Datas[field].values[0].time),
            y: changeUnitFunc(Datas[field].values[0].value)
          }
        ],
        minuteAverageDatas: [
          {
            x: this.hourToSecond(Datas[field].values[0].time),
            y: changeUnitFunc(
              this.averageResult([parseFloat(Datas[field].values[0].value)])
            )
          }
        ],
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
        },
        accuracy,
        title,
        counter: 1,
        isTotallyStopped: false
      });
    });

    EventHandler.$emit("updateDatas");
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
        this.fields.forEach(field => {
          if (!field.isTotallyStopped) {
            field.allLoadedDatas.push({
              x: this.hourToSecond(
                Datas[field.fieldName].values[field.counter].time
              ),
              y: field.changeUnitFunc(
                Datas[field.fieldName].values[field.counter].value
              )
            });

            field.lastValue = {
              time: Datas[field.fieldName].values[field.counter].time,
              originalData: Datas[field.fieldName].values[field.counter].value,
              transformedData: field.changeUnitFunc(
                Datas[field.fieldName].values[field.counter].value
              )
            };

            if (
              this.hourToSecond(
                Datas[field.fieldName].values[field.counter].time
              ) %
                60 ==
              0
            ) {
              field.minuteAverageDatas.push({
                x: this.hourToSecond(
                  Datas[field.fieldName].values[field.counter].time
                ),
                y: field.changeUnitFunc(this.averageResult(field.currentDatas))
              });

              field.lastMinAverageValue = {
                time: Datas[field.fieldName].values[field.counter].time,
                originalData: this.averageResult([
                  parseFloat(Datas[field.fieldName].values[field.counter].value)
                ]),
                transformedData: field.changeUnitFunc([
                  parseFloat(Datas[field.fieldName].values[field.counter].value)
                ])
              };

              field.currentDatas = [];
              field.currentDatas.push(
                parseFloat(Datas[field.fieldName].values[field.counter].value)
              );
            } else {
              field.currentDatas.push(
                parseFloat(Datas[field.fieldName].values[field.counter].value)
              );
            }
            field.counter++;
          }
        });
      }, 5000);
    },

    updateDatas() {
      window.setInterval(() => {
        EventHandler.$emit("updateDatas");
      }, 5000);
    },

    stopUpdateDatas(chartId) {
      EventHandler.$emit("stopUpdateDatas", chartId);
    },

    restartUpdateDatas(chartId) {
      EventHandler.$emit("restartUpdateDatas", chartId);
    },

    changeChartDatas(chartId) {
      EventHandler.$emit("changeChartDatas", chartId);
      EventHandler.$emit("updateDatas");
    }
  }
};
</script>


<style lang="scss">
body {
  background: linear-gradient(90deg, #009688, #3f51b5);
}

.card {
  padding-top: 8px;
  padding-bottom: 8px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  background-color: white;
}

.card:hover {
  padding-top: 10px;
  padding-bottom: 10px;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.6);
}
</style>
