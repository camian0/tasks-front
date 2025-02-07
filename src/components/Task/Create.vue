<template>
  <p>Bienvenido a Crear una tarea component</p>
</template>

<script>
export default {
  name: "CreateTask",
  data() {
    return {
      task_name: "",
      email: "",
      finish_date: "",
      task_state: "",
      file_name: "",
    };
  },
  methods: {
    async createTask() {
      console.log("Creando tarea");
    },
  },
};
</script>

<style scoped></style>
