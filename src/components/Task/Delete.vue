<template>
  <div>
    <p>Bienvenido al componente eliminar tarea</p>
  </div>
</template>

<script>
import { deleteData } from "../../request/request";
export default {
  name: "DeleteTask",
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  watch: {
    id(newVal, oldVal) {
      console.log(`ID changed from ${oldVal} to ${newVal}`);
      this.deleteTask();
    },
  },
  data() {
    return {};
  },
  methods: {
    async deleteTask() {
      console.log("Eliminando tarea con id", this.id);
      if (!confirm("Are you sure you want to delete this task?")) {
        console.log("Delete canceled");
        return;
      }
      let response = await deleteData(`tasks/${this.id}`);
      console.log("response", response);
      //   TODO event to update list
      if (response.status === 200) {
        console.log(response.data.message);
      }
    },
  },
};
</script>

<style scoped></style>
