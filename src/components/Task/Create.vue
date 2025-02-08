<template>
  <p>Bienvenido a Crear una tarea component</p>
  <input type="text" v-model="model.task_name" placeholder="Nombre de la tarea" />
  <br />
  <input type="email" v-model="model.email" placeholder="Correo" />
  <br />
  <input type="datetime-local" v-model="model.finish_date" placeholder="Fecha de terminación" />
  <br />
  <select v-model="model.task_state" placeholder="Estado de la tarea">
    <option value="TO DO" selected>Por Hacer</option>
    <option value="PROCESS">En proceso</option>
    <option value="FINISHg">Finalizada</option>
  </select>
  <br />
  <input type="file" @change="handleFileChange" placeholder="Selecciona un archivo" />
  <br />

  <button @click="getUrl">Crear tarea</button>
</template>

<script>
import { postData, postFormData } from "../../request/request";

export default {
  name: "CreateTask",
  data() {
    return {
      model: {
        task_name: "",
        email: "",
        finish_date: "",
        task_state: "to do",
        file: "",
      },
      urlUploadFile: "",
    };
  },
  methods: {
    async getUrl() {
      console.log("Creando tarea");
      const modelSent = this.createObjectSent(this.model);
      modelSent.finish_date = this.processDate(this.model.finish_date);
      modelSent.task_state = modelSent.task_state.toUpperCase();
      let hashFile = this.getHashNameFile() + this.model.file.name;
      modelSent.file_name = hashFile;

      // comprobamos que se haya seleccionado un archivo
      if (this.model.file !== "" && this.model.file !== undefined) {
        // peticion para obtener url firmada
        let response = await postData(`file/${hashFile}`);
        console.log("response", response);
        if (response.status === 200) {
          // creamos un form data con la informacion recibida para firmar url de amazon y subir el archivo a s3
          this.urlUploadFile = response.data.url;
          let formData = new FormData();
          Object.entries(response.data.fields).forEach(([key, value]) => {
            formData.append(key, value);
          });
          formData.append("file", this.model.file);
          response = await this.createFile(formData, this.urlUploadFile);
          if (response.status == 204) {
            // peticion para crear la tarea
            await this.createTask(modelSent);
          }
          return;
        }
        // mensaje para el error
        console.log(response.data.message);
      }
    },

    async createFile(formData, signedUrl) {
      let response = await postFormData(signedUrl, formData);
      console.log("respuesta guardado archivo", response);
      if (response.status === 204) {
        return response;
      }
    },

    async createTask(modelSent) {
      console.log("tarea para guardar completa", modelSent);
      let response = await postData("tasks", modelSent);
      if (response.status === 200) {
        console.log(response.data.message);

        return;
      }
      console.log(response.data.message);
    },

    handleFileChange(event) {
      this.model.file = event.target.files[0];
      console.log(this.model.file);
    },

    getHashNameFile() {
      const fecha = new Date().toISOString();
      const caracteresAleatorios = Math.random().toString(36).substring(2, 10);
      return `${fecha}-${caracteresAleatorios}`;
    },

    createObjectSent(object) {
      const modelSent = (({ file, ...resto }) => resto)(object);
      return modelSent;
    },

    processDate(stringDate) {
      // Convertir string a objeto Date
      const date = new Date(stringDate + ":00Z"); // Agregar ":00" para segundos y 'Z' para UTC
      // Obtener formato ISO completo
      const isoDate = date.toISOString();
      return isoDate;
    },

    cleanModel() {
      this.model = {
        task_name: "",
        email: "",
        finish_date: "",
        task_state: "to do",
        file: "",
      };
    },
  },
};
</script>

<style scoped></style>
