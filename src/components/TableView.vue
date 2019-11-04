<template>
  <div>
    <table :class="cssStyle">
      <thead>
        <tr>
          <th v-for="(col, idx) in headers" :key="idx" :data-col-header="col.field">
            <slot :name="col.field" :column="col">
              <div
                :data-menu-div="col.field"
                style="width:100%;position:relative;left:0;top:0;margin:0;border:0;cursor:pointer"
              >
                <table :data-menu-table="col.field" style="width:100%;">
                  <tbody>
                    <tr>
                      <td>
                        <a @click="PopMenuFromChevron(col)">
                          {{col.title}}
                          <i
                            v-if="sortField === col.field && sortOrder === 'asc'"
                            class="fa fa-long-arrow-up"
                            aria-hidden="true"
                          ></i>
                          <i
                            v-if="sortField === col.field && sortOrder === 'desc'"
                            class="fa fa-long-arrow-down"
                            aria-hidden="true"
                          ></i>
                          <i
                            v-if="filters.filter(item => item.field === col.field ).length > 0"
                            class="fa fa-filter"
                            aria-hidden="true"
                          ></i>
                          <i class="fa fa-chevron-down pull-right"></i>
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div
                  v-if="col.field === activeColumn"
                  :id="'menu-'+idx"
                  style="z-index:100;top:28px;position:absolute;left:0;width:220px;background-color:#fff;font-weight:normal;box-shadow:3px 3px 6px -4px rgba(0,0,0,0.3),-3px 3px 6px -4px rgba(0,0,0,0.3);border-top:0px solid transparent;max-height:320px;overflow-y:scroll;overflow-x:hidden;"
                >
                  <table style="width:100%">
                    <tr
                      v-if="filters.filter(item => item.field === col.field ).length > 0"
                      onmouseover="this.style.backgroundColor='#ececec'"
                      onmouseout="this.style.backgroundColor='#ffffff'"
                    >
                      <td @click="clearFilter(col)">
                        <i class="fa fa-trash-o"></i>
                      </td>
                      <td @click="clearFilter(col)">Clear filter</td>
                    </tr>
                    <template v-if="col.sortable && filters.filter(item => item.field === col.field ).length === 0">
                      <tr
                        onmouseover="this.style.backgroundColor='#ececec'"
                        onmouseout="this.style.backgroundColor='#ffffff'"
                      >
                        <td @click="sortBy(idx, 'asc')">
                          <i class="fa fa-sort-alpha-asc"></i>
                        </td>
                        <td @click="sortBy(idx, 'asc')">Ascending</td>
                      </tr>
                      <tr
                        onmouseover="this.style.backgroundColor='#ececec'"
                        onmouseout="this.style.backgroundColor='#ffffff'"
                      >
                        <td @click="sortBy(idx, 'desc')">
                          <i class="fa fa-sort-alpha-desc"></i>
                        </td>
                        <td @click="sortBy(idx, 'desc')">Descending</td>
                      </tr>
                    </template>
                    <template v-else>
                      <tr>
                        <td colspan="2">Sort disabled.</td>
                      </tr>
                    </template>
                    <template v-if="col.filterable">
                      <tr
                        v-for="(option, idx) in filterOptions"
                        :key="idx"
                        onmouseover="this.style.backgroundColor='#ececec'"
                        onmouseout="this.style.backgroundColor='#ffffff'"
                      >
                        <td>&nbsp;</td>
                        <td @click="filterBy(col, option)">{{option}}</td>
                      </tr>
                    </template>
                    <template v-else>
                      <tr>
                        <td colspan="2">Filter disabled.</td>
                      </tr>
                    </template>
                  </table>
                </div>
              </div>
            </slot>
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
import TablePagination from "@/components/TablePagination.vue";

