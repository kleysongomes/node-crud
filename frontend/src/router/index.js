import { createRouter, createWebHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import StudentList from '@/components/StudentList.vue'
import StudentForm from '@/components/StudentForm.vue'
import LoginPage from '@/components/Login.vue'
import { isAuthenticated } from '@/services/auth.service' 

const routes = [
  { 
    path: '/login', 
    name: 'Login',
    component: LoginPage 
  },
  { 
    path: '/', 
    component: DefaultLayout, 
    meta: { requiresAuth: true },
    children: [
      { path: 'students', component: StudentList },
      { path: 'students/new', component: StudentForm },
      { path: 'students/:ra/edit', component: StudentForm },
      { path: '', redirect: 'students' },
    ]
  }
]

const router = createRouter({ history: createWebHistory(), routes })

// Guarda de navegação
router.beforeEach((to, from, next) => {
  const needsAuth = to.matched.some(record => record.meta.requiresAuth);

  // Se a rota exige login e o usuário não está autenticado, redireciona para /login
  if (needsAuth && !isAuthenticated()) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router