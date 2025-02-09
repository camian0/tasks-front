<template>
  <div></div>
</template>

<script>
import { deleteData } from "../../request/request";
import { ElMessageBox } from "element-plus";
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
      this.deleteTask();
    },
  },
  data() {
    return {};
  },
  methods: {
    async deleteTask() {
      ElMessageBox.confirm("¿Esta seguro de eliminar la tarea?", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
        center: true,
      })
        .then(async () => {
          let response = await deleteData(`tasks/${this.id}`);
          console.log("response", response);
          //   TODO event to update list
          if (response.status === 200) {
            console.log(response.data.message);
            ElMessage({
              type: "success",
              message: response.data.message,
            });
          }
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "Eliminacion cancelada",
          });
        });
    },
  },
};
</script>

<style scoped></style>
