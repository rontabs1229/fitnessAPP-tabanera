<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            Train Hard.<br>
            <span class="accent">Track Everything.</span>
          </h1>
          <p class="hero-subtitle">
            RSTJ Fitness helps you plan workouts, monitor progress, and stay consistent — all in one place.
          </p>
          <div class="hero-actions">
            <router-link :to="{ name: 'Register'}" class="btn btn-primary">Get Started</router-link>
            <a href="#" class="btn btn-secondary">Learn More</a>
          </div>
        </div>
        <div class="hero-image">
          <img src="/logo1.png" alt="RSTJ Fitness">
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="container">
        <h2 class="section-title">Why RSTJ Fitness</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">💪</div>
            <h3 class="feature-title">Custom Workouts</h3>
            <p class="feature-text">Build and follow workout plans tailored to your goals and schedule.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📈</div>
            <h3 class="feature-title">Track Progress</h3>
            <p class="feature-text">Log every session and watch your strength and endurance grow over time.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">👤</div>
            <h3 class="feature-title">Personal Profile</h3>
            <p class="feature-text">Keep your stats, history, and achievements all in one dashboard.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="container cta-content">
        <h2 class="cta-title">Ready to start your journey?</h2>
        <p class="cta-subtitle">Join RSTJ Fitness today and take the first step toward a stronger you.</p>
        <router-link :to="{ name: 'Register'}" class="btn btn-primary">Register Now</router-link>
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    name: 'HomePage'
  }
</script>

<style>
  .home {
    width: 100%;
    overflow-x: hidden;
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 clamp(16px, 4vw, 32px);
  }

  /* Hero */
  .hero {
    background-color: #E69597;
    padding: clamp(40px, 8vw, 100px) 0;
  }

  .hero-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: clamp(24px, 5vw, 40px);
  }

  .hero-text {
    flex: 1 1 480px;
    min-width: 0;
  }

  .hero-title {
    font-family: 'Gloock';
    font-size: clamp(26px, 5vw, 44px);
    line-height: 1.25;
    color: white;
    margin-bottom: clamp(14px, 2.5vw, 20px);
  }

  .hero-title .accent {
    color: #1a1a1a;
  }

  .hero-subtitle {
    font-family: 'Ubuntu', sans-serif;
    font-size: clamp(14px, 1.6vw, 17px);
    color: white;
    max-width: 460px;
    margin-bottom: clamp(20px, 4vw, 32px);
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }

  .hero-image {
    flex: 1 1 300px;
    min-width: 0;
    display: flex;
    justify-content: center;
  }

  .hero-image img {
    height: clamp(140px, 22vw, 260px);
    max-width: 100%;
    background-color: white;
    border-radius: 24px;
    padding: clamp(16px, 3vw, 32px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  .btn {
    font-family: 'Ubuntu', sans-serif;
    font-size: 15px;
    font-weight: 700;
    text-decoration: none;
    padding: 14px 28px;
    border-radius: 6px;
    transition: background-color 0.2s ease, color 0.2s ease, transform 0.15s ease;
    white-space: nowrap;
    outline: none;
    box-shadow: none;
  }

  .btn-primary {
    background-color: #FF7477;
    color: white;
  }

  .btn-primary:hover {
    background-color: #e65c5f;
    transform: translateY(-2px);
  }

  .btn-secondary {
    background-color: transparent;
    color: white;
    border: 2px solid white;
  }

  .btn-secondary:hover {
    background-color: white;
    color: #E69597;
  }

  /* Features */
  .features {
    background-color: white;
    padding: clamp(40px, 8vw, 100px) 0;
  }

  .section-title {
    font-family: 'Gloock';
    font-size: clamp(22px, 3.5vw, 32px);
    color: black;
    text-align: center;
    margin-bottom: clamp(28px, 5vw, 48px);
    display: block;
  }

  .features-grid {
    display: flex;
    flex-wrap: wrap;
    gap: clamp(20px, 3vw, 32px);
    justify-content: center;
  }

  .feature-card {
    flex: 1 1 280px;
    max-width: 340px;
    background-color: #CEB5B7;
    border-radius: 12px;
    padding: clamp(24px, 3vw, 32px) clamp(18px, 2.5vw, 24px);
    text-align: center;
    transition: transform 0.2s ease;
  }

  .feature-card:hover {
    transform: translateY(-6px);
  }

  .feature-icon {
    font-size: clamp(32px, 4vw, 40px);
    margin-bottom: 16px;
  }

  .feature-title {
    font-family: 'Gloock';
    font-size: clamp(17px, 2vw, 19px);
    color: black;
    margin-bottom: 12px;
  }

  .feature-text {
    font-family: 'Ubuntu', sans-serif;
    font-size: 14px;
    color: #333;
  }

  /* CTA */
  .cta {
    background-color: #B5D6D6;
    padding: clamp(40px, 6vw, 80px) 0;
  }

  .cta-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 12px;
  }

  .cta-title {
    font-family: 'Gloock';
    font-size: clamp(20px, 3vw, 28px);
    color: black;
    margin: 0;
  }

  .cta-subtitle {
    font-family: 'Ubuntu', sans-serif;
    font-size: clamp(13px, 1.5vw, 15px);
    color: #333;
    margin: 0 0 16px 0;
    max-width: 500px;
  }

  /* Large screens (stack on tablet/laptop landscape edge) */
  @media (max-width: 992px) {
    .hero-content {
      flex-direction: column-reverse;
      text-align: center;
    }

    .hero-subtitle {
      margin-left: auto;
      margin-right: auto;
    }

    .hero-actions {
      justify-content: center;
    }
  }

  /* Small phones */
  @media (max-width: 480px) {
    .hero-actions {
      flex-direction: column;
      width: 100%;
    }

    .btn {
      text-align: center;
      width: 100%;
      white-space: normal;
    }

    .feature-card {
      max-width: 100%;
    }
  }
</style>