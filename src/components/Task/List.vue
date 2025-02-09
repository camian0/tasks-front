<template>
  <div>
    <p>Listar tareas</p>
    <el-table
      v-loading="loadingTable"
      :data="listTask"
      empty-text="No hay tareas para mostrar"
      stripe
      style="width: 98%"
    >
      <el-table-column prop="id" label="id" :min-width="40" />
      <el-table-column prop="task_name" label="Nombre de la tarea" :min-width="100" />
      <el-table-column prop="email" label="Correo" :min-width="120" />
      <el-table-column
        label="Fecha finalizacion"
        prop="finish_date"
        :formatter="formatDate"
        :min-width="95"
      />
      <!-- <el-table-column prop="task_state" label="Estado de la tarea" /> -->
      <el-table-column
        label="Estado de la tarea"
        prop="task_state"
        :formatter="formatStatusStask"
        :min-width="95"
      />
      <el-table-column prop="file_name" label="Nombre del archivo" />
      <el-table-column label="Acciones" align="center" width="160">
        <template #default="scope">
          <el-icon @click="sendOneTask(scope.row)"><Tickets /></el-icon>
          <el-icon @click="handleUpdateTask(scope.row)"><EditPen /></el-icon>
          <el-icon @click="handleDeleteTask(scope.row.id)"><CloseBold /></el-icon>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getData } from "../../request/request";
import { TASK_STATUS } from "@/config/constants";
import { ref } from "vue";
export default {
  name: "ListTask",
  emits: ["oneTask", "updateTask", "deleteTask"],
  setup() {
    const loadingTable = ref(false);

    return {
      loadingTable,
    };
  },
  data() {
    return {
      listTask: [],
      taskStatus: {
        "TO DO": "PENDIENTE",
        PROCESS: "EN PROCESO",
        FINISHED: "FINALIZADO",
      },
    };
  },
  mounted() {
    this.getTask();
  },
  methods: {
    async getTask() {
      this.loadingTable = true;
      let response = await getData("tasks");
      if (response.status === 200) {
        this.listTask = response.data.items;
        this.loadingTable = false;
        ElNotification({
          title: "Exito",
          message: response.data.message,
          type: "success",
        });
        return;
      }
      ElNotification({
        title: "Error",
        message: response.data.message,
        type: "error",
      });
    },

    formatDate(row, column, cellValue) {
      if (!cellValue) {
        return "";
      }
      const date = new Date(cellValue);
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // month comienza desde 0
      const day = String(date.getUTCDate()).padStart(2, "0");
      const hour = String(date.getUTCHours()).padStart(2, "0");
      const minutes = String(date.getUTCMinutes()).padStart(2, "0");

      return `${day}/${month}/${year} ${hour}:${minutes}`;
    },

    formatStatusStask(row, column, cellValue) {
      cellValue = cellValue.toUpperCase();
      return TASK_STATUS[cellValue];
    },

    sendOneTask(event) {
      this.$emit("oneTask", event);
    },

    handleUpdateTask(event) {
      this.$emit("updateTask", event);
    },

    handleDeleteTask(id) {
      this.$emit("deleteTask", id);
    },
  },
};
</script>

<style scoped>
.el-table__inner-wrapper {
  font-size: 16px;
}
i {
  margin: 2px 4px;
  font-size: 20px;
  cursor: pointer;
}
</style>
