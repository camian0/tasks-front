<template>
  <p>Bienvenido a la vista de tareas</p>

  {{ this.apiUrl }}
</template>
<script>
export default {
  name: "TaskVue",
  data() {
    return {
      apiUrl: import.meta.env.VITE_API_ENDPOINT_URL,
    };
  },
};
</script>
<style scope></style>
