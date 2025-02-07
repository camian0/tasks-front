<template>
  <p>Bienvenido a la vista de tareas</p>
  <ListTask />
</template>
<script>
import ListTask from "../components/Task/List.vue";

export default {
  name: "TaskView",
  components: {
    ListTask,
  },
  data() {
    return {};
  },
};
</script>
<style scope></style>
