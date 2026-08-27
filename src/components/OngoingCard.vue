<template>
  <div class="workout-card">
    <div class="workout-card-top">
      <!-- Edit trigger placed on the top left -->
      <button 
        v-if="!isEditing" 
        type="button" 
        class="btn-edit-top" 
        @click="startEdit"
        title="Edit Workout"
      >
        Edit
      </button>

      <span class="status-badge status-ongoing">ONGOING</span>
    </div>

    <!-- Edit Mode Form -->
    <div v-if="isEditing" class="edit-form">
      <div class="edit-group">
        <label>Name:</label>
        <input v-model="editName" type="text" class="edit-input" />
      </div>
      <div class="edit-group">
        <label>Duration (mins):</label>
        <input v-model.number="editDuration" type="number" min="1" class="edit-input" />
      </div>

      <div class="card-actions">
        <button class="btn-custom btn-save" @click="handleSave">Save</button>
        <button class="btn-custom btn-cancel" @click="cancelEdit">Cancel</button>
      </div>
    </div>

    <!-- Normal View -->
    <template v-else>
      <p class="workout-title">{{ workout.name }}</p>

      <div class="workout-meta">
        <span>Duration: {{ workout.duration }}</span>
      </div>

      <div class="card-actions">
        <button class="btn-custom btn-finish" @click="handleFinish">
          Mark Finished
        </button>
        <button class="btn-custom btn-delete" @click="handleDelete">
          Delete
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
  import { ref } from 'vue';

  const props = defineProps({
    workout: {
      type: Object,
      required: true
    }
  });

  const emit = defineEmits(['finish', 'delete', 'update']);

  const isEditing = ref(false);
  const editName = ref('');
  const editDuration = ref(null);

  function startEdit() {
    editName.value = props.workout.name;
    const numericDuration = parseInt(props.workout.duration, 10);
    editDuration.value = isNaN(numericDuration) ? null : numericDuration;
    isEditing.value = true;
  }

  function cancelEdit() {
    isEditing.value = false;
  }

  function handleSave() {
    if (!editName.value.trim()) return;

    const updatedPayload = {
      id: props.workout._id || props.workout.id,
      name: editName.value.trim(),
      duration: editDuration.value ? `${editDuration.value} minutes` : ''
    };

    emit('update', updatedPayload);
    isEditing.value = false;
  }

  function handleFinish() {
    emit('finish', props.workout._id || props.workout.id);
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
    justify-content: space-between; /* Keeps edit on left, status on right */
  }

  /* Top-Left Edit Button */
  .btn-edit-top {
    background: none;
    border: none;
    color: #FF7477;
    font-family: 'Ubuntu', sans-serif;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    padding: 0;
    text-decoration: underline;
    transition: color 0.2s ease;
  }

  .btn-edit-top:hover {
    color: #e65c5f;
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

  .status-ongoing {
    background-color: #E6F7EC;
    color: #2E9E5B;
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

  .btn-finish {
    background-color: #E6F7EC;
    color: #2E9E5B;
    flex: 1;
  }

  .btn-finish:hover {
    background-color: #d3f0dd;
  }

  .btn-delete {
    background-color: #FDEDED;
    color: #d9534f;
  }

  .btn-delete:hover {
    background-color: #f9dcdc;
  }

  /* Edit form */
  .edit-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .edit-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .edit-group label {
    font-family: 'Ubuntu', sans-serif;
    font-size: 12px;
    font-weight: 700;
    color: #555;
  }

  .edit-input {
    font-family: 'Ubuntu', sans-serif;
    font-size: 13px;
    padding: 6px 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    outline: none;
  }

  .edit-input:focus {
    border-color: #FF7477;
  }

  .btn-save {
    background-color: #FF7477;
    color: white;
    flex: 1;
  }

  .btn-save:hover {
    background-color: #e65c5f;
  }

  .btn-cancel {
    background-color: #f0f0f0;
    color: #333;
  }

  .btn-cancel:hover {
    background-color: #e2e2e2;
  }
</style>