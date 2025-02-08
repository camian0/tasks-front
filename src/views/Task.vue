<template>
  <p>Bienvenido a la vista de tareas</p>
  <ListTask @oneTask="receivedTask" />
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
  methods: {
    receivedTask(eventReceived) {
      let task = { ...eventReceived };
      console.log("Evento recibido del hijo aqui en view task:", task);
    },
  },
};
</script>
<style scope></style>
