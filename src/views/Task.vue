<template>
  <p>Bienvenido a la vista de tareas</p>
  <ListTask />
  <CreateTask />
</template>
<script>
import ListTask from "../components/Task/List.vue";
import CreateTask from "../components/Task/Create.vue";

export default {
  name: "TaskView",
  components: {
    ListTask,
    CreateTask,
  },
  data() {
    return {};
  },
};
</script>
<style scope></style>
