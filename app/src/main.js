import {createApp} from 'vue'
import './style.css'
import ElementPlus from 'element-plus'

import "bootstrap/dist/css/bootstrap.min.css"
import 'vxe-table/lib/style.css'
import "bootstrap"
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'xe-utils'
import 'vxe-table'
import i18n from './i18n'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import VXETablePluginElement from 'vxe-table-plugin-element'
import 'vxe-table-plugin-element/dist/style.css'
import App from './App.vue'
import router from './router'


VXETable.setup({
    i18n: (key, args) => i18n.global.t(key, args)
})

const app = createApp(App)
app.use(router)
app.use(VXETable, VXETablePluginElement)
app.use(VueAxios, axios)

app.use(ElementPlus)
app.mount('#app')
