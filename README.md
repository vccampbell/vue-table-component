# vue-table-component
A Vue component to display tabular data. Supports sorting, paging and filtering. Base structure from:
[github](https://github.com/ozoono/vue-table-component)

## Demo
Coming Soon!

## Usage
```html
  <TableView
    :headers="[
      {"title":"First Name", "field":"first_name", "active":false,"options":[],"filteredValue":null,"type":"String","sortable":true},
      {"title":"Email", "field":"email", "active":false,"options":[],"filteredValue":null,"type":"String","sortable":true},
      {"title":"Age", "field":"age", "active":false,"options":[],"filteredValue":null,"type":"String","sortable":true}
    ]",
    :rows="[
      {"first_name":"Isidor" ,"email":"igatenby0@stanford.edu", "age":20},
      {"first_name":"Max", "email":"mchimienti1@ebay.vi", "age":32},
      {"first_name":"Brigham", "email":"bibell2@businesswire.com", "age":54},
      {"first_name":"Jakob", "email":"jcecil3@cmu.kz", "age":37},
      {"first_name":"Brannon" ,"email":"btamsett4@jiathis.com", "age":18}
    ]",      
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
  </TableView>
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
    .ozn-table {
        ...
    }
    .ozn-paginator {
        ...
    }
}
</style>
```

#### Columns definition
Each column must be defined with 4 parameters:
- **label**: text that will be shown in the column header
- **field**: data field related to the column
- **sortable**: [true/false]
- **type**: [String/Number]

