<template>
  <p>Bienvenido a la vista de tareas</p>
</template>
<script>
import { APP_HOST } from "../config/constants.js";

export default {
  name: "TaskVue",
  data() {
    return {
      // apiUrl: import.meta.env.VITE_API_ENDPOINT_URL,
    };
  },

  methods: {
    test() {
      console.log("url en vista tareas", APP_HOST);
    },
  },
};
</script>
<style scope></style>
