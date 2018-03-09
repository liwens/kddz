<template>
  <div id="app">
    <container></container>
  </div>
</template>

<script>

import Container from './components/Container'

export default {
  name: 'App',
  components: {

    Container
  }
}
</script>

<style>
body{

}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  box-shadow:0 -15px 10px -10px rgba(0,0,0,.22);
}
</style>
