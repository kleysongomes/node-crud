<template>
  <v-container fluid class="pa-0 pt-12">
    <v-card class="mx-4 pa-4">
      <v-card-title>
        {{ isEditMode ? 'Editar Aluno' : 'Cadastrar Aluno' }}
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="formValid" @submit.prevent="handleSubmit">
          <v-text-field
            v-model="student.ra"
            label="RA"
            :disabled="isEditMode"
            :rules="rules.ra"
            required
            maxlength="8"
            class="mb-4"
          ></v-text-field>
          <v-text-field
            v-model="student.name"
            label="Nome"
            :rules="rules.name"
            required
            class="mb-4"
          ></v-text-field>
          <v-text-field
            v-model="student.email"
            label="Email"
            :rules="rules.email"
            required
            class="mb-4"
          ></v-text-field>
          <v-text-field
            v-model="formattedCpf"
            label="CPF"
            :disabled="isEditMode"
            :rules="rules.cpf"
            required
            maxlength="14"
            class="mb-4"
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-end gap-4">
        <v-btn text color="grey" @click="goBack">
          Cancelar
        </v-btn>
        <v-btn text color="primary" @click="handleSubmit">
          Salvar
        </v-btn>
      </v-card-actions>

      <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
        {{ snackbar.text }}
      </v-snackbar>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

export default {
  name: 'StudentForm',
  data() {
    return {
      student: { ra: '', name: '', email: '', cpf: '' },
      formValid: false,
      snackbar: { show: false, text: '', color: '' },
      rules: {
        ra: [
          v => !!v || 'RA é obrigatório',
          v => /^\d{6,8}$/.test(v) || 'RA deve conter de 6 a 8 dígitos numéricos'
        ],
        name: [
          v => !!v || 'Nome é obrigatório',
          v => (v && v.trim().includes(' ')) || 'Informe o nome completo'
        ],
        email: [
          v => !!v || 'Email é obrigatório',
          v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Email inválido'
        ],
        cpf: [
          v => !!v || 'CPF é obrigatório',
          v => cpfValidator.isValid(v) || 'CPF inválido'
        ]
      }
    }
  },
  watch: {
    'student.ra'(newValue) {
      this.student.ra = newValue.replace(/\D/g, '');
    }
  },
  computed: {
    isEditMode() {
      return !!this.$route.params.ra;
    },
    formattedCpf: {
      get() {
        let value = this.student.cpf;
        if (!value) return '';
        return value
          .replace(/\D/g, '')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      },
      set(value) {
        this.student.cpf = value.replace(/\D/g, '');
      }
    }
  },
  methods: {
    showSnackbar(message, color = 'green') {
      this.snackbar.text = message;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
    async handleSubmit() {
      const { valid } = await this.$refs.form.validate();
      if (!valid) return;
      try {
        if (this.isEditMode) {
          await axios.put(`http://localhost:3000/students/${this.student.ra}`, {
            name: this.student.name,
            email: this.student.email
          });
          this.showSnackbar('Aluno atualizado com sucesso!');
        } else {
          await axios.post('http://localhost:3000/students', this.student);
          this.showSnackbar('Aluno cadastrado com sucesso!');
        }
        setTimeout(() => this.$router.push('/students'), 1000);
      } catch (error) {
        console.error('Erro ao salvar aluno:', error);
        const errorMsg = error.response?.data?.message ||
                       error.response?.data?.details?.join(', ') ||
                       error.response?.data?.error ||
                       'Erro ao salvar aluno.';
        this.showSnackbar(errorMsg, 'red');
      }
    },
    goBack() {
      this.$router.push('/students');
    },
    async loadStudent() {
      if (!this.isEditMode) return;
      try {
        const { data } = await axios.get(
          `http://localhost:3000/students/${this.$route.params.ra}`
        );
        this.student = data.data;
      } catch (error) {
        console.error('Erro ao carregar aluno:', error);
        const msg = error.response?.data?.error || 'Aluno não encontrado.';
        this.showSnackbar(msg, 'red');
        this.$router.push('/students');
      }
    },
  },
  mounted() {
    if (this.isEditMode) {
      this.loadStudent();
    }
  }
}
</script>