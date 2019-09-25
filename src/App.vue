<template>
  <div id="app">
    <div class="container-fluid px-1 px-sm-2 px-md-3">
      <div class="row card my-3 py-2 mx-auto" v-for="field in fields" :key="field.id">
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
            <div class="col-12 py-2 px-2 px-md-3" @click="changeChartDatas(field.id)">
              <ToggleButton leftText="all datas" rightText="min average" />
            </div>
            <div class="col-12">
              <DataSection
                :lastData="field.lastValue"
                :averageMinuteData="field.lastMinAverageValue"
                :startUnit="field.startUnit"
                :endUnit="field.endUnit"
                :decimals="field.accuracy"
              />
              <div class="col-12 py-2 px-2 px-md-3" @click="startStopChartUpdateDatas(field.id)">
                <p
                  class="toggle-info text-center"
                >Click if you want to stop/start just the chart update</p>
                <ToggleButton leftText="start" rightText="stop" />
              </div>
              <div
                class="col-12 py-2 px-2 px-md-3"
                @click="field.isTotallyStopped = !field.isTotallyStopped"
              >
                <p
                  class="toggle-info text-center"
                >Click if you want to stop/start the chart and the information update</p>
                <ToggleButton leftText="start" rightText="stop" />
              </div>
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
      fields: []
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
        lastMinuteDatas: [parseFloat(Datas[field].values[0].value)],
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
    averageResult(lastMinuteDatas) {
      let average = 0;
      lastMinuteDatas.forEach(value => {
        average += value;
      });
      return average / lastMinuteDatas.length;
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
            let currentTime = Datas[field.fieldName].values[field.counter].time;
            let currentValue =
              Datas[field.fieldName].values[field.counter].value;

            let timeInSeconds = this.hourToSecond(currentTime);

            let formatedLastValue = field.changeUnitFunc(currentValue);

            field.allLoadedDatas.push({
              x: timeInSeconds,
              y: formatedLastValue
            });

            field.lastValue = {
              time: currentTime,
              originalData: currentValue,
              transformedData: formatedLastValue
            };

            if (timeInSeconds % 60 == 0) {
              let formatedLastMinAverageValue = field.changeUnitFunc(
                this.averageResult(field.lastMinuteDatas)
              );

              field.minuteAverageDatas.push({
                x: timeInSeconds,
                y: formatedLastMinAverageValue
              });

              field.lastMinAverageValue = {
                time: currentTime,
                originalData: this.averageResult(field.lastMinuteDatas),
                transformedData: formatedLastMinAverageValue
              };

              field.lastMinuteDatas = [];
              field.lastMinuteDatas.push(parseFloat(currentValue));
            } else {
              field.lastMinuteDatas.push(parseFloat(currentValue));
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

    startStopChartUpdateDatas(chartId) {
      EventHandler.$emit("startStopChartUpdateDatas", chartId);
    },

    changeChartDatas(chartId) {
      EventHandler.$emit("changeChartDatas", chartId);
    }
  }
};
</script>


<style lang="scss">
body {
  background: linear-gradient(90deg, #009688, #3f51b5);
  font-family: "Source Sans Pro", sans-serif;
}

p {
  margin-top: 0px;
  margin-bottom: 0px;
}

.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  background-color: white;
}

.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.6);
}

.text-center {
  text-align: center;
}

.toggle-info {
  font-size: 0.7rem;
  word-spacing: 3px;
  font-style: italic;
}
</style>
