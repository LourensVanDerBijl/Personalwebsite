<script>
export default {
  name: 'App'
}
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
/* Reset root elements to fill the viewport */
html, body, #app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* prevent horizontal scrollbars */
  background: #ffffff;
  color: #ffffff;
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
}

/* Ensure consistent box sizing */
*, *::before, *::after {
  box-sizing: border-box;
}

/* App container spans the full viewport */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* full viewport height */
  width: 100vw;      /* full viewport width */
}
</style>
