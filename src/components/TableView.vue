<template>
  <div class="vcc-component"> 
    <table class="table table-sm">
      <thead>
        <tr>
          <th v-for="(col, idx) in headers" :key="idx">     
            <template>
              <div style="width:100%;position:relative;left:0;top:0;margin:0;border:0;cursor:pointer">
                <table style="width:100%;">
                  <tbody>
                    <tr>
                      <td>
                        <a v-on:click="OnClickFilter(col)">{{col.title}} 
                          <i v-if="sortField === col.field && sortOrder === 'asc'" class="fa fa-long-arrow-up" aria-hidden="true"></i>
                          <i v-if="sortField === col.field && sortOrder === 'desc'" class="fa fa-long-arrow-down" aria-hidden="true"></i>
                          <i v-if="col.filteredValue != null" class="fa fa-filter" aria-hidden="true"></i>
                          <i class="fa fa-chevron-down pull-right"></i>
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div v-if="col.active" id="menu" class="ms-core-menu-box" style="top:28px; position:absolute;left:0; width:220px">
                <table class="table table-sm" style="width:100%">
                  <tr v-if="col.filteredValue != null">
                    <td @click="clearFilter(col)"><i class="fa fa-trash-o"></i></td>
                    <td @click="clearFilter(col)"> Clear filter</td>
                  </tr>
                  <tr>
                    <td @click="sortBy(idx, 'asc')"><i class="fa fa-sort-alpha-asc"></i></td>
                    <td @click="sortBy(idx, 'asc')">Ascending</td>
                  </tr>
                  <tr>
                    <td @click="sortBy(idx, 'desc')"><i class="fa fa-sort-alpha-desc"></i></td>
                    <td @click="sortBy(idx, 'desc')">Descending</td>
                  </tr>
                  <tr v-for="(option, idx) in col.options" :key="idx">
                    <td>&nbsp;</td>
                    <td @click="filter(col, option)" class="filter-option">{{option}}</td>
                  </tr>
                </table>
                </div>
              </div>
            </template>             
          </th>
        </tr>   
      </thead>
      <tbody>
        <template v-if="numRows > 0">
          <tr v-for="(row, idx) in visibleRows" :key="idx">     
            <slot name="items" :row="row"></slot>
          </tr>  
        </template>
        <template v-else>
          <tr>
            <td :colspan="numColumns">
              <slot name="no-data"></slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <TablePagination 
      v-if="paginationEnabled"
      :page="page"
      :total-pages="totalPages"
      :total-rows="visibleRows.length"
      :pagination-options="paginationOptions"
      @new-page="onNewPage"
    />
  </div>
</template>

<script>
import TablePagination from '@/components/TablePagination.vue'

