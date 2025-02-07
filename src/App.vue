<script setup>
import TaskVue from "./views/Task.vue";
</script>

<template>
  <main>
    <TaskVue />
  </main>
</template>

<style scoped>
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  background-color: blue;
}
main {
  margin: 10px;
  padding: 10px;
  width: 100%;
  min-height: 99vh;
}

footer {
  margin: 10px;
  padding: 10px;
}
</style>
