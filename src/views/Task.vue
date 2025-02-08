<template>
  <p>Bienvenido a la vista de tareas</p>
  <ListTask @oneTask="receivedTask" />
  <!-- <CreateTask /> -->
  <DetailedTask :task="taskToSend" />
</template>
<script>
import ListTask from "@/components/Task/List.vue";
import CreateTask from "@/components/Task/Create.vue";
import DetailedTask from "@/components/Task/DetailedTask.vue";

export default {
  name: "TaskView",
  components: {
    ListTask,
    CreateTask,
    DetailedTask,
  },
  data() {
    return {
      taskToSend: {},
    };
  },
  methods: {
    receivedTask(eventReceived) {
      this.taskToSend = { ...eventReceived };
    },
  },
};
</script>
<style scope></style>
