# vue-filter-table-component
A Vue component to display tabular data. Supports sorting, paging and filtering. Base structure from:
[github](https://github.com/ozoono/vue-table-component)

- Uses FontAwesome icons
- requires node-sass
- Installs as a standalone component, just import it. Components are globally-registered
`import 'vue-table-filter-component'`

![menu example](https://github.com/vccampbell/vue-table-component/blob/master/docs/screenshot1.png)
## Demo
[https://vccampbell.github.io/](https://vccampbell.github.io/)

## Basic Usage
```html
  <table-view
    :headers="[
      {"title":"First Name","field":"first_name","active":false,"type":"String","sortable":true,"filterable":true},
    {"title":"Last Name","field":"last_name","active":false,"type":"String","sortable":true,"filterable":true},
    {"title":"Email","field":"email","active":false,"type":"String","sortable":true,"filterable":true},
    {"title":"Age","field":"age","active":false,"type":"Number","sortable":true,"filterable":true},
    {"title":"Country","field":"country","active":false,"type":"String","sortable":true,"filterable":true},
    {"title":"Category","field":"category","active":false,"type":"String","sortable":true,"filterable":true},
    {"title":"Last Update","field":"last_update","active":false,"type":"String","sortable":true,"filterable":true}
    ]",
    :rows="[{"first_name":"Isidor","last_name":"Gatenby","email":"igatenby0@stanford.edu","age":20,"country":"El Salvador","category":"A2","last_update":"2017-12-14"},
  {"first_name":"Max","last_name":"Chimienti","email":"mchimienti1@ebay.vi","age":32,"country":"Vietnam","category":"B2","last_update":"2018-04-28"},
  {"first_name":"Brigham","last_name":"Ibell","email":"bibell2@businesswire.com","age":54,"country":"Australia","category":"D1","last_update":"2017-02-23"},
  {"first_name":"Jakob","last_name":"Cecil","email":"jcecil3@cmu.kz","age":37,"country":"Kazakhstan","category":"A2","last_update":"2017-01-21"},
  {"first_name":"Brannon","last_name":"Tamsett","email":"btamsett4@jiathis.com","age":18,"country":"Portugal","category":"B2","last_update":"2017-06-20"},
  {"first_name":"Alexio","last_name":"Stirrip","email":"astirrip5@reference.com","age":31,"country":"Iceland","category":"D1","last_update":"2018-04-08"},
  {"first_name":"Sallyann","last_name":"Lugsdin","email":"slugsdin6@netvibes.com","age":53,"country":"France","category":"A1","last_update":"2017-08-26"},
  {"first_name":"Guntar","last_name":"McGorman","email":"gmcgorman7@aol.com","age":34,"country":"Chile","category":"C2","last_update":"2018-05-19"},
  {"first_name":"Hagan","last_name":"Slobom","email":"hslobom8@netvibes.com","age":56,"country":"United States","category":"A1","last_update":"2018-09-16"},
  {"first_name":"Izak","last_name":"Kempston","email":"ikempston9@soup.io","age":56,"country":"Poland","category":"B3","last_update":"2018-09-16"},
  {"first_name":"Lucky","last_name":"Deville","email":"ldevillea@nifty.com","age":50,"country":"Serbia","category":"A3","last_update":"2017-01-10"},
  {"first_name":"Wang","last_name":"Xiyu","email":"wangxiyu@baidu.com","age":24,"country":"China","category":"A1","last_update":"2018-07-06"},
  {"first_name":"Avis","last_name":"Eddolls","email":"aeddollsc@desdev.be","age":26,"country":"Belgium","category":"A3","last_update":"2017-03-21"},
  {"first_name":"Farr","last_name":"Blyden","email":"fblydend@who.int","age":52,"country":"Greece","category":"A3","last_update":"2017-01-16"},
  {"first_name":"Peng","last_name":"Shuai","email":"pengshuai@amazon.com","age":21,"country":"China","category":"B1","last_update":"2017-06-10"}]",      
    :sort="{
      field: 'first_name',
      order: 'asc'
    }",
    :pagination="{
      itemsPerPage: 10,
      align: 'center',
      visualStyle: 'select'
    }",
    css-style="my-css-style"
  >
    <template v-slot:items="{ row }">
      <td>{{ row.first_name }}</td>  
      <td>{{ row.email }}</td>              
      <td>{{ row.age }}</td>            
    </template>
    <template v-slot:no-data>
      <span>No data</span>
    </template>
  </table-view>
```
## Advanded Usage
Table headers supports slots, so you can pass in custom content for each column header in the dataset. Note this will override all of the sorting and filtering functionality. This can be used if you have a custom column header information. 
```html
<template v-slot:[field]="{ column }">
  <!-- custom content -->
</template>  
```
The screenshot below shows a use-case for custom column headers by allowing a 'select all' feature.
![selectall menu example](https://github.com/vccampbell/vue-table-component/blob/master/docs/screenshot2.png)
```html
<template v-slot:ID="{ column }">
  <table>
    <tr>
      <td><input type="radio" value="Approve" v-model="selectedAction" @click="selectAllApprove" /> Approve</td>
      <td><input type="radio" value="Reject" v-model="selectedAction" @click="selectAllReject" /> Reject</td>
      <td><input type="radio" value="No Action" v-model="selectedAction" @click="selectAllNoAction" /> No Action</td>
    </tr>
  </table>
</template>
```
#### Props
- `headers`: (required) array with table columns definition (See columns definition)
- `rows`: (required) array with data to fill the table
- `sort`: object with sorting configuration
  - **field**: initial sort field
  - **order**: [asc/desc]  sort order
- `pagination`: object with pagination configuration
  - **enabled**: [true/false]
  - **itemsPerPage**: number of rows in each page
  - **align**: [left/center/right] position of the paginator (Default 'right')
  - **visualStyle**: [select/button] paginator style (Default 'button')
- `css-style`: css class that will be applied to the component instead of default styles. Custom styles must be defined in this way:
```css
<style lang="scss">
.my-css-style{
    .my-table {
        ...
    }
    .my-paginator {
        ...
    }
}
</style>
```

#### Columns definition
Each column must be defined with 5 properties:
- **title**: text that will be shown in the column header
- **field**: data field related to the column
- **sortable**: [true/false]
- **filterable**: [true/false]
- **type**: [String/Number]

