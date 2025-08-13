<template>
  <v-container fluid class="pa-0 pt-12">
    <v-card class="mx-4 pa-4">
      <v-row align="center" justify="space-between" class="mb-4">
        <v-col cols="12" md="4">
          <h2 class="text-h6 font-weight-bold">Consulta de alunos</h2>
        </v-col>
        <v-col cols="12" md="4" class="d-flex justify-center">
          <v-text-field
            v-model="search"
            placeholder="Buscar por nome, RA ou CPF"
            variant="outlined"
            density="compact"
            hide-details
            clearable
            style="max-width: 400px; width: 100%;"
            @input="debouncedFetch"
            @click:clear="clearSearch"
          />
        </v-col>
        <v-col cols="12" md="4" class="d-flex justify-end">
          <v-btn text small color="primary" @click="goToCreate">Cadastrar Aluno</v-btn>
        </v-col>
      </v-row>

      <v-data-table
        :headers="headers"
        :items="students"
        :loading="loading"
        hide-default-footer item-key="ra"
        class="elevation-1"
      >
        <template #item.cpf="{ item }">{{ formatCpf(item.cpf) }}</template>
        <template #item.actions="{ item }">
          <v-btn size="small" color="blue" variant="text" @click="goToEdit(item.ra)">Editar</v-btn>
          <v-btn size="small" color="red" variant="text" @click="openDeleteDialog(item)">Excluir</v-btn>
        </template>
      </v-data-table>

      <div class="text-center pt-2">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
        ></v-pagination>
      </div>

      <v-dialog v-model="deleteDialog" max-width="500">
        <v-card elevation="12">
          <v-card-title class="text-h6">
            <v-icon color="warning" class="mr-2">mdi-alert-circle</v-icon>Confirmar exclusão
          </v-card-title>
          <v-card-text>
            <p>Você está prestes a excluir o aluno:</p>
            <p><strong>{{ studentToDelete?.name }}</strong> (RA: {{ studentToDelete?.ra }})</p>
            <p class="text-caption">Esta ação é irreversível.</p>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text color="grey lighten-1" @click="deleteDialog = false">Cancelar</v-btn>
            <v-btn text color="red darken-1" @click="confirmDelete">Excluir</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
        {{ snackbar.text }}
      </v-snackbar>
      
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  name: 'StudentList',
  data() {
    return {
      students: [], loading: true, search: '',
      currentPage: 1,
      totalPages: 0,
      itemsPerPage: 10,
      debounceTimer: null, deleteDialog: false, studentToDelete: null,
      snackbar: { show: false, text: '', color: '' },
      headers: [
        { text: 'Registro Acadêmico', value: 'ra' }, { text: 'Nome', value: 'name' },
        { text: 'CPF', value: 'cpf', sortable: false }, { text: 'Ações', value: 'actions', sortable: false }
      ]
    }
  },
  watch: {
    currentPage(newPage) {
      this.fetchStudents(newPage);
    }
  },
  mounted() {
    this.fetchStudents(this.currentPage);
  },
  methods: {
    async fetchStudents(page) {
      this.loading = true;
      try {
        const params = { page: page, limit: this.itemsPerPage, search: this.search };
        const response = await axios.get('http://localhost:3000/students', { params });
        this.students = response.data.data;
        this.totalPages = response.data.pagination.totalPages;
      } catch (error) {
        console.error('Erro ao buscar alunos:', error);
        const msg = error?.response?.data?.error || 'Erro ao buscar alunos.';
        this.showSnackbar(msg, 'red');
      } finally { this.loading = false; }
    },
    debouncedFetch() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        if (this.currentPage !== 1) { this.currentPage = 1; } 
        else { this.fetchStudents(1); }
      }, 500);
    },
    clearSearch() { 
      this.search = ''; 
      if (this.currentPage !== 1) { this.currentPage = 1; } 
      else { this.fetchStudents(1); }
    },
    formatCpf(cpf) { if (!cpf) return ''; const c = cpf.replace(/\D/g, ''); if (c.length !== 11) return cpf; return c.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'); },
    goToCreate() { this.$router.push('/students/new'); },
    goToEdit(ra) { this.$router.push(`/students/${ra}/edit`); },
    openDeleteDialog(student) { this.studentToDelete = student; this.deleteDialog = true; },
    async confirmDelete() { try { await axios.delete(`http://localhost:3000/students/${this.studentToDelete.ra}`); this.showSnackbar('Aluno excluído com sucesso!'); this.fetchStudents(this.currentPage); } catch (error) { const msg = error?.response?.data?.error || 'Erro ao excluir aluno.'; this.showSnackbar(msg, 'red'); } finally { this.deleteDialog = false; } },
    showSnackbar(text, color = 'green') { this.snackbar.text = text; this.snackbar.color = color; this.snackbar.show = true; }
  }
}
</script>