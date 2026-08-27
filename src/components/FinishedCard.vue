<template>
  <div class="workout-card">
    <div class="workout-card-top">
      <span class="status-badge status-finished">FINISHED</span>
    </div>

    <p class="workout-title">{{ workout.name }}</p>

    <div class="workout-meta">
      <span>{{ formattedDate }}</span>
      <span v-if="formattedDate && workout.duration" class="meta-dot">&bull;</span>
      <span>{{ workout.duration }}</span>
    </div>

    <div class="card-actions">
      <button class="btn-custom btn-unfinish" @click="handleUnfinish">
        Mark Unfinished
      </button>
      <button class="btn-custom btn-delete" @click="handleDelete">
        Delete
      </button>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    workout: {
      type: Object,
      required: true
    }
  });

  const emit = defineEmits(['delete', 'unfinish']);

  const formattedDate = computed(() => {
    const dateVal = props.workout.dateAdded || props.workout.updatedAt || props.workout.createdAt;
    if (!dateVal) return '';
    
    const date = new Date(dateVal);
    return isNaN(date.getTime()) 
      ? '' 
      : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  function handleUnfinish() {
    emit('unfinish', props.workout._id || props.workout.id);
  }

  function handleDelete() {
    emit('delete', props.workout._id || props.workout.id);
  }
</script>

<style scoped>
  .workout-card {
    background-color: white;
    border-radius: 14px;
    padding: 18px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .workout-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
  }

  .workout-card-top {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .workout-title {
    font-family: 'Ubuntu', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: #000;
    margin: 0;
  }

  .workout-meta {
    font-family: 'Ubuntu', sans-serif;
    font-size: 13px;
    color: #666;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .meta-dot {
    color: #ccc;
  }

  .status-badge {
    font-family: 'Ubuntu', sans-serif;
    font-size: 11px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 20px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .status-finished {
    background-color: #9CF6F6;
    color: #007A7A;
  }

  .card-actions {
    display: flex;
    gap: 8px;
    margin-top: 4px;
  }

  .btn-custom {
    font-family: 'Ubuntu', sans-serif;
    font-size: 13px;
    font-weight: 700;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    padding: 8px 14px;
    transition: background-color 0.2s ease;
  }

  .btn-unfinish {
    background-color: #FFF3CD;
    color: #856404;
  }

  .btn-unfinish:hover {
    background-color: #ffe8a1;
  }

  .btn-delete {
    background-color: #FDEDED;
    color: #d9534f;
  }

  .btn-delete:hover {
    background-color: #f9dcdc;
  }
</style>