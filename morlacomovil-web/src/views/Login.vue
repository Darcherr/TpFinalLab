<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import User from '@/models/user-model';
import { useUserStore } from '@/store/storeExample';

const router = useRouter();
const userStore = useUserStore();
const isLogin = ref(true);
const loginData = ref({ email: '', password: '' });
const registerData = ref({ email: '', password: '', confirmPassword: '' });
const users = ref<User[]>([]);

const getUsers = () => {
    const storedUsers = localStorage.getItem('users');
  if (storedUsers) {
    users.value = JSON.parse(storedUsers);
  }
}

const generateUserId = () => {
  return Math.random().toString(36).substr(2, 9);
}

const login = () => {
  const user = users.value.find(
    u => u.email === loginData.value.email && u.password === loginData.value.password
  );

  if (user) {
    localStorage.setItem('user_data', JSON.stringify(user));
    console.log('Inicio de sesión exitoso:', user);
    goToShell();
  } else {
    console.error('Credenciales incorrectas');
  }
};

const register = () => {
  if (registerData.value.password !== registerData.value.confirmPassword) {
    console.error('Las contraseñas no coinciden');
    return;
  }

  getUsers();

  const exists = users.value.some((u) => u.email === registerData.value.email);
  if (exists) {
    console.error('El usuario ya está registrado');
    return;
  }

  const newUser = {
    userId: generateUserId(),
    email: registerData.value.email,
    password: registerData.value.password,
    balance: 20000,
  };

  users.value.push(newUser);
  localStorage.setItem('users', JSON.stringify(users.value)); 

  isLogin.value = true; 
  getUsers();
};

const goToShell = async() => {
  await router.push({ name: 'shell' });
};

onMounted(() => {
    getUsers();
});
</script>

<template>
  <div class="flex justify-content-center align-items-center displayScreen min-h-screen bg-gray-100 px-4">
    <div class="p-6 bg-white shadow-md rounded-lg loginBox">
      <h2 class="text font-semibold text-center mb-6">
        {{ isLogin ? 'Iniciar Sesión' : 'Registrarse' }}
      </h2>

      <div v-if="isLogin">
        <label>Email</label>
        <InputText v-model="loginData.email" type="email" placeholder="Tu correo" class="w-full" />

        <label>Contraseña</label>
        <Password v-model="loginData.password" toggleMask class="w-full" />

        <Button label="Ingresar" class="w-full mt-4" @click="login" />
      </div>

      <div v-else>
        <label>Email</label>
        <InputText v-model="registerData.email" type="email" placeholder="Tu correo" class="w-full" />

        <label>Contraseña</label>
        <Password v-model="registerData.password" toggleMask class="w-full" />

        <label>Confirmar Contraseña</label>
        <Password v-model="registerData.confirmPassword" toggleMask class="w-full" />

        <Button label="Registrarse" class="w-full mt-4" @click="register" />
      </div>

      <Button
        :label="isLogin ? 'Crear una cuenta' : 'Ya tengo una cuenta'"
        class="w-full mt-4 p-button-text"
        @click="isLogin = !isLogin"
      />
    </div>
  </div>
</template>

<style scoped>
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.displayScreen {
  background-color: gray;
}

.loginBox {
  width: 33.33%; 
  max-width: 400px;
  padding: 2rem;
}
</style>