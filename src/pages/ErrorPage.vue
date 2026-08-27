<script setup>
  import { useRouter } from 'vue-router';

  const router = useRouter();

  function goHome() {
    router.push({ path: '/' });
  }
</script>

<template>
  <div class="not-found-page">
    <div class="not-found-card">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">Page Not Found</h2>
      <p class="error-message">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <button class="btn btn-primary" @click="goHome">
        Back to Home
      </button>
    </div>
  </div>
</template>

<style scoped>
  .not-found-page {
    width: 100%;
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }

  .not-found-card {
    text-align: center;
    max-width: 480px;
    padding: 40px 24px;
  }

  .error-code {
    font-family: 'Gloock', serif;
    font-size: clamp(72px, 12vw, 120px);
    font-weight: 800;
    color: #FF7477;
    line-height: 1;
    margin: 0 0 16px 0;
  }

  .error-title {
    font-family: 'Ubuntu', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 12px;
  }

  .error-message {
    font-family: 'Ubuntu', sans-serif;
    font-size: 15px;
    color: #666;
    margin-bottom: 28px;
  }

  .btn {
    font-family: 'Ubuntu', sans-serif;
    font-size: 15px;
    font-weight: 700;
    padding: 12px 28px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.15s ease;
  }

  .btn-primary {
    background-color: #FF7477;
    color: white;
  }

  .btn-primary:hover {
    background-color: #e65c5f;
    transform: translateY(-2px);
  }
</style>