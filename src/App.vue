<template>
  <div id="app">
   <keep-alive>
    <router-view v-if="$route.meta.isKeepAlive"></router-view>
</keep-alive>
<router-view v-if="!$route.meta.isKeepAlive"></router-view>

  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
