import Vue from 'vue'
import TableView from './components/TableView'
import TablePagination from './components/TablePagination'

const Components = {
    TableView,
    TablePagination
}
Object.keys(Components).forEach(name => {
    Vue.component(name, Components[name]);
});
  
export default Components;