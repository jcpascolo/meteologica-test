# DataSection

This is the information component. It displays the last data that was taken from the file and the average of the last minute.

## Props

<!-- @vuese:DataSection:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|lastData|The info about the time, original data and transformed data of the last data.|`Object`|`false`|-|
|averageMinuteData|The info about the time, original data and transformed data of the last minute average.|`Object`|`false`|-|
|startUnit|The initial unit.|`String`|`false`|-|
|endUnit|The final unit.|`String`|`false`|-|
|decimals|The accuracy which the datas must be displayed.|`Number` /  `String`|`false`|-|

<!-- @vuese:DataSection:props:end -->


## Methods

<!-- @vuese:DataSection:methods:start -->
|Method|Description|Parameters|
|---|---|---|
|roundNumber|To round the values that must be displayed with the accuracy that was indicated on the 'decimals' prop.|'num' => It is the number that is wanted to be rounded.|

<!-- @vuese:DataSection:methods:end -->


