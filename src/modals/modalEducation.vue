<script>
export default {
  name: 'ModalEducation',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  emits: ['close']
};
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="modal-close" @click="$emit('close')">×</button>

      <div class="modal-body">
        <!-- Text content -->
        <div class="modal-text">
          <h2>{{ item.name }}</h2>
          <p><strong class="field-heading">Institution:</strong> {{ item.school }}</p>
          <p><strong class="field-heading">NQF Level:</strong> {{ item.grade }}</p>
          <p><strong class="field-heading">Start Date:</strong> {{ item.startDate }}</p>
          <p><strong class="field-heading">Completion Date:</strong> {{ item.endDate }}</p>
          <p class="modal-description">{{ item.description }}</p>
        </div>

        <!-- Scrollable certificate -->
        <div v-if="item.url" class="modal-image-scroll">
          <img :src="item.url" alt="Certificate" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(10, 11, 13, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background: #0a0b0d;
  border: 2px solid #ff4d00;
  border-radius: 8px;
  padding: 20px;
  max-width: 1200px;
  width: 95%;
  max-height: 90vh;
  color: #fff;
  box-shadow: 0 0 20px rgba(255, 77, 0, 0.6);
  position: relative;
  display: flex;
  flex-direction: column;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 14px;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #ff4d00;
  cursor: pointer;
}

.modal-body {
  display: flex;
  gap: 24px;
  margin-top: 40px;
  flex: 1;
  overflow: hidden;
}

.modal-text {
  flex: 1;
  overflow-y: auto;
}

.field-heading {
  color: #ff4d00; /* orange headings */
}

.modal-description {
  margin-top: 12px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
}

.modal-image-scroll {
  flex: 1;
  overflow-y: auto; /* scrollable certificate */
  border: 1px solid #ff4d00;
  border-radius: 6px;
  box-shadow: 0 0 15px rgba(255, 77, 0, 0.5);
  padding: 8px;
  text-align: center;
}

/* Orange scrollbar for certificate */
.modal-image-scroll::-webkit-scrollbar {
  width: 8px;
}
.modal-image-scroll::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}
.modal-image-scroll::-webkit-scrollbar-thumb {
  background: #ff4d00;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(255,77,0,0.5);
}

.modal-image-scroll img {
  width: 100%;
  height: auto;
  display: block;
}

/* Responsive */
@media (max-width: 768px) {
  .modal-body {
    flex-direction: column;
  }
  .modal-image-scroll {
    margin-top: 16px;
    max-height: 50vh;
  }
}
</style>
