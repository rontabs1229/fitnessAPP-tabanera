<script setup>
  import { ref, computed, onBeforeMount, onMounted } from 'vue';
  import { storeToRefs } from 'pinia';
  import { Notyf } from 'notyf';
  import 'notyf/notyf.min.css';
  import { useRouter } from 'vue-router';
  import { useGlobalStore } from '../stores/global';
  import api from '../api.js';

  const router = useRouter();
  const globalStore = useGlobalStore();
  const { user } = storeToRefs(globalStore);

  const email = ref("");
  const password = ref("");
  const confirmPassword = ref("");
  const agreedToTerms = ref(false);
  const submitted = ref(false);

  let notyf = null;
  onMounted(() => {
    notyf = new Notyf();
  });

  const passwordMismatch = computed(() => {
    return password.value !== "" && confirmPassword.value !== "" && password.value !== confirmPassword.value;
  });

  const canSubmit = computed(() => {
    return (
      email.value.trim() !== "" &&
      password.value !== "" &&
      confirmPassword.value !== "" &&
      !passwordMismatch.value &&
      agreedToTerms.value
    );
  });

  async function handleSubmit() {
    if (!canSubmit.value) return;

    try {
      let response = await api.post('/users/register', {
        email: email.value,
        password: password.value
      });

      if (response.status === 201) {
        notyf?.success("Registration Successful");
        submitted.value = true;
      } else {
        notyf?.error("Registration Failed. Please contact administrator.");
      }
    } catch (e) {
      if (e?.response && [400, 401, 404, 409].includes(e.response.status)) {
        notyf?.error(e.response.data.message);
      } else {
        console.error(e);
        notyf?.error("Registration Failed. Please contact admin.");
      }
    }
  }

  function resetForm() {
    email.value = "";
    password.value = "";
    confirmPassword.value = "";
    agreedToTerms.value = false;
    submitted.value = false;
  }

  onBeforeMount(() => {
    if (user.value?.token) {
      router.push({ path: '/profile' });
    }
  });
</script>

<template>
  <div class="register-page">
    <div class="register-card" v-if="!submitted">
      <div class="register-header">
        <a class="navbar-brand" href="#">
          <img src="/logo1.png" alt="logo">
          <span class="brand-name-1">RSTJ</span>
          <span class="brand-name-2">Fitness</span>
        </a>
        <p class="register-subtitle">Create your account to get started.</p>
      </div>

      <form class="register-form" @submit.prevent="handleSubmit">
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

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            v-model="confirmPassword"
            placeholder="Re-enter your password"
            required
          >
          <p v-if="passwordMismatch" class="error-text">Passwords do not match.</p>
        </div>

        <div class="form-group form-checkbox">
          <input
            id="terms"
            type="checkbox"
            v-model="agreedToTerms"
            required
          >
          <label for="terms">I agree to the <a href="#">Terms &amp; Conditions</a></label>
        </div>

        <button type="submit" class="btn btn-primary btn-block" :disabled="!canSubmit">
          Register
        </button>
      </form>
    </div>

    <div class="register-card success-card" v-else>
      <div class="success-icon">✓</div>
      <h2 class="success-title">Account Created</h2>
      <p class="success-text">Your account for <strong>{{ email }}</strong> has been registered.</p>
      <router-link :to="{ name: 'Login'}" class="btn btn-secondary btn-block" @click="resetForm">Go to Login</router-link>
    </div>
  </div>
</template>

<style scoped>
  .register-page {
    width: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(24px, 5vw, 48px) 16px;
  }

  .register-card {
    width: 100%;
    max-width: 440px;
    background-color: white;
    border-radius: 16px;
    padding: clamp(28px, 5vw, 48px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  }

  .register-header {
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

  .register-subtitle {
    font-family: 'Ubuntu', sans-serif;
    font-size: 14px;
    color: #333;
    margin-top: 12px;
  }

  .register-form {
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

  .error-text {
    font-family: 'Ubuntu', sans-serif;
    font-size: 13px;
    color: #d9534f;
    margin: 0;
  }

  .form-checkbox {
    flex-direction: row;
    align-items: center;
    gap: 10px;
  }

  .form-checkbox input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: #FF7477;
    cursor: pointer;
  }

  .form-checkbox label {
    font-size: 14px;
    font-weight: 400;
    color: #333;
  }

  .form-checkbox a {
    color: #FF7477;
    text-decoration: none;
  }

  .form-checkbox a:hover {
    text-decoration: underline;
  }

  .btn {
    font-family: 'Ubuntu', sans-serif;
    font-size: 15px;
    font-weight: 700;
    text-decoration: none;
    padding: 14px 28px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.15s ease;
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

  .btn-secondary {
    background-color: transparent;
    color: black;
    border: 2px solid black;
  }

  .btn-secondary:hover {
    background-color: black;
    color: white;
  }

  .btn-block {
    width: 100%;
  }

  .success-card {
    text-align: center;
  }

  .success-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background-color: #9CF6F6;
    color: #1a1a1a;
    font-size: 28px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px auto;
  }

  .success-title {
    font-family: 'Gloock';
    font-size: 22px;
    color: black;
    margin-bottom: 10px;
  }

  .success-text {
    font-family: 'Ubuntu', sans-serif;
    font-size: 14px;
    color: #333;
    margin-bottom: 24px;
  }

  @media (max-width: 480px) {
    .register-card {
      padding: 28px 20px;
    }
  }
</style>