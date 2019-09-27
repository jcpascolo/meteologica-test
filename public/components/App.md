# App

This is the main component, where all the data processing happens.

## Events

<!-- @vuese:App:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|updateDatas|To send the update to the children. Fire for the first data and every 5 seconds.|-|
|startStopChartUpdateDatas|To let a chart know that it should restart/stop updating. Fire when the user toggle between "ALL DATAS" and "MIN AVERAGE".|'chartId' => It is the argument that represent the chart that is wanted to be stopped.|
|changeChartDatas|To change chart's datas between all the datas and the average per minute.|'chartId' => It is the argument that represent the chart that should change the displayed datas.|

<!-- @vuese:App:events:end -->


## Methods

<!-- @vuese:App:methods:start -->
|Method|Description|Parameters|
|---|---|---|
|hourToSecond|To transform the hour string that we recieve from the .yml file into seconds number.|'hour' => It is a String that recieve the hour in the format hh:mm:ss.|
|changeUnit|To changes between multiples and submultiples of a unit.|'startUnit' => It is a String that recieve the initial unit. 'endUnit' => It is a String that recieve the final unit.|
|averageResult|To calculate the average of an array that is passed as an argument.|'lastMinuteDatas' => It has the values of the last minute.|
|kelvinToCelsius|To change from Kelvin temperature to Celsius temperature.|'kelvin' => It has the Kelvin temperature.|
|powerToEnergy|To change from MW power to kWh energy.|'power' => It has the Wattios power. 'time' => It has the time in second to calculate the portion of hour.|
|intervals|To take one data every 5 seconds an update the chart and the info section if it is necessary.|-|
|updateDatas|Start the 5 seconds interval that emit the event which allow the children to update.|-|

<!-- @vuese:App:methods:end -->


