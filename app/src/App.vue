<template>

  <NavBar></NavBar>
    <div class="row">
      <div class="col-1" style="max-width:160px;">
        <nav class="navbar-vertical">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Incidents</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/health_dash">Health boar</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/acquisition_stat">Acquisition Stat</router-link>
            </li>
          </ul>
        </nav>
      </div>

      <div class="col-11">
        <router-view/>
      </div>
    </div>
</template>
<script setup>
import NavBar from "./components/NavBar.vue";


</script>
<style scoped>

.nav-link {
  font-family: Heiti SC;
  cursor: pointer;
  font-size: 16px;
  padding: 10px;
  font-weight: bolder;
  float: left;
  color: darkslategrey;

}

/*.col-1{*/
/*  width: 170px;*/
/*}*/
/*.col-11{*/
/*  display: block;*/
/*}*/

</style>