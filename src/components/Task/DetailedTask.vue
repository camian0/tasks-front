<template>
  <div>
    <h1>Detalles de la tarea</h1>
    <p>Id: {{ task.id }}</p>
    <p>Nombre de la tarea: {{ task.task_name }}</p>
    <p>Email: {{ task.email }}</p>
    <p>Fecha de finalización: {{ formatDate(task.finish_date) }}</p>
    <p>Estado de la tarea: {{ task.task_state }}</p>
    <p>Nombre del archivo: {{ task.file_name }}</p>
  </div>
</template>

<script>
export default {
  name: "DetailedTask",
  props: ["task"],
  data() {
    return {
      model: {
        task_name: "",
        email: "",
        finish_date: "",
        task_state: "to do",
        file: "",
      },
    };
  },
  methods: {
    formatDate(receivedDate) {
      const date = new Date(receivedDate);
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // month comienza desde 0
      const day = String(date.getUTCDate()).padStart(2, "0");
      const hour = String(date.getUTCHours()).padStart(2, "0");
      const minutes = String(date.getUTCMinutes()).padStart(2, "0");

      return `${day}/${month}/${year} ${hour}:${minutes}`;
    },
  },
  //   TODO esto toca cambiarlos con elemente plus ++
  onUpdated() {
    if (this.task.id !== undefined) {
      this.model.task_name = this.task.task_name;
      this.model.email = this.task.email;
      this.model.finish_date = this.task.finish_date;
      this.model.task_state = this.task.task_state;
      this.model.file = this.task.file_name;
    }
  },
};
</script>

<style scoped></style>
