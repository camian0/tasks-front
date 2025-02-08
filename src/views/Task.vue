<template>
  <div>
    <p>Bienvenido a la vista de tareas</p>
    <ListTask @one-task="receivedTask" @update-task="receivedTask" />
    <!-- <CreateTask /> -->
    <!-- <DetailedTask :task="taskToSend" /> -->
    <UpdateTask :task="taskToSend" />
  </div>
</template>
<script>
import ListTask from "@/components/Task/List.vue";
import CreateTask from "@/components/Task/Create.vue";
import DetailedTask from "@/components/Task/DetailedTask.vue";
import UpdateTask from "@/components/Task/Update.vue";

export default {
  name: "TaskView",
  components: {
    ListTask,
    CreateTask,
    DetailedTask,
    UpdateTask,
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
