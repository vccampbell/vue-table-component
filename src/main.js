import Vue from 'vue'
import App from './App.vue'
import '.'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrash, faSortAlphaDown, faSortAlphaDownAlt, faLongArrowAltUp, faLongArrowAltDown, faChevronDown, faFilter, faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add([faTrash, faSortAlphaDown, faSortAlphaDownAlt, faLongArrowAltUp, faLongArrowAltDown, faChevronDown, faFilter, faUserSecret])
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false

new Vue({
  el: "#app",
  components: { App },
  template: "<App/>"
});
// new Vue({
//   render: h => h(App)
// }).$mount('#app')
