<template>
  <div class="vcc-paginator" :class="alignClass">
    <template v-if="paginationOptions.visualStyle === 'select'">
      <span>Page </span> 
      <select @change="onChange">
        <option 
          v-for="index in totalPages" 
          :value="index" 
          :key="index"
          :selected="index == page">
          {{ index }}
        </option>
      </select>
      <span> of {{ totalPages }}</span>       
      <span> || {{ totalRows }}</span>     
    </template>
    <template v-else>
        <i v-if="prevPage > 0" class="fa fa-caret-square-o-left fa-2x" aria-hidden="true" @click="goToPage(prevPage)" style="cursor:pointer"></i>
        &nbsp;<span>Page <strong>{{page}}</strong> of {{ totalPages }}</span>&nbsp;
        <i v-if="nextPage <= totalPages" @click="goToPage(nextPage)" class="fa fa-caret-square-o-right fa-2x" aria-hidden="true" style="cursor:pointer"></i>
    </template>
  </div>
</template>
<script>

export default {
  name: 'TablePagination',  
  props: {
    totalRows: Number,
    page : Number,
    totalPages: Number,
    paginationOptions: Object
  },
  data(){
    return{
    }
  },
  computed:{
    prevPage() {
      return this.page - 1;
    },
    nextPage() {
      return this.page + 1;
    },
    alignClass(){
      return `vcc-${this.paginationOptions.align}`
    }   
  },
  methods:{
    goToPage(newPage) {      
      this.$emit('new-page', parseInt(newPage))
    },
    onChange(event) {
      this.goToPage(event.target.value)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
button {
  font-size: 1rem; 
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
}
.vcc-left{
  text-align: left;
}
.vcc-right{
  text-align: right;
}
.vcc-center{
  text-align: center;
}
.vcc-prev{
  margin-right: .5rem; 
}
.vcc-next{
  margin-left: .5rem;    
}
  // Default paginator styles
.vcc{
  .vcc-paginator{
    margin: .5em 0;
    span{
      display: inline-block;
      vertical-align: middle;
    }
    button{
      border: 1px solid #ccc;
      outline: none;
      background-color: #fff; 
    } 
    select{
      margin: 0 10px;    
      border: 1px solid #ccc;
      outline: none;
      background-color: #fff;
    }
    i {
      cursor: pointer;
      padding: 5px;
    }
  }
}
</style>