export default {
  name: "TableView",
  components: {
    TablePagination
  },
  props: {
    headers: {
      type: Array,
      default() {
        return [];
      },
      required: true
    },
    rows: {
      type: Array,
      default() {
        return [];
      },
      required: true
    },
    sort: {
      type: Object,
      default() {
        return {};
      }
    },
    pagination: {
      type: Object,
      default() {
        return {};
      }
    },
    cssStyle: {
      type: String,
      default: "default-style"
    }
  },
  data() {
    return {
      sortDefault: {
        field: null,
        type: "asc"
      },
      paginationDefault: {
        enabled: true,
        itemsPerPage: 25,
        align: "right",
        visualStyle: "buttons"
      },
      sortColumn: null,
      sortField: null,
      sortOrder: null,
      visibleRows: {},
      tableRows: {},
      page: 1,
      activeColumn: null,
      filteredRows: {},
      filters: [],
      filterOptions: []
    };
  },
  watch: {
    rows: function(newRows, oldRows) {
      this.tableRows = newRows;
      this.visibleRows = newRows;
      this.filteredRows = newRows;
    }
  },
  computed: {
    sortOptions() {
      return Object.assign(this.sortDefault, this.sort);
    },
    paginationOptions() {
      return Object.assign(this.paginationDefault, this.pagination);
    },
    sortEnabled() {
      return this.sortOptions.field != null && this.numRows > 0;
    },
    paginationEnabled() {
      return (
        this.paginationOptions.enabled &&
        this.paginationOptions.itemsPerPage > 0 &&
        this.numRows > 0
      );
    },
    numRows() {
      return this.filteredRows.length;
    },
    numColumns() {
      return this.headers.length;
    },
    totalPages() {
      return this.paginationEnabled
        ? Math.ceil(this.numRows / this.paginationOptions.itemsPerPage)
        : null;
    }
  },
  created() {
    document.addEventListener("click", this.documentClick);
  },
  mounted() {
    this.tableRows = this.rows.slice(0);
    this.visibleRows = this.tableRows;
    this.filteredRows = this.tableRows;
    if (this.sortEnabled) this.initSort();
    this.selectVisibleRows();
  },
  methods: {
    documentClick() {
      if (!this.$el.contains(event.target)) this.activeColumn = null;
    },
    onNewPage: function(newPage) {
      this.page = newPage;
      this.selectVisibleRows();
    },
    selectVisibleRows: function() {
      if (this.paginationEnabled) {
        const rowFirst =
          this.page * this.paginationOptions.itemsPerPage -
          this.paginationOptions.itemsPerPage;
        const rowLast = this.page * this.paginationOptions.itemsPerPage;
        this.visibleRows = this.filteredRows.slice(rowFirst, rowLast);
      } else this.visibleRows = this.filteredRows.slice(0);
    },
    initSort: function() {
      this.sortOrder = this.sortOptions.order === "asc" ? "asc" : "desc";

      let defaultSortColumn = null;

      for (let x = 0; x < this.headers.length; x++) {
        if (
          this.headers[x].sortable &&
          this.headers[x].field == this.sortOptions.field
        ) {
          defaultSortColumn = x;
          break;
        }
      }
      if (defaultSortColumn != null) this.sortBy(defaultSortColumn);
    },
    sortBy: function(idx, order) {
      if (this.sortEnabled && this.headers[idx].sortable) {
        if (typeof order === "undefined") order = "asc";
        if (this.sortColumn === idx) {
          if (order !== this.sortOrder) {
            this.filteredRows.reverse();
            this.sortOrder = order;
          }
        } else {
          this.sortColumn = idx;
          this.sortOrder = order;
          this.sortField = this.headers[idx].field;

          if (this.headers[idx].type == "Number") {
            this.filteredRows.sort(
              (a, b) => a[this.sortField] - b[this.sortField]
            );
          } else {
            this.filteredRows.sort((a, b) =>
              a[this.sortField].localeCompare(b[this.sortField])
            );
          }
          // always ordered asc in the beginning.
          // reverse if desc
          if (order === "desc") this.filteredRows.reverse();
        }
        this.page = 1; // reset view to page 1

        this.selectVisibleRows();
        this.activeColumn = null;
      }
    },
    filterBy: function(column, option) {
      this.activeColumn = null;
      // if the column exists in filters already, remove it 
      // set the new filter based on new value      
      for (let i = 0; i < this.filters.length; i++) {
        if (column.field === this.filters[i].field) this.filters.splice(i, 1);
      }
      this.filters.push({ field: column.field, value: option });
      this.applyFilter();
    },
    clearFilter: function(column) {
      var self = this;
      this.activeColumn = null;
      for (let i = 0; i < self.filters.length; i++) {
        if (column.field === self.filters[i].field) self.filters.splice(i, 1);
      }
      self.applyFilter();
    },
    applyFilter: function() {
      var self = this;
      this.visibleRows = this.tableRows.filter(function(item) {
        for (let filter of self.filters) {
          if (
            item[filter.field] === undefined ||
            item[filter.field] != filter.value
          )
            return false;
        }
        return true;
      });
      this.filteredRows = this.visibleRows;
      this.page = 1;
      this.selectVisibleRows();
    },
    PopMenuFromChevron: function(c) {
      if (c.field === this.activeColumn) this.activeColumn = null;
      else this.activeColumn = c.field;
      if (!c.filterable) return;
      var options = this.tableRows.map(function(item) {
        return item[c.field];
      });
      const distinct = (value, index, self) => {
        return self.indexOf(value) === index;
      };
      var distinctOptions = options.filter(distinct);
      if (c.type == "Number") {
        this.filterOptions = distinctOptions.sort((a, b) => a - b);
      } else {
        this.filterOptions = distinctOptions.sort((a, b) => a.localeCompare(b));
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.default-style {
  .default-table {
    border-collapse: collapse;
    width: 100%;
    thead {
      th {
        border-bottom: 2px solid #ccc;
        padding: 0 10px;
        height: 48px;
        text-align: left;
        font-size: 1em;
        &:hover {
          span {
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
        i {
          color: #aaa;
          &.active {
            color: #ff6633;
            + span {
              color: #ff6633;
            }
          }
        }
      }
    }
    tbody {
      tr {
        &:nth-child(odd) {
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
  }
}
</style>
