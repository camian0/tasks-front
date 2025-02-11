<template>
  <div>
    <section class="search-header">
      <el-select
        v-model="selectedSearch"
        placeholder="Selecciona un campo"
        size="large"
        style="width: 240px"
      >
        <el-option v-for="(key, value) in toSearch" :key="key" :label="key" :value="value" />
      </el-select>
      <el-input
        v-model="fieldSearch"
        placeholder="Buscar tarea"
        style="width: 65%; height: 34px; margin-right: 10px"
      />

      <section class="buttons">
        <el-button :disabled="desactivatePrevious" @click="previousPage"
          ><el-icon id="previous-btn"><ArrowLeftBold /></el-icon
        ></el-button>

        <span id="page-number">{{ numberPage }}</span>

        <el-button :disabled="desactivateNext" @click="nextPage">
          <el-icon id="next-btn"><ArrowRightBold /></el-icon>
        </el-button>
      </section>
    </section>

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
          <el-icon id="see-icon" @click="seeFile(scope.row.file_name)"><View /></el-icon>
          <el-icon id="details-icon" @click="sendOneTask(scope.row)"><Tickets /></el-icon>
          <el-icon id="edit-icon" @click="handleUpdateTask(scope.row)"><EditPen /></el-icon>
          <el-icon id="delete-icon" @click="handleDeleteTask(scope.row.id)"><CloseBold /></el-icon>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getData, downloadData } from "../../request/request";
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
      numberPage: 0,
      toSearch: {
        email: "Correo",
        task_state: "Estado de la tarea",
        finish_date: "Fecha finalizacion",
      },
      lastEvaluatedKey: {},
      selectedSearch: "",
      fieldSearch: "",
      desactivatePrevious: true,
      desactivateNext: true,
    };
  },
  mounted() {
    this.getTask();
    this.desactivatePrevious =
      this.numberPage <= 0 ? this.desactivatePrevious : !this.desactivatePrevious;
    this.desactivateNext =
      Object.keys(this.lastEvaluatedKey).length > 0 ? this.desactivateNext : !this.desactivateNext;
  },
  methods: {
    async getTask(params = {}) {
      this.loadingTable = true;
      let response = await getData("tasks", params);
      if (response.status === 200) {
        this.listTask = response.data.items;
        this.lastEvaluatedKey = response.data.lastEvaluatedKey;
        this.loadingTable = false;
        console.log(this.lastEvaluatedKey);
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

    async seeFile(idFile) {
      console.log("link url", idFile);
      let response = await downloadData(`file/${idFile}`);
      console.log(response);
    },

    previousPage() {
      console.log(this.desactivatePrevious);
      if (this.numberPage <= 0) {
        this.desactivatePrevious = !this.desactivatePrevious;
      }
      if (this.numberPage < 0) {
        this.numberPage--;
      }

      console.log(this.desactivatePrevious);
      console.log("click previous");
    },

    async nextPage() {
      console.log(Object.keys(this.lastEvaluatedKey).length > 0);
      if (!this.lastEvaluatedKey) {
        this.desactivateNext = !this.desactivateNext;
      }
      if (Object.keys(this.lastEvaluatedKey).length > 0) {
        console.log("click next");
        this.numberPage++;

        this.getTask(JSON.stringify({ exclusiveStartKey: this.lastEvaluatedKey }));
      }
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
}

table tr td i {
  cursor: pointer;
}
.search-header {
  display: flex;
  flex-direction: row;
  margin: 10px 0px;
}

.el-select {
  margin-right: 10px;
}

.buttons {
  padding: 0px;
}
.buttons > button {
  border: none;
  padding: 5px;
  background-color: rgb(21, 101, 192);
  color: white;
}

.buttons > button:hover {
  background-color: #90caf9;
  color: white;
}

.buttons > i {
  font-size: 17px;
}

#page-number {
  margin: 0 12px;
  padding: 5px;
  font-size: 22px;
}

#see-icon {
  color: black;
}

#details-icon {
  color: #2a8dc9;
}

#edit-icon {
  color: rgb(5, 175, 47);
}

#delete-icon {
  color: red;
}
</style>
