import Vue from 'vue'
import App from './App.vue'
import '.'

Vue.config.productionTip = false

new Vue({
  el: "#app",
  components: { App },
  template: "<App/>"
});
// new Vue({
//   render: h => h(App)
// }).$mount('#app')