export default {
  name: 'TableView',  
  components: {
    TablePagination
  },
  props:{
    headers: {
      type: Array,
      default() {
        return []
      },
      required: true
    },   
    rows: {
      type: Array,
      default() {
        return []
      }, 
      required: true
    },        
    sort: {
      type: Object,
      default() {
        return {}
      }
    },
    pagination: {
      type: Object,
      default() {
        return {}
      }
    },
    cssStyle: {
      type: String,
      default: 'vcc'
    }
  },
  data(){
    return{
      sortDefault: {
        field: null,
        type: 'asc' 
      },
      paginationDefault: {
        enabled: true,
        itemsPerPage: 5,
        align: 'right',
        visualStyle: 'buttons'
      },
      sortColumn: null,
      sortField: null,
      sortOrder: null,
      visibleRows: {},
      tableRows: {},      
      page: 1,
      filteredRows: {},
      show: false,
      activeFilters: []
    }
  },
  computed: {
    sortOptions(){
      return Object.assign(this.sortDefault, this.sort)      
    },
    paginationOptions() {
      return Object.assign(this.paginationDefault, this.pagination)
    },    
    sortEnabled(){
      return (this.sortOptions.field != null && this.numRows > 0)
    },
    paginationEnabled(){
      return ((this.paginationOptions.enabled) && (this.paginationOptions.itemsPerPage > 0) && (this.numRows > 0))
    },    
    numRows(){
      return this.filteredRows.length
    },    
    numColumns(){
      return this.headers.length
    },    
    totalPages() {
     return (this.paginationEnabled) ? Math.ceil(this.numRows / this.paginationOptions.itemsPerPage) : null
    }
  },
  created() {
    document.addEventListener('click', this.documentClick);
  },
  mounted(){
    this.tableRows = this.rows.slice(0);   // Para que haga una copia del array  
    this.visibleRows = this.tableRows;
    this.filteredRows = this.tableRows;
    if (this.sortEnabled) this.initSort() 
    this.selectVisibleRows()   
  },
  methods:{
    documentClick() {
      if(!this.$el.contains(event.target))
        this.closeAllMenus();
    },
    onNewPage: function(newPage){
      this.page = newPage
      this.selectVisibleRows()
    },
    selectVisibleRows: function() {
      if (this.paginationEnabled){
        const rowFirst = (this.page * this.paginationOptions.itemsPerPage) - this.paginationOptions.itemsPerPage
        const rowLast = (this.page * this.paginationOptions.itemsPerPage)       
        this.visibleRows = this.filteredRows.slice(rowFirst, rowLast)        
      }
      else this.visibleRows = this.filteredRows.slice(0)
    },
    initSort: function(){
      this.sortOrder = (this.sortOptions.order === 'asc') ? 'asc' : 'desc'

      let defaultSortColumn = null

      for(let x=0; x<this.headers.length; x++){      
        if ((this.headers[x].sortable) && (this.headers[x].field == this.sortOptions.field)) {
          defaultSortColumn = x            
          break;
        }
      }
      if (defaultSortColumn != null) this.sortBy(defaultSortColumn);
    },
    sortBy: function(idx, order) {  
      if (this.sortEnabled && this.headers[idx].sortable){       
        if(typeof order === 'undefined') order = 'asc'
        if(this.sortColumn === idx)
        {
          if(order !== this.sortOrder) {
            this.visibleRows.reverse();
            this.sortOrder = order;
          }            
        }
        else
        {
          this.sortColumn = idx
          this.sortOrder = order
          this.sortField = this.headers[idx].field  

          if (this.headers[idx].type == 'Number') {
            this.filteredRows.sort((a, b) => a[this.sortField] - b[this.sortField])            
          }
          else {
            this.filteredRows.sort((a, b) => a[this.sortField].localeCompare(b[this.sortField]))
          }     
          if(order === 'desc')
            this.filteredRows.reverse();
        }
        this.page = 1

        this.selectVisibleRows()
        this.closeAllMenus();    
      }      
    },
    filter: function(column, option) {
      var self = this;
      column.active = false; // hide the filter menu
      column.filteredValue = option; // set the value of the filter
      var s = new Set(this.activeFilters); // create a Set object to hold a list of active filters
      this.activeFilters = s.add(column.field); // add the column to the list of active filters
      this.applyFilter();    	
    },
    clearFilter: function(column) {    	
    	var self = this		
      column.active = false
      column.filteredValue = null
      if(self.activeFilters && self.activeFilters.size > 0)
        self.activeFilters.delete(column.field)
      self.applyFilter()
    },
    applyFilter: function() {
    	var self = this;
    	this.visibleRows = this.tableRows.filter(function(item) {
        for (var activeFilter of self.activeFilters) {
          var column = self.getColumn(activeFilter); // should only ever be one
          if (item[activeFilter] === undefined || item[activeFilter] != column[0].filteredValue)
            return false;
        }
        return true;  
      })
      this.filteredRows = this.visibleRows
      this.page = 1
      this.selectVisibleRows()
    },
    getColumn: function(activeFilter) {
    	return this.headers.filter(function(column) { return column.field === activeFilter; });
    },
  	OnClickFilter: function(c) {      
    	c.active = !c.active;
      var options = this.tableRows.map(function(item) { return item[c.field]; });
      const distinct = (value, index, self) => {
        return self.indexOf(value) === index;
      }
      var distinctOptions = options.filter(distinct);
      if (c.type == 'Number') {
            c.options = distinctOptions.sort((a, b) => a - b)            
          }
          else {
            c.options = distinctOptions.sort((a, b) => a.localeCompare(b))
          }
      for(let header of this.headers)
      {
        if(c.title != header.title)
          header.active = false;
      }
    },
    closeAllMenus: function() {
      for(let header of this.headers)
      {
        header.hover = false;
        header.active = false;
      }     
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import url(https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css);
@import url(https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css);
.material-icons {
  font-size: 1rem; 
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
}
// Default table styles
.vcc{
  .vcc-table {
    border-collapse: collapse;
    width: 100%;
    thead {
      th {
        border-bottom: 2px solid #ccc;    
        padding: 0 10px;
        height: 48px;
        text-align: left; 
        font-size: 1em; 
        &:hover{
          span{
            text-decoration: underline;
            text-decoration-style: dotted;            
          }
        }
        div {
          table {
            tbody {
              tr {
                td {
                  cursor: pointer;
                }
              }
            }
          }
        }  
        i{
          color: #aaa;
          &.active{
            color: #ff6633;
            + span{
              color: #ff6633;
            }
          }
        }
        div {
          div.ms-core-menu-box {
            background-color: #fff;
            box-shadow:3px 3px 6px -4px rgba(0,0,0,0.3),-3px 3px 6px -4px rgba(0,0,0,0.3);
            border-top:0px solid transparent;
          }
        }
      }      
    }
    tbody {
      tr{
        &:nth-child(odd){
          background-color: #fafafa;
        }
      }
      td {
        border-bottom: 1px dotted #ccc;
        padding: 0 10px;
        height: 48px;
        font-size: 1em; 
      }      
    }
    .ms-core-menu-box {
      background-color: #fff;
      box-shadow:3px 3px 6px -4px rgba(0,0,0,0.3),-3px 3px 6px -4px rgba(0,0,0,0.3);
      border-top:0px solid transparent;
    }
  }
} 
.hover {
  cursor:pointer;
  background-color: #ccc;
}
.fitler-option:hover {
    background-color: #ececec;
  }
.items td {padding: 2px;}
  .ms-core-menu-box
  {
    color:#000;
    background-color: #fff;
    box-shadow:3px 3px 6px -4px rgba(0,0,0,0.3),-3px 3px 6px -4px rgba(0,0,0,0.3);
    border-top:0px solid transparent;
    max-height: 320px;
    overflow-y: scroll;
  }
</style>
