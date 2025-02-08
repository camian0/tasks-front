<template>
  <div>
    <p>Bienvenido al componente actualizar tarea</p>
    <input type="text" v-model="model.task_name" placeholder="Nombre de la tarea" />
    <br />
    <input type="email" v-model="model.email" placeholder="Correo" />
    <br />
    <input type="datetime-local" v-model="model.finish_date" placeholder="Fecha de terminación" />
    <br />
    <select v-model="model.task_state" placeholder="Estado de la tarea">
      <option value="TO DO">Por Hacer</option>
      <option value="PROCESS">En proceso</option>
      <option value="FINISHg">Finalizada</option>
    </select>
    <br />

    <button @click="updateTask">Actualizar tarea</button>
  </div>
</template>

<script>
import { putData } from "../../request/request";
export default {
  name: "UpdateTask",
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  // TODO: verificar cuando se integre modal element +
  watch: {
    task(newValue, oldValue) {
      this.createTask(newValue);
    },
  },
  data() {
    return {
      model: {
        id: "",
        task_name: "",
        email: "",
        finish_date: "",
        task_state: "",
      },
    };
  },

  methods: {
    async updateTask() {
      let modelSent = { ...this.model };
      modelSent.finish_date = this.processDate(this.model.finish_date);
      console.log("datos a actuaizar: ", modelSent);

      let response = await putData(`tasks/${modelSent.id}`, modelSent);
      if (response.status === 200) {
        console.log(response.message);
        return;
      }

      this.cleanModel();
    },

    createTask(modelSent) {
      let { id, task_name, email, finish_date, task_state } = { ...modelSent };
      finish_date = this.formatDate(finish_date);
      this.model = {
        id,
        task_name,
        email,
        finish_date,
        task_state,
      };
    },
    // converts the date in ISO 8601 (UTC) format to local time
    formatDate(receivedDate) {
      if (receivedDate === undefined) {
        return "";
      }
      const date = new Date(receivedDate);
      // Extraer componentes en UTC
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, "0");
      const day = String(date.getUTCDate()).padStart(2, "0");
      const hours = String(date.getUTCHours()).padStart(2, "0");
      const minutes = String(date.getUTCMinutes()).padStart(2, "0");

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    },

    // converts the local time to ISO 8601 (UTC) format
    processDate(stringDate) {
      // Convertir string a objeto Date
      const date = new Date(stringDate + ":00Z"); // Agregar ":00" para segundos y 'Z' para UTC
      // Obtener formato ISO completo
      const isoDate = date.toISOString();
      return isoDate;
    },

    cleanModel() {
      this.model = {
        id: "",
        task_name: "",
        email: "",
        finish_date: "",
        task_state: "",
      };
    },
  },
};
</script>

<style scoped></style>
