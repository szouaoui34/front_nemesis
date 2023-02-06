<script setup>
import {ref} from 'vue'

defineProps({
  msg: String,
})


</script>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 100px;
  min-height: 200px;
}
</style>

<template>
  <div id="top_nav">
    <nav class="navbar navbar-dark" style="background-color: indigo">
        <a class="navbar-brand" style="margin-left:20px;font-family:Cambria;font-size: 22px;" href="">Nemesis</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02"
                aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" href="">Dash</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="">IT Dash</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="">Download</a>
            </li>
          </ul>
        </div>

    </nav>
  </div>



</template>

