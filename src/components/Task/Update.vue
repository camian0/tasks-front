<template>
  <div>
    <el-dialog v-model="centerDialogVisible" title="Crear Tarea" width="500" center>
      <span class="content">
        <el-form
          ref="formRef"
          style="max-width: 600px"
          :model="model"
          :rules="rules"
          label-width="auto"
          class="demo-ruleForm"
          status-icon
        >
          <el-form-item label="Nombre de la tarea" prop="task_name">
            <el-input v-model="model.task_name" />
          </el-form-item>

          <el-form-item label="Correo" prop="email">
            <el-input v-model="model.email" />
          </el-form-item>

          <el-form-item label="Estado de la tarea" prop="task_state">
            <el-select v-model="model.task_state" placeholder="Selecciona un estado">
              <el-option label="Por Hacer" value="TO DO" />
              <el-option label="En proceso" value="PROCESS" />
              <el-option label="Finalizada" value="FINISHED" />
            </el-select>
          </el-form-item>

          <el-form-item label="Fecha de finalizacion" required>
            <el-form-item prop="finish_date">
              <el-date-picker
                v-model="model.finish_date"
                type="datetime"
                placeholder="Escoje una fecha"
                format="YYYY-MM-DD hh:mm"
                date-format="DD MMM, YYYY"
                time-format="hh:mm a"
              />
            </el-form-item>
          </el-form-item>

          <!-- para subir archivo -->
          <el-upload class="upload-demo" :on-change="handleChange" :limit="1" :auto-upload="false">
            <el-button type="primary">Subir archivo</el-button>
          </el-upload>

          <el-form-item style="text-align: center">
            <el-button type="primary" @click="getUrl(ruleFormRef)"> Crear Tarea </el-button>
            <el-button @click="resetForm(ruleFormRef)">Limpiar formulario</el-button>
            <el-button @click="closeForm()">Cancelar</el-button>
          </el-form-item>
        </el-form>
      </span>
      <!-- <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="centerDialogVisible = false"> Guardar </el-button>
        <el-button @click="centerDialogVisible = false">Cerrar</el-button>
      </div>
    </template> -->
    </el-dialog>

    <!-- <p>Bienvenido al componente actualizar tarea</p>
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

    <button @click="updateTask">Actualizar tarea</button> -->
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
