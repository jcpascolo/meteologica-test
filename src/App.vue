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
//To load all the datas from the the .yml file.
let Datas = require("json-loader!yaml-loader!../data.yml");

import Graph from "./components/Graph";
import DataSection from "./components/DataSection";
import ToggleButton from "./components/ToggleButton";

//Multiples and submultiples of all units of measurement.
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

//This is the main component, where all the data processing happens.
export default {
  name: "App",

  components: {
    Graph,
    DataSection,
    ToggleButton
  },

  data() {
    return {
      //This array contains one object per field that is on the .yml file.
      //In that case we have two fields, temperature and power.
      fields: []
    };
  },

  mounted() {
    //At the begining we iterate through the keys of the file.
    Object.keys(Datas).forEach((field, index) => {
      //endUnit, changeUnitFunc, accuracy and chartTitle are hardcoded but in a real case
      //they could be in the data file and it would be scalable (more than two fields)
      let endUnit = field == "temperature" ? "Celsius" : "kWh";
      let changeUnitFunc =
        field == "temperature" ? this.kelvinToCelsius : this.powerToEnergy;
      let accuracy = field == "temperature" ? 2 : 4;
      let title = field == "temperature" ? "Average Temperature" : "Energy";

      //For each field we save
      this.fields.push({
        //The id. It is useful in order to know which chart should be stopped in case of stopping the updates.
        id: index,

        //The fieldName. It is useful in order to find the right datas in the .yml file every 5 seconds (to know if we want the temperature or the power data).
        fieldName: field,

        //The allLoadedDatas. It saves all the datas already transformed in the wanted units.
        allLoadedDatas: [
          {
            x: this.hourToSecond(Datas[field].values[0].time),
            y: changeUnitFunc(Datas[field].values[0].value)
          }
        ],

        //The minuteAverageDatas. It saves all the average datas per minute.
        minuteAverageDatas: [
          {
            x: this.hourToSecond(Datas[field].values[0].time),
            y:
              field == "temperature"
                ? changeUnitFunc(
                    this.averageResult([
                      parseFloat(Datas[field].values[0].value)
                    ])
                  )
                : changeUnitFunc(
                    this.averageResult([
                      parseFloat(Datas[field].values[0].value)
                    ]),
                    60
                  )
          }
        ],

        //The lastMinuteDatas. It saves only the values of the last minute in order to make the average.
        lastMinuteDatas: [parseFloat(Datas[field].values[0].value)],

        //The startUnit. It has the initial unit of the datas.
        startUnit: Datas[field].unit,

        //The endUnit. It has the final unit that we want to achieve.
        endUnit,

        //The changeUnitFunc. It holds the function which transform the datas from startUnit to endUnit.
        changeUnitFunc,

        //The lastValue. It saves the last value taken form the file.
        lastValue: {
          time: Datas[field].values[0].time,
          originalData: Datas[field].values[0].value,
          transformedData: changeUnitFunc(Datas[field].values[0].value)
        },

        //The lastMinAverageValue. It save the last minute average value that was calculated.
        lastMinAverageValue: {
          time: Datas[field].values[0].time,
          originalData: this.averageResult([
            parseFloat(Datas[field].values[0].value)
          ]),
          transformedData:
            field == "temperature"
              ? changeUnitFunc([parseFloat(Datas[field].values[0].value)])
              : changeUnitFunc([parseFloat(Datas[field].values[0].value)], 60)
        },

        //The accuracy. It has the accuracy of the values. This means, to which number of decimal it should be rounded.
        accuracy,

        //The title. It has the title of the chart.
        title,

        //The counter. It saves the index of the next data that should be taken from the file.
        counter: 1,

        //The isTotallyStopped. If it is true it means that nothing must be updated.
        isTotallyStopped: false
      });
    });

    //To send the update to the children.
    //Fire for the first data and every 5 seconds.
    EventHandler.$emit("updateDatas");
    this.intervals();
    this.updateDatas();
  },

  methods: {
    //@vuese
    //To transform the hour string that we recieve from the .yml file into seconds with type number.
    //@arg 'hour' => It is a String that recieve the hour in the format hh:mm:ss.
    hourToSecond(hour) {
      let dividedTime = hour.split(":");
      return (
        parseInt(dividedTime[0]) * 3600 +
        parseInt(dividedTime[1]) * 60 +
        parseInt(dividedTime[2])
      );
    },

    //@vuese
    //To change between multiples and submultiples of a unit.
    //@arg 'startUnit' => It is a String that recieves the initial unit.
    //@arg 'endUnit' => It is a String that recieves the final unit.
    changeUnit(startUnit, endUnit) {
      return endUnit == "unit"
        ? changes[startUnit.substr(0, startUnit.length - 1)] / changes["unit"]
        : changes[startUnit.substr(0, startUnit.length - 1)] /
            changes[endUnit.substr(0, endUnit.length - 1)];
    },

    //@vuese
    //To calculate the average of an array that is passed as an argument.
    //@arg 'lastMinuteDatas' => It has the values of the last minute.
    averageResult(lastMinuteDatas) {
      let average = 0;
      lastMinuteDatas.forEach(value => {
        average += value;
      });
      return average / lastMinuteDatas.length;
    },

    //@vuese
    //To change from Kelvin temperature to Celsius temperature.
    //@arg 'kelvin' => It has the Kelvin temperature.
    kelvinToCelsius(kelvin) {
      let change = this.changeUnit(Datas.temperature.unit, "unit");
      return kelvin * change - 273.15;
    },

    //@vuese
    //To change from MW power to kWh energy.
    //@arg 'power' => It has the Wattios power.
    //@arg 'time' => It has the time in seconds to calculate its proportion to an hour.
    powerToEnergy(power, time = 5) {
      let timeChangedToHour = parseInt(time, 10) / 3600;
      let change = this.changeUnit(Datas.power.unit, "kW");
      return power * change * timeChangedToHour;
    },

    //@vuese
    //To take one data every 5 seconds an update the chart and the info section if it is necessary.
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
              let formatedLastMinAverageValue =
                field.fieldName == "temperature"
                  ? field.changeUnitFunc(
                      this.averageResult(field.lastMinuteDatas)
                    )
                  : field.changeUnitFunc(
                      this.averageResult(field.lastMinuteDatas),
                      60
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

    //@vuese
    //Starts the 5 seconds interval that emits the event which allows the children to update.
    updateDatas() {
      window.setInterval(() => {
        EventHandler.$emit("updateDatas");
      }, 5000);
    },

    startStopChartUpdateDatas(chartId) {
      //To let a chart know that it should start/stop updating.
      //Fire when the user toggles between "ALL DATAS" and "MIN AVERAGE".
      //@arg 'chartId' => It is the argument that represents the chart that want to be stopped.
      EventHandler.$emit("startStopChartUpdateDatas", chartId);
    },

    changeChartDatas(chartId) {
      //To change charts datas between all the datas and the average per minute.
      //@arg 'chartId' => It is the argument that represents the chart that should change the displayed datas.
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
