<template>
  <div>
    <p>Listar tareas</p>
    <table>
      <thead>
        <tr>
          <th>Id</th>
          <th>nombre tarea</th>
          <th>correo</th>
          <th>Fecha finalizacion</th>
          <th>Estado</th>
          <th>Nombre archivos</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody v-if="this.listTask.length > 0">
        <tr v-for="task in listTask" :key="task.id">
          <td>{{ task.id }}</td>
          <td>{{ task.task_name }}</td>
          <td>{{ task.email }}</td>
          <td>{{ formatDate(task.finish_date) }}</td>
          <td>{{ task.task_state }}</td>
          <td>{{ task.file_name }}</td>
          <td>
            <button @click="handleUpdateTask(task)">Actualizar</button>
            <button @click="sendOneTask(task)">listar1</button>
            <button @click="handleDeleteTask(task.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="this.listTask.length == 0">No hay tareas para mostrar</p>
  </div>
</template>

<script>
import { getData } from "../../request/request";

export default {
  name: "ListTask",
  emits: ["oneTask", "updateTask", "deleteTask"], // Declara el evento aquí
  data() {
    return {
      listTask: [],
    };
  },
  mounted() {
    this.getTask();
  },
  methods: {
    async getTask() {
      let response = await getData("tasks");
      if (response.status === 200) {
        console.log(response.data.message);
        this.listTask = response.data.items;
        return;
      }
      // TODO Sacar las notificaciones bonitas
      console.log(response.data.message);
    },

    formatDate(receivedDate) {
      const date = new Date(receivedDate);
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // month comienza desde 0
      const day = String(date.getUTCDate()).padStart(2, "0");
      const hour = String(date.getUTCHours()).padStart(2, "0");
      const minutes = String(date.getUTCMinutes()).padStart(2, "0");

      return `${day}/${month}/${year} ${hour}:${minutes}`;
    },

    sendOneTask(event) {
      this.$emit("oneTask", event);
    },

    handleUpdateTask(event) {
      this.$emit("updateTask", event);
    },

    handleDeleteTask(id) {
      console.log("Tarea para eliminar recibida con id", id);
      this.$emit("deleteTask", id);
    },
  },
};
</script>

<style scoped>
table {
  border: 2px solid black;
}
</style>
