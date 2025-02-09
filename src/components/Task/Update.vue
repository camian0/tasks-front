<template>
  <div>
    <el-dialog v-model="modalUpdateShow" title="Actualizar Tarea" width="500" center>
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
          <el-form-item style="text-align: center">
            <el-button type="primary" @click="updateTask(ruleFormRef)">
              Actualizar Tarea
            </el-button>
            <el-button @click="resetForm(ruleFormRef)">Limpiar formulario</el-button>
            <el-button @click="closeForm()">Cancelar</el-button>
          </el-form-item>
        </el-form>
      </span>
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
import { ref } from "vue";
import { ElLoading } from "element-plus";

export default {
  name: "UpdateTask",
  setup() {
    const modalUpdateShow = ref(false);
    return {
      modalUpdateShow,
    };
  },
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
      console.log("modelo para actualziar ", this.model);
      this.modalUpdateShow = true;
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
      loadingPage: null,
    };
  },

  methods: {
    resetForm() {
      this.$refs.formRef.resetFields();
    },
    async updateTask() {
      let modelSent = { ...this.model };
      modelSent.finish_date = this.processDate(this.model.finish_date);

      // validamos el formulario
      this.$refs.formRef.validate((valid) => {
        if (!valid) {
          console.log("❌  Formulario invalido:", this.model);
          return false;
        }
      });

      this.loadingPage = ElLoading.service();
      let response = await putData(`tasks/${modelSent.id}`, modelSent);
      if (response.status === 200) {
        ElNotification({
          title: "Exito",
          message: response.data.message,
          type: "success",
        });
        this.closeForm();
        this.loadingPage.close();
        return;
      }
      ElNotification({
        title: "Error",
        message: response.data.message,
        type: "error",
      });

      if (this.loadingPage) {
        this.loadingPage.close();
      }
      this.closeForm();
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

    closeForm() {
      this.modalUpdateShow = false;
      this.cleanModel();
    },
  },
};
</script>

<style scoped></style>
