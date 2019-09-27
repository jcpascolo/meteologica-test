# Graph

This is the Graph Component. I use ApexChart, an open-source modern charting library. You can find all the documentation about chart options on https://apexcharts.com/docs/vue-charts/

## Props

<!-- @vuese:Graph:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|id|The id of the chart.|`Number` /  `String`|`false`|-|
|allDatas|All loaded and transformed datas.|`Array`|`false`|-|
|averageMinuteData|All minute averages that have been calculated from the loaded and transformed datas.|`Array`|`false`|-|
|endUnit|The final unit. It is used to display the unit in the chart.|`String`|`false`|-|
|chartTitle|The title of the chart.|`String`|`false`|-|
|decimals|The accuracy which the datas must be displayed on the chart.|`Number` /  `String`|`false`|-|

<!-- @vuese:Graph:props:end -->


## Methods

<!-- @vuese:Graph:methods:start -->
|Method|Description|Parameters|
|---|---|---|
|updateDatas|Calls the Apexchart method updateSeries() to make a realtime chart.|-|

<!-- @vuese:Graph:methods:end -->


