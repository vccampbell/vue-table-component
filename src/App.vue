<template>
  <div id="app">
    <h2>Custom styles example:</h2>
    <table-view
      :headers="columns"
      :rows="items"      
      :sort="sort2"
      :pagination="pagination"
      css-style="table table-sm"      
    >
      <template v-slot:items="{ row }">
        <td><i @click="select(row)" class="fa fa-ellipsis-h" aria-hidden="true"></i> {{ row.first_name }}</td>
        <td>{{ row.last_name }}</td>   
        <td>{{ row.email }}</td>              
        <td>{{ row.age }}</td>     
        <td>{{ row.country }}</td>                 
        <td>{{ row.category }}</td>
        <td>{{ row.last_update }}</td>        
      </template>      
      <template v-slot:no-data>
        <span>Empty.</span>
      </template>
    </table-view>
  </div>
</template>
<script>
import { columns, rows } from './data'
import TableView from '@/components/TableView'

export default {
  name: 'App',
  components:{
    TableView
  },
  data(){
    return{
      columns: columns,
      items: rows,      
      sort1:{
        field: 'first_name',
        order: 'asc'
      },
      sort2:{
        field: 'email',
        order: 'asc'
      },      
      pagination:{
        itemsPerPage: 10,
        align: 'center',
        visualStyle: 'buttons'
      }
    }    
  },
  methods: {
    select(row) {
    }
  }
}
</script>
<style lang="scss">
@import url(https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css);
@import url(https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css);
@import url(http://fonts.googleapis.com/css?family=Roboto+Mono);
body, html{
  height: 100%;
}
#app {
  font-family: 'Roboto Mono', Helvetica, Arial, sans-serif;
  font-size: 11px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 90%;
  margin: 0 auto;
}
h1{
  margin-bottom: 2em;
  color: #f90;
}
.separator{
  margin: 2em 0;
  text-align: center;
}
.custom-style {
  // Table styles
  .vcc-table {
    border-collapse: collapse;
    width: 100%;
    thead {
      th { 
        border-bottom: 1px solid #ffffff;
        padding: 0 10px;
        height: 48px;
        text-align: left; 
        font-size: 1em; 
        color: #fff;
        background-color: #7cc3fd; 
        cursor: pointer; 
        &:hover{
          span{
            text-decoration: underline;
            text-decoration-style: dotted;
          }
        }        
        i{
          color: #ffffff; 
          &.active{
            color: #ff00aa;
            + span{
              color: #a9237c;
            }
          }
        }       
      }
    }
    tbody {
      tr{
        &:nth-child(odd){
          background-color: #e9f5ff;
        }
        &:nth-child(even){
          background-color: #fafaeb;
        }
      }
      td {
        border-bottom: 1px solid #ffffff;
        padding: 0 10px;
        height: 48px;
        font-size: 1em; 
      }
    }
  }
  // Paginator styles    
  .vcc-paginator{
    margin-top: .5em;
    select{
      border: 1px solid #7cc3fd;
      border-radius: 8px;
      color: #ffffff;
      background-color:  #7cc3fd;
      outline: none;
    }
    button{
      border: 1px solid #7cc3fd;
      border-radius: 8px;
      color: #ffffff;
      background-color:  #7cc3fd;
      outline: none;
    }    
  }
}
</style>
