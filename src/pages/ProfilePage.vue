<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { Notyf } from 'notyf';
  import api from '../api';


  import OngoingCard from '../components/OngoingCard.vue';
  import FinishedCard from '../components/FinishedCard.vue';

  const router = useRouter();
  const notyf = new Notyf();

  const userEmail = ref('');
  const workoutsList = ref([]);


  async function fetchWorkouts() {
    try {
      const [userRes, workoutsRes] = await Promise.allSettled([
        api.get('/users/details'),
        api.get('/workouts/getMyWorkouts')
      ]);

      if (userRes.status === 'fulfilled') {
        userEmail.value = userRes.value.data.user?.email || userRes.value.data.email || 'you@example.com';
      }

      if (workoutsRes.status === 'fulfilled') {
        const data = workoutsRes.value.data.workouts || workoutsRes.value.data || [];
        workoutsList.value = Array.isArray(data) ? data : [];
      }
    } catch (error) {
      console.error('Error loading profile details:', error);
      notyf.error('Failed to load profile data.');
    }
  }

  onMounted(() => {
    fetchWorkouts();
  });


  const userName = computed(() => {
    if (!userEmail.value) return 'Fitness Member';
    return userEmail.value.split('@')[0];
  });


  const userInitial = computed(() => {
    return userEmail.value ? userEmail.value.charAt(0).toUpperCase() : 'J';
  });


  const ongoingWorkouts = computed(() => {
    return workoutsList.value.filter((w) => w.status === 'pending');
  });

  const finishedWorkouts = computed(() => {
    return workoutsList.value.filter((w) => w.status === 'completed' || w.status === 'finished');
  });


  const totalWorkoutsCount = computed(() => finishedWorkouts.value.length);


  const totalMinutes = computed(() => {
    return finishedWorkouts.value.reduce((acc, workout) => {
      if (!workout.duration) return acc;
      const parsedMins = parseInt(workout.duration, 10);
      return acc + (isNaN(parsedMins) ? 0 : parsedMins);
    }, 0);
  });


  function navigateToAddWorkout() {
    router.push('/myworkouts');
  }


  async function handleUpdateWorkout(updatedData) {
    try {
      const response = await api.patch(`/workouts/updateWorkout/${updatedData.id}`, {
        name: updatedData.name,
        duration: updatedData.duration
      });

      if (response.status === 200 || response.status === 201) {
        notyf.success('Workout updated!');
        fetchWorkouts();
      }
    } catch (error) {
      console.error('Failed to update workout:', error);
      notyf.error('Error updating workout.');
    }
  }

  async function handleFinishWorkout(id) {
    try {
      await api.patch(`/workouts/completeWorkoutStatus/${id}`, { status: 'completed' });
      notyf.success('Workout completed!');
      fetchWorkouts(); // Calls fetchWorkouts() if on WorkoutsPage.vue
    } catch (error) {
      console.error('Failed to finish workout:', error);
      notyf.error(error.response?.data?.message || 'Failed to mark workout as finished.');
    }
  }

  async function handleUnfinishWorkout(id) {
    try {
      await api.patch(`/workouts/completeWorkoutStatus/${id}`, { status: 'pending' });

      notyf.success("Workout moved back to ongoing!");
      fetchWorkouts(); 
    } catch (error) {
      console.error("Failed to mark workout as unfinished:", error);
      notyf.error(error.response?.data?.message || "Failed to update workout status.");
    }
  }

  async function handleDeleteWorkout(id) {
    try {
      await api.delete(`/workouts/deleteWorkout/${id}`);
      notyf.success('Workout deleted.');
      fetchWorkouts();
    } catch (error) {
      notyf.error('Failed to delete workout.');
    }
  }
</script>

