import { createRouter, createWebHistory } from 'vue-router'
import AcquisitionStat from "./components/AcquisitionStat.vue";
import test from "./components/test.vue";
import healthBoar from "./components/HealthBoar.vue";



const routes = [
    { "path": "/", "component": test },
    { "path": "/acquisition_stat", "component": AcquisitionStat },
    { "path": "/health_dash", "component": healthBoar}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router;