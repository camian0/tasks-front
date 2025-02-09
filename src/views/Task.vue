<template>
  <div>
    <p>Bienvenido a la vista de tareas</p>
    <CreateTask />
    <ListTask @one-task="receivedTask" @update-task="receivedTask" @delete-task="taskToDelete" />
    <DetailedTask :task="taskToSend" />
    <UpdateTask :task="taskToUpdate" />
    <DeleteTask :id="idToDelete" />
  </div>
</template>
<script>
import ListTask from "@/components/Task/List.vue";
import CreateTask from "@/components/Task/Create.vue";
import DetailedTask from "@/components/Task/DetailedTask.vue";
import UpdateTask from "@/components/Task/Update.vue";
import DeleteTask from "@/components/Task/Delete.vue";

export default {
  name: "TaskView",
  components: {
    ListTask,
    CreateTask,
    DetailedTask,
    UpdateTask,
    DeleteTask,
  },
  data() {
    return {
      taskToSend: {},
      idToDelete: 0,
      taskToUpdate: {},
    };
  },
  methods: {
    receivedTask(eventReceived) {
      this.taskToUpdate = { ...eventReceived };
    },

    taskToDelete(idReceived) {
      console.log("id tarea a elminar", idReceived);
      if (idReceived) {
        this.idToDelete = idReceived;
      }
    },
  },
};
</script>
<style scope></style>
