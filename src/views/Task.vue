<template>
  <div>
    <p>Bienvenido a la vista de tareas</p>
    <CreateTask />
    <ListTask @one-task="toDetails" @update-task="toUpdate" @delete-task="taskToDelete" />
    <DetailedTask :task="taskToDetail" />
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
      taskToDetail: {},
      idToDelete: 0,
      taskToUpdate: {},
    };
  },
  methods: {
    toDetails(eventReceived) {
      this.taskToDetail = { ...eventReceived };
    },
    toUpdate(eventReceived) {
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
