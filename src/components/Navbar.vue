<template>
  <nav class="navbar">
    <div class="container">
      <router-link :to="{ name: 'Home'}" class="navbar-brand">
        <img src="/logo1.png" alt="logo">
        <span class="brand-name-1">RSTJ</span>
        <span class="brand-name-2">Fitness</span>
      </router-link>

      <button 
        class="menu-toggle" 
        @click="isOpen = !isOpen" 
        :class="{ active: isOpen }" 
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div class="nav-links" :class="{ open: isOpen }">
        <router-link :to="{ name: 'Home'}" class="nav-link">Home</router-link>
        <router-link :to="{ name: 'Workouts'}" class="nav-link" v-if="user.email">My Workouts</router-link>
        <router-link :to="{ name: 'Profile'}" class="nav-link" v-if="user.email">Profile</router-link>
        <router-link :to="{ name: 'Register'}" class="nav-link" v-if="!user.email">Register</router-link>
        <router-link :to="{ name: 'Login'}" class="nav-link" v-if="!user.email">Login</router-link>
        <router-link :to="{ name: 'Logout'}" class="nav-link" v-else>Logout</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
  import { ref } from "vue";
  import { storeToRefs } from "pinia";
  import { useGlobalStore } from "../stores/global";

  const isOpen = ref(false);

  const globalStore = useGlobalStore();
  const { user } = storeToRefs(globalStore);
</script>

<style scoped>
  nav {
    height: 60px;
    background-color: #9CF6F6;
    position: relative;
  }

  .container {
    height: 100%;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .navbar-brand {
    display: flex;
    align-items: center;
    font-size: 20px;
    text-decoration: none;
  }

  .brand-name-1 {
    font-family: 'Gloock', serif;
    padding-left: 1rem;
    color: #FF7477;
  }

  .brand-name-2 {
    font-family: 'Ubuntu', sans-serif;
    padding-left: 0.3rem;
    color: black;
  }

  img {
    height: 40px;
  }

  .menu-toggle {
    display: none;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    width: 32px;
    height: 32px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 20;
  }

  .menu-toggle span {
    display: block;
    height: 2px;
    width: 100%;
    background-color: #333;
    transition: transform 0.25s ease, opacity 0.25s ease;
  }

  .menu-toggle.active span:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }

  .menu-toggle.active span:nth-child(2) {
    opacity: 0;
  }

  .menu-toggle.active span:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 32px;
  }

  .nav-link {
    font-family: 'Ubuntu', sans-serif;
    font-size: 18px;
    font-weight: 500;
    color: #333;
    text-decoration: none;
    padding: 8px 4px;
    position: relative;
    transition: color 0.2s ease;
  }

  .nav-link::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 2px;
    background-color: #FF7477;
    transition: width 0.2s ease;
  }

  .nav-link:hover {
    color: #FF7477;
  }

  .nav-link:hover::after {
    width: 100%;
  }

  @media (max-width: 992px) {
    .menu-toggle {
      display: flex;
    }

    .nav-links {
      position: absolute;
      top: 60px;
      left: 0;
      right: 0;
      flex-direction: column;
      align-items: flex-start;
      gap: 0;
      background-color: #9CF6F6;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .nav-links.open {
      max-height: 300px;
    }

    .nav-link {
      width: 100%;
      padding: 14px 24px;
    }

    .nav-link::after {
      display: none;
    }
  }

  @media (max-width: 576px) {
    .container {
      padding: 0 16px;
    }

    .navbar-brand {
      font-size: 20px;
    }

    img {
      height: 32px;
    }
  }
</style>