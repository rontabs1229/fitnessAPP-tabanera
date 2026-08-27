<script setup>
  import { ref, watch, onMounted } from "vue";
  import { Notyf } from "notyf";
  import { useRouter } from "vue-router";
  import { useGlobalStore } from "../stores/global";
  import api from "../api";

  // Import components
  import OngoingCard from "../components/OngoingCard.vue";
  import FinishedCard from "../components/FinishedCard.vue";

  const notyf = new Notyf();
  const router = useRouter();
  const globalStore = useGlobalStore();

  const name = ref("");
  const duration = ref(null);
  const isEnabled = ref(false);
  const ongoingWorkouts = ref([]);
  const finishedWorkouts = ref([]);


  async function fetchWorkouts() {
    try {
      const response = await api.get("/workouts/getMyWorkouts");
      

      const data = response.data.workouts || response.data || [];
      const workoutsList = Array.isArray(data) ? data : [];


      ongoingWorkouts.value = workoutsList.filter((w) => w.status === "pending");
      finishedWorkouts.value = workoutsList.filter((w) => w.status === "completed" || w.status === "finished");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        ongoingWorkouts.value = [];
        finishedWorkouts.value = [];
      } else {
        console.error("Failed to fetch workouts:", error);
        notyf.error("Unable to load workouts.");
      }
    }
  }

  onMounted(() => {
    fetchWorkouts();
  });


  watch(name, (newName) => {
    isEnabled.value = newName.trim() !== "";
  });

  function resetForm() {
    name.value = "";
    duration.value = null;
  }

  async function handleSubmit() {
    if (!isEnabled.value) return;

    const workout = {
      name: name.value.trim(),
      duration: duration.value ? `${duration.value} minutes` : ''
    };

    try {
      const response = await api.post("/workouts/addWorkout", workout);
      if (response.status === 201) {
        notyf.success("Workout Started!");
        resetForm();
        fetchWorkouts();
      } else {
        notyf.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to add workout:", error);
      notyf.error(error.response?.data?.message || "Failed to create workout.");
    }
  }

  async function handleUpdateWorkout(updatedData) {
    try {
      const response = await api.patch(`/workouts/updateWorkout/${updatedData.id}`, {
        name: updatedData.name,
        duration: updatedData.duration
      });

      if (response.status === 200 || response.status === 201) {
        notyf.success("Workout updated!");
        fetchWorkouts();
      } else {
        notyf.error("Failed to update workout.");
      }
    } catch (error) {
      console.error("Failed to update workout:", error);
      notyf.error(error.response?.data?.message || "Error updating workout.");
    }
  }

  async function handleFinishWorkout(id) {
    try {
      await api.patch(`/workouts/completeWorkoutStatus/${id}`, { status: 'completed' });
      notyf.success('Workout completed!');
      fetchWorkouts();
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
      notyf.success("Workout deleted.");
      fetchWorkouts();
    } catch (error) {
      notyf.error("Failed to delete workout.");
    }
  }
</script>

<template>
  <div class="workouts-page">
    <div class="workouts-container">

      <!-- Page title + add button -->
      <div class="section-header">
        <h1 class="page-title">My Workouts</h1>
        <button class="btn-custom btn-primary" type="button">
          + Add Workout
        </button>
      </div>

      <!-- Add workout form -->
      <form @submit.prevent="handleSubmit">
        <div class="add-form-card">
          <h3 class="form-card-title">New Workout</h3>
          <div class="form-grid">
            <div class="form-group">
              <label for="name">Exercise Name:</label>
              <input
                id="name"
                type="text"
                v-model="name"
                placeholder="e.g. Upper Body Push"
              >
            </div>

            <div class="form-group">
              <label for="duration">Est. duration (mins.)</label>
              <input
                id="duration"
                type="number"
                min="1"
                v-model.number="duration"
                placeholder="30"
              >
            </div>
          </div>

          <div class="form-actions">
            <button class="btn-custom btn-secondary" type="button" @click="resetForm">
              Cancel
            </button>
            <button 
              class="btn-custom btn-primary" 
              type="submit" 
              :disabled="!isEnabled"
            >
              Start Workout
            </button>
          </div>
        </div>
      </form>

      <!-- Ongoing workouts -->
      <div class="workouts-subsection">
        <h2 class="subsection-title">Ongoing</h2>

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
          <p class="empty-subtitle">Create a new workout above to get started.</p>
        </div>
      </div>

      <!-- Finished workouts -->
      <div class="workouts-subsection">
        <h2 class="subsection-title">Finished</h2>

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
          <p class="empty-subtitle">Complete an ongoing workout to see it here.</p>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
  .workouts-page {
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    background-color: #f7f7f8;
    padding: clamp(24px, 5vw, 48px) 16px;
  }

  .workouts-container {
    width: 100%;
    max-width: 760px;
  }

  /* Section header */
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 28px;
  }

  .page-title {
    font-family: 'Ubuntu', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: black;
    margin: 0;
  }

  /* Buttons */
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

  .btn-secondary {
    background-color: #f0f0f0;
    color: #333;
  }

  .btn-secondary:hover {
    background-color: #e2e2e2;
  }

  /* Add workout form */
  .add-form-card {
    background-color: white;
    border-radius: 16px;
    padding: clamp(20px, 4vw, 28px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
    margin-bottom: 32px;
  }

  .form-card-title {
    font-family: 'Ubuntu', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: black;
    margin: 0 0 18px 0;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 16px;
    margin-bottom: 16px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .form-group label {
    font-family: 'Ubuntu', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: black;
  }

  .form-group input {
    font-family: 'Ubuntu', sans-serif;
    font-size: 14px;
    padding: 10px 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.2s ease;
    background-color: white;
  }

  .form-group input:focus {
    border-color: #FF7477;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  /* Workout groups */
  .workouts-subsection {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 28px;
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
    .form-actions {
      justify-content: stretch;
    }

    .form-actions .btn-custom {
      flex: 1;
    }
  }
</style>