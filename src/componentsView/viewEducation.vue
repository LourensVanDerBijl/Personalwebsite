<script>
import { ref, onMounted } from 'vue';
import { db } from '../firebase/index.js';
import { collection, getDocs } from 'firebase/firestore';
import ModalEducation from '../modals/modalEducation.vue'

export default {
  name: 'ViewEducation',
  components: { ModalEducation },
  setup() {
    const educationItems = ref([]);
    const selectedItem = ref(null);

    const loadEducation = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'education'));
        let items = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          items.push({
            id: doc.id,
            school: data.School || '',
            name: data.name || '',
            startDate: data.startDate || '',
            endDate: data.endDate || '',
            grade: data.nqfLevel ? `NQF ${data.nqfLevel}` : '',
            description: data.description || '',
            url: data.url || ''
          });
        });

        items.sort((a, b) => {
          if (a.endDate === 'current') return -1;
          if (b.endDate === 'current') return 1;
          return parseInt(b.endDate) - parseInt(a.endDate);
        });

        educationItems.value = items;
      } catch (error) {
        console.error('Error loading education history:', error);
      }
    };

    const openModal = (item) => {
      selectedItem.value = item;
    };

    const closeModal = () => {
      selectedItem.value = null;
    };

    onMounted(loadEducation);

    return { educationItems, selectedItem, openModal, closeModal };
  }
};
</script>

<template>
  <div id="education">
    <section class="education-root">
      <h1 class="education-heading">EDUCATION</h1>
      <div class="education-list">
        <div
          v-for="item in educationItems"
          :key="item.id"
          class="education-entry"
          @click="openModal(item)"
        >
          <!-- Left column -->
          <div class="education-left">
            <div class="education-item">
              <span class="education-label">Institution</span>
              <span class="education-value">{{ item.school }}</span>
            </div>
            <div class="education-item">
              <span class="education-label">Qualification</span>
              <span class="education-value">{{ item.name }}</span>
            </div>
            <div class="education-item">
              <span class="education-label">Date</span>
              <span class="education-value">{{ item.startDate }} – {{ item.endDate }}</span>
            </div>
            <div class="education-item" v-if="item.grade">
              <span class="education-label">Grade</span>
              <span class="education-value">{{ item.grade }}</span>
            </div>
          </div>

          <!-- Right column -->
          <div class="education-right">
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <ModalEducation
        v-if="selectedItem"
        :item="selectedItem"
        @close="closeModal"
      />
    </section>
  </div>
</template>

<style scoped>
#education {
  width: 100%;
  min-height: 100vh;
  background-color: #0a0b0d;
  color: #fff;
  overflow: hidden;
}

section.education-root {
  padding-top: 24px;
}

/* Heading (keep large) */
h1.education-heading {
  margin-top: 10px;
  margin-bottom: 20px;
  margin-left: 40px;
  position: relative;
  z-index: 0;
  display: flex;
  align-items: center;
  font-size: 1.6rem; /* keep title large */
  font-weight: 700;
  text-transform: uppercase;
}
.education-heading::before {
  content: '';
  width: 4px;
  height: 20px;
  background-color: #ff4d00;
  margin-right: 12px;
}

/* List container */
.education-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
  box-sizing: border-box;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  position: relative;
  z-index: 1;
}

/* Entry card (smaller height) */
.education-entry {
  display: flex;
  gap: 30px;
  align-items: stretch;
  background-color: #0c0c0c;
  border: 1px solid #222;
  border-radius: 6px;
  min-height: 150px; /* reduced height */
  padding: 15px;     /* reduced padding */
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  z-index: 2;
}
.education-entry:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 10px rgba(255, 77, 0, 0.6);
  z-index: 10;
}

/* Left column */
.education-left {
  flex: 0 0 35%;
  padding-right: 15px;
  padding-left: 15px;
  display: flex;
  flex-direction: column;
  border-right: 2px solid;
  border-image-source: linear-gradient(
    to bottom,
    rgba(255, 77, 0, 0) 0%,
    rgb(255, 77, 0) 50%,
    rgba(255, 77, 0, 0) 100%
  );
  border-image-slice: 1;
}

/* Field blocks */
.education-item {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid;
  border-image-source: linear-gradient(to right, rgb(255, 77, 0), rgba(255, 77, 0, 0));
  border-image-slice: 1;
  padding-bottom: 3px;
  margin-bottom: 6px;
}
.education-item:last-child {
  border-bottom: none !important;
  border-image-source: none !important;
  padding-bottom: 0;
  margin-bottom: 0;
}

/* Text (smaller sizes) */
.education-label {
  color: rgb(255, 77, 0);
  line-height: 1.2;
  margin-bottom: 0;
  font-size: 9px; /* reduced further */
  text-transform: uppercase;
  font-weight: 600;
}
.education-value {
  color: #ffffff;
  line-height: 1.2;
  margin-top: 0;
  font-size: 11px; /* reduced further */
}

/* Right column */
.education-right {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
}
.education-right p {
  color: #b0b0b0;
  font-size: 11px; /* reduced further */
  line-height: 1.3;
  text-align: justify;
}

/* Scrollbar styling */
.education-entry::-webkit-scrollbar {
  width: 4px;
}
.education-entry::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}
.education-entry::-webkit-scrollbar-thumb {
  background: rgb(255, 77, 0);
  border-radius: 10px;
  box-shadow: 0 0 8px rgba(255, 77, 0, 0.5);
}

/* Mobile view adjustments */
@media (max-width: 1024px) {
  .education-entry {
    flex-direction: column;
    min-height: auto;
  }

  .education-right {
    display: none;
  }

  h1.education-heading {
    margin-left: 20px;
  }

  .education-left {
    border-right: none;
    border-bottom: 1px solid #222;
  }
}
</style>
