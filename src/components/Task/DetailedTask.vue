<template>
  <div id="modal">
    <el-dialog v-model="centerDialogVisible" width="600" center>
      <section id="content">
        <h1 style="text-align: center">Detalles de la tarea</h1>
        <p><strong> Id</strong> {{ task.id }}</p>
        <p><strong>Nombre de la tarea:</strong> {{ task.task_name }}</p>
        <p>Email: {{ task.email }}</p>
        <p>Fecha de finalización: {{ formatDate(task.finish_date) }}</p>
        <p>Estado de la tarea: {{ task.task_state }}</p>
        <p>Nombre del archivo: {{ task.file_name }}</p>
      </section>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="centerDialogVisible = false"> Cerrar </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { TASK_STATUS } from "../../config/constants";
import { ref } from "vue";
export default {
  name: "DetailedTask",
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  watch: {
    task(newValue, oldValue) {
      this.fitTask(newValue);
      this.centerDialogVisible = true;
    },
  },
  setup() {
    const centerDialogVisible = ref(false);
    return {
      centerDialogVisible,
    };
  },
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
      if (receivedDate === undefined) {
        return "";
      }
      const date = new Date(receivedDate);
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // month comienza desde 0
      const day = String(date.getUTCDate()).padStart(2, "0");
      const hour = String(date.getUTCHours()).padStart(2, "0");
      const minutes = String(date.getUTCMinutes()).padStart(2, "0");

      return `${day}/${month}/${year} ${hour}:${minutes}`;
    },

    fitTask(taskObject) {
      this.model = taskObject;
      this.model.task_state = TASK_STATUS[this.model.task_state];
    },
  },

  formatStatusStask(cellValue) {
    cellValue = cellValue.toUpperCase();
    return TASK_STATUS[cellValue];
  },
};
</script>

<style scoped>
#content {
  font-size: 18px;
}
</style>
