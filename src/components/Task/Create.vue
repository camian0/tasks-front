v

<template>
  <el-button plain @click="centerDialogVisible = true"> Crear tarea </el-button>

  <el-dialog v-model="centerDialogVisible" title="Crear Tarea" width="500" center>
    <span class="content">
      <el-form
        ref="ruleFormRef"
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
          <el-button type="primary">Subir</el-button>
        </el-upload>

        <el-form-item style="text-align: center">
          <el-button type="primary" @click="getUrl(ruleFormRef)"> Create </el-button>
          <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
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
</template>

<script>
import { postData, postFormData } from "../../request/request";
import { ref, reactive } from "vue";

export default {
  name: "CreateTask",
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
        task_state: "TO DO",
        file: "",
      },
      urlUploadFile: "",
      rules: {
        task_name: [
          { required: true, message: "Por favor ingresa un nombre para la tarea", trigger: "blur" },
        ],
        email: [
          {
            required: true,
            message: "Por favor ingresa un correo electronico",
            trigger: "blur",
          },
          {
            type: "email",
            message: "Por favor ingresa un correo electronico válido",
            trigger: ["blur", "change"],
          },
        ],
        finish_date: [
          {
            type: "date",
            required: true,
            message: "Por favor escoje una fecha",
            trigger: "change",
          },
        ],
        task_state: [
          {
            required: true,
            message: "Por favor selecciona un estado para la tarea",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    resetForm() {
      this.$refs.ruleFormRef.resetFields();
    },
    async getUrl() {
      console.log("Creando tarea");
      console.log("modelo ", this.model);
      console.log("fecha del modelo", this.model.finish_date);
      const modelSent = this.createObjectSent(this.model);

      console.log("modelo a enviar", modelSent);

      // validar formulario
      this.$refs.ruleFormRef.validate(async (valid) => {
        // si el formulario de válido se sigue con la petición
        if (valid) {
          // comprobamos que se haya seleccionado un archivo
          console.log("formulario válido");
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

          return;
        }

        return false;
      });
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

    // manejar el archivo que se sube y se guarda al modelo
    handleChange(uploadFile, uploadFiles) {
      if (uploadFiles !== undefined) {
        this.model.file = uploadFile;
      }
    },

    getHashNameFile() {
      const fecha = new Date().toISOString();
      const caracteresAleatorios = Math.random().toString(36).substring(2, 10);
      return `${fecha}-${caracteresAleatorios}`;
    },

    createObjectSent(task) {
      let modelSent = { ...task };
      modelSent.finish_date = this.processDate(this.model.finish_date);
      modelSent.task_state = modelSent.task_state.toUpperCase();
      let hashFile = this.getHashNameFile() + modelSent.file.name;
      modelSent.file_name = hashFile;

      return modelSent;
    },

    processDate(date) {
      if (!(date instanceof Date)) {
        throw new Error("El parámetro debe ser un objeto Date válido");
      }

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Meses van de 0-11
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      // Formatear en ISO 8601 sin zona horaria
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
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
