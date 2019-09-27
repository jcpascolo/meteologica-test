# meteologica-test

## Description

This project has been created for a job application in [Meteologica](http://www.meteologica.com/).

It has been made in Vue.js using the vue-cli.

## Followed Steps

### Step 1

The first step was to load the datas from the .yml file and take one data every 5 seconds.

### Step 2

The second step was to deal with the chart and all the options that it has. The major problem was how to format the datas of the X-axis, that is to say, the time.

### Step 3

The third step was to calculate:

- the temperature change from Kelvin to Celsius
- the power change to energy from MW to kWh
- the average per minute of each field

### Step 4

The fourth step was to manage the datas and chart updates. That means:

- when both of them should be totally stopped
- when the datas should continue being updated but the chart should stop
- when both of them should continue being updated

### Step 5

The fifth step was to style the interface.

### Step 6

The sixth step was to refactor the code.

### Step 7

The final step was to document the code. For this purpose a new and nice package was used. This package name is [Vuese](https://github.com/vue-contrib/vuese) and the instructions that were followed can be found on [Vuese Tutorial](https://dev.to/berniwittmann/quick--easy-documentation-generation-for-vuejs-components-7k6)