<template>
  <div class="profile-page">
    <div class="profile-container">

      <!-- Profile summary card -->
      <div class="profile-card">
        <div class="avatar-circle">
          {{ userInitial }}
        </div>
        <div class="profile-info">
          <p class="profile-name">{{ userName }}</p>
          <p class="profile-email">{{ userEmail || 'you@example.com' }}</p>
        </div>

        <!-- Completed Workouts Section inside Profile Card -->
        <div class="stats-wrapper">
          <p class="stats-header-title">Completed Workout(s):</p>
          <div class="profile-stats">
            <div class="stat">
              <span class="stat-value">{{ totalWorkoutsCount }}</span>
              <span class="stat-label">Workouts</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ totalMinutes }}</span>
              <span class="stat-label">Minutes</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Workouts section -->
      <div class="workouts-section">
        <div class="section-header">
          <h2 class="section-title">Your Workouts</h2>
          <button class="btn-custom btn-primary" type="button" @click="navigateToAddWorkout">
            + Add Workout
          </button>
        </div>

        <!-- Ongoing workouts -->
        <div class="workouts-subsection">
          <h3 class="subsection-title">Ongoing</h3>
          
          <div v-if="ongoingWorkouts.length" class="workouts-grid">
            <OngoingCard
              v-for="workout in ongoingWorkouts"
              :key="workout._id || workout.id"
              :workout="workout"
              @finish="handleFinishWorkout"
              @delete="handleDeleteWorkout"
              @update="handleUpdateWorkout"
            />
          </div>

          <div v-else class="empty-state">
            <p class="empty-title">No ongoing workouts</p>
            <p class="empty-subtitle">Start a new workout to see it here.</p>
          </div>
        </div>

        <!-- Finished workouts -->
        <div class="workouts-subsection">
          <h3 class="subsection-title">Finished</h3>

          <div v-if="finishedWorkouts.length" class="workouts-grid">
            <FinishedCard
              v-for="workout in finishedWorkouts"
              :key="workout._id || workout.id"
              :workout="workout"
              @unfinish="handleUnfinishWorkout"
              @delete="handleDeleteWorkout"
            />
          </div>

          <div v-else class="empty-state">
            <p class="empty-title">No finished workouts</p>
            <p class="empty-subtitle">Completed workouts will appear here.</p>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<style scoped>
  .profile-page {
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    background-color: #f7f7f8;
    padding: clamp(24px, 5vw, 48px) 16px;
  }

  .profile-container {
    width: 100%;
    max-width: 720px;
  }

  /* Profile summary card */
  .profile-card {
    display: flex;
    align-items: center;
    gap: 20px;
    background-color: white;
    border-radius: 16px;
    padding: clamp(20px, 4vw, 32px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
    margin-bottom: 32px;
    flex-wrap: wrap;
  }

  .avatar-circle {
    width: 64px;
    height: 64px;
    min-width: 64px;
    border-radius: 50%;
    background-color: #FF7477;
    color: white;
    font-family: 'Ubuntu', sans-serif;
    font-size: 24px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .profile-info {
    flex: 1;
    min-width: 160px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .profile-name {
    font-family: 'Ubuntu', sans-serif;
    font-size: 17px;
    font-weight: 700;
    color: black;
    margin: 0;
    text-transform: capitalize;
  }

  .profile-email {
    font-family: 'Ubuntu', sans-serif;
    font-size: 14px;
    color: #666;
    margin: 0;
  }

  /* Stats section container inside profile card */
  .stats-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
    margin-left: auto;
  }

  .stats-header-title {
    font-family: 'Ubuntu', sans-serif;
    font-size: 12px;
    font-weight: 700;
    color: #007A7A;
    background-color: #9CF6F6;
    padding: 3px 10px;
    border-radius: 12px;
    margin: 0;
  }

  .profile-stats {
    display: flex;
    gap: 28px;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .stat-value {
    font-family: 'Ubuntu', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #FF7477;
  }

  .stat-label {
    font-family: 'Ubuntu', sans-serif;
    font-size: 12px;
    color: #666;
  }

  /* Workouts section */
  .workouts-section {
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }

  .section-title {
    font-family: 'Ubuntu', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: black;
    margin: 0;
  }

  .btn-custom {
    font-family: 'Ubuntu', sans-serif;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.15s ease;
    outline: none;
  }

  .btn-primary {
    background-color: #FF7477;
    color: white;
  }

  .btn-primary:hover {
    background-color: #e65c5f;
    transform: translateY(-2px);
  }

  /* Ongoing / Finished groups */
  .workouts-subsection {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .subsection-title {
    font-family: 'Ubuntu', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0;
  }

  .workouts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
  }

  /* Empty state */
  .empty-state {
    background-color: white;
    border-radius: 14px;
    padding: 40px 20px;
    text-align: center;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  }

  .empty-title {
    font-family: 'Ubuntu', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: black;
    margin: 0 0 6px 0;
  }

  .empty-subtitle {
    font-family: 'Ubuntu', sans-serif;
    font-size: 14px;
    color: #666;
    margin: 0;
  }

  @media (max-width: 480px) {
    .profile-card {
      padding: 20px;
    }

    .stats-wrapper {
      margin-left: 0;
      width: 100%;
      align-items: center;
    }

    .profile-stats {
      width: 100%;
      justify-content: space-around;
    }
  }
</style>