<script>
import { ref, onMounted } from 'vue';
import { db } from '../firebase/index.js';
import { collection, getDocs } from 'firebase/firestore';
import ModalEducation from '../modals/modalEducation.vue';

// Import your image
import viewEducationImage from '../assets/images/viewEducation.png';

export default {
  name: 'ViewEducation',
  components: { ModalEducation },
  setup() {
    const educationItems = ref([]);
    const selectedItem = ref(null);
    const showModal = ref(false);

    // detect mobile
    const isMobile = ref(false);
    if (typeof window !== 'undefined') {
      isMobile.value = window.innerWidth <= 768;
      window.addEventListener('resize', () => {
        isMobile.value = window.innerWidth <= 768;
      });
    }

    const loadEducation = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'education'));
        let items = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          items.push({
            id: doc.id,
            name: data.name || '',
            school: data.School || '',
            grade: data.nqfLevel ? `NQF ${data.nqfLevel}` : '',
            startDate: data.startDate || '',
            endDate: data.endDate || '',
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
      if (isMobile.value) return; // disable modal on mobile
      selectedItem.value = item;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      selectedItem.value = null;
    };

    onMounted(loadEducation);

    return { educationItems, selectedItem, showModal, openModal, closeModal, viewEducationImage, isMobile };
  }
};
</script>

<template>
  <div id="education">
    <section class="education-root">
      <div class="education-text-column">
        <h1 class="education-heading">EDUCATION</h1>

        <!-- Education Items -->
        <div class="education-content-wrapper">
          <div class="education-content">
            <div
              v-for="item in educationItems"
              :key="item.id"
              class="education-item"
              @click="openModal(item)"
            >
              <div class="education-col-left">
                <p><strong>Institution:</strong> {{ item.school }}</p>
                <p><strong>Qualification:</strong> {{ item.name }}</p>
                <p><strong>Date:</strong> {{ item.startDate }} – {{ item.endDate }}</p>
                <p><strong>Grade:</strong> {{ item.grade }}</p>
              </div>
              <div class="education-col-right">
                <p>{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Image Block -->
        <div class="education-image-block">
          <img :src="viewEducationImage" alt="Education certificate" />
        </div>
      </div>

      <ModalEducation
        v-if="showModal && !isMobile"
        :item="selectedItem"
        @close="closeModal"
      />
    </section>
  </div>
</template>

<style scoped>
div#education {
  width: 100vw;
  height: 100vh;
  background-color: #0a0b0d;
  overflow: hidden;
}

section.education-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0;
  box-sizing: border-box;
}

.education-text-column {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 40px 5% 20px 5%;
}

.education-heading {
  margin: 0 0 20px 0;
  font-size: clamp(1.8rem, 4vw, 3rem);
  color: #fff;
  text-transform: uppercase;
  border-left: 4px solid #ff4d00;
  padding-left: 24px;
  align-self: flex-start;
}

.education-content-wrapper {
  flex: 0 0 auto;
  width: 100%;
  display: flex;
  justify-content: flex-start;
}

.education-content {
  background: rgba(255, 255, 255, 0);
  padding: 20px;
  overflow-y: auto;
  max-height: 55vh;
  width: 90%;
}

.education-item {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  padding: 12px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  cursor: pointer;
  transition: background 0.2s ease;
}
.education-item:hover {
  background: rgba(255,77,0,0.2);
}

.education-col-left p,
.education-col-right p {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.85);
  margin: 4px 0;
}
.education-col-left strong {
  color: #ff4d00;
}

/* Image block anchored to bottom */
.education-image-block {
  display: flex;
  position: relative;
  width: calc(100vw - 54px);
  left: -82px;
  flex-grow: 1;
  overflow: hidden;
  margin: 0;
  background-color: #11111100;
  align-items: flex-end; /* anchor image to bottom */
}

.education-image-block img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  align-self: flex-end; /* ensure image sits at bottom */
}

/* Scrollbar styles */
.education-content::-webkit-scrollbar {
  width: 4px;
}
.education-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}
.education-content::-webkit-scrollbar-thumb {
  background: #ff4d00;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(255,77,0,0.5);
}

/* MOBILE VIEW */
@media (max-width: 768px) {
  section.education-root {
    padding: 20px;
  }
  .education-heading {
    font-size: clamp(1.5rem, 6vw, 2.2rem);
    margin-bottom: 16px;
    text-align: center;
  }
  .education-content {
    max-height: none;
    overflow-y: auto;
    width: 100%;
  }
  .education-item {
    display: block;
    text-align: center;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding: 12px;
    cursor: default;
  }
  .education-col-left {
    margin: 0 auto;
  }
  .education-col-right {
    display: none;
  }
  .education-image-block {
    display: none;
  }
}
</style>
