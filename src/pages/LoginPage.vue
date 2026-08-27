<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <a class="navbar-brand" href="#">
          <img src="/logo1.png" alt="logo">
          <span class="brand-name-1">RSTJ</span>
          <span class="brand-name-2">Fitness</span>
        </a>
        <p class="login-subtitle">Welcome back. Log in to continue.</p>
      </div>

      <form class="login-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            type="email"
            v-model="email"
            placeholder="you@example.com"
            required
          >
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            type="password"
            v-model="password"
            placeholder="Enter your password"
            required
          >
        </div>

        <div class="form-row">
          <div class="form-checkbox">
            <input id="remember" type="checkbox" v-model="rememberMe">
            <label for="remember">Remember me</label>
          </div>
          <a href="#" class="forgot-link">Forgot password?</a>
        </div>

        <p v-if="loginError" class="error-text">Invalid email or password.</p>

        <button type="submit" class="btn-custom btn-primary btn-block" :disabled="!canSubmit">
          Log In
        </button>
      </form>

      <p class="switch-text">
        Don't have an account? <router-link :to="{ name: 'Register'}" class="nav-link" >Register</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
  import { watch, ref, onBeforeMount, computed } from 'vue';
  import { Notyf } from 'notyf';
  import { useGlobalStore } from '../stores/global';
  import { useRouter } from 'vue-router';
  import api from '../api';

  const router = useRouter();
  const globalStore = useGlobalStore();

  const email = ref("");
  const password = ref("");
  const rememberMe = ref(false);
  const loginError = ref(false);
  const isEnabled = ref(false);

  const notyf = new Notyf();


  const canSubmit = computed(() => {
    return email.value.trim() !== "" && password.value !== "";
  });

  watch([email, password], (currentValue) => {
    isEnabled.value = currentValue.every(input => input !== "");
  });

  async function handleSubmit() {
    loginError.value = false;

    try {
      let res = await api.post('/users/login', {
        email: email.value,
        password: password.value
      });

      if (res.data) {
        notyf.success("Login Successful");

        localStorage.setItem("token", res.data.access);
        globalStore.getUserDetails(res.data.access);

        email.value = "";
        password.value = "";

        router.push({ path: '/profile' });
      }
    } catch (e) {
      loginError.value = true;
      

      if (e.response && [400, 401, 404].includes(e.response.status)) {
        notyf.error(e.response.data.message || "Invalid credentials.");
      } else {
        notyf.error("Login Failed. Please contact administrator.");
      }
    }
  }

  onBeforeMount(() => {
    if (globalStore.user?.token) {
      router.push({ path: "/myworkouts" });
    }
  });
</script>

<style scoped>
  .login-page {
    width: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;

    padding: clamp(24px, 5vw, 48px) 16px;
  }

  .login-card {
    width: 100%;
    max-width: 440px;
    background-color: white;
    border-radius: 16px;
    padding: clamp(28px, 5vw, 48px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  }

  .login-header {
    text-align: center;
    margin-bottom: 32px;
  }

  .navbar-brand {
    display: inline-flex;
    align-items: center;
    font-size: 20px;
    text-decoration: none;
  }

  .navbar-brand img {
    height: 44px;
  }

  .brand-name-1 {
    font-family: 'Gloock';
    padding-left: 0.6rem;
    color: #FF7477;
  }

  .brand-name-2 {
    font-family: 'Ubuntu';
    padding-left: 0.3rem;
    color: black;
  }

  .login-subtitle {
    font-family: 'Ubuntu', sans-serif;
    font-size: 14px;
    color: #333;
    margin-top: 12px;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .form-group label {
    font-family: 'Ubuntu', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: black;
  }

  .form-group input[type="email"],
  .form-group input[type="password"] {
    font-family: 'Ubuntu', sans-serif;
    font-size: 15px;
    padding: 12px 14px;
    border: 1px solid #ccc;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.2s ease;
  }

  .form-group input[type="email"]:focus,
  .form-group input[type="password"]:focus {
    border-color: #FF7477;
  }

  .form-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
  }

  .form-checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .form-checkbox input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: #FF7477;
    cursor: pointer;
  }

  .form-checkbox label {
    font-family: 'Ubuntu', sans-serif;
    font-size: 14px;
    color: #333;
  }

  .forgot-link {
    font-family: 'Ubuntu', sans-serif;
    font-size: 14px;
    color: #FF7477;
    text-decoration: none;
  }

  .forgot-link:hover {
    text-decoration: underline;
  }

  .error-text {
    font-family: 'Ubuntu', sans-serif;
    font-size: 13px;
    color: #d9534f;
    margin: 0;
  }

  .btn-custom {
    font-family: 'Ubuntu', sans-serif;
    font-size: 15px;
    font-weight: 700;
    text-decoration: none;
    padding: 14px 28px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.15s ease;
    outline: none;
  }

  .btn-custom:focus,
  .btn-custom:focus-visible {
    outline: none;
    box-shadow: none;
  }

  .btn-primary {
    background-color: #FF7477;
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background-color: #e65c5f;
    transform: translateY(-2px);
  }

  .btn-primary:disabled {
    background-color: #f5b8b9;
    cursor: not-allowed;
  }

  .btn-block {
    width: 100%;
  }

  .switch-text {
    font-family: 'Ubuntu', sans-serif;
    font-size: 14px;
    color: #333;
    text-align: center;
    margin-top: 24px;
  }

  .switch-text a {
    color: #FF7477;
    text-decoration: none;
    font-weight: 500;
  }

  .switch-text a:hover {
    text-decoration: underline;
  }

  @media (max-width: 480px) {
    .login-card {
      padding: 28px 20px;
    }
  }
</style>