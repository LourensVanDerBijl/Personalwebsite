<script>
import { ref, computed, onMounted } from 'vue';
import { db } from '../firebase/index.js';
import { collection, getDocs } from 'firebase/firestore';
import ModalCertification from '../modals/modalCertification.vue';

export default {
  name: 'ViewCertification',
  components: { ModalCertification },
  setup() {
    const certifications = ref([]);
    const loading = ref(true);
    const selectedCategory = ref("All");
    const isMobile = ref(false);
    const selectedCert = ref(null);

    const categories = ["All", "Development", "Leadership", "Technology", "Productivity"];

    const loadCertifications = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Certifications'));
        certifications.value = querySnapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        }));

        certifications.value.sort((a, b) => {
          const dateA = new Date(a.completedDate);
          const dateB = new Date(b.completedDate);
          return dateB - dateA;
        });
      } catch (err) {
        console.error("Error loading certifications:", err);
      } finally {
        loading.value = false;
      }
    };

    const filteredCertifications = computed(() => {
      if (selectedCategory.value === "All") {
        return certifications.value;
      }
      return certifications.value.filter(cert => cert.type === selectedCategory.value);
    });

    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 768;
    };

    onMounted(() => {
      loadCertifications();
      checkMobile();
      window.addEventListener("resize", checkMobile);
    });

    return { certifications, loading, categories, selectedCategory, filteredCertifications, isMobile, selectedCert };
  }
};
</script>

<template>
  <section class="certification-root">
    <div class="cert-content">
      <!-- Title with custom orange bar -->
      <h1 class="title">
        <span class="title-bar"></span>
        CERTIFICATIONS
      </h1>
      <p class="cert-subtitle">
        Continuously learning. Continuously building. Continuously improving.
      </p>

      <!-- Desktop Nav Tabs -->
      <div v-if="!isMobile" class="category-tabs">
        <button
          v-for="cat in categories"
          :key="cat"
          :class="{ active: selectedCategory === cat }"
          @click="selectedCategory = cat"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Mobile Dropdown -->
      <div v-else class="category-dropdown">
        <select v-model="selectedCategory">
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>

      <div v-if="loading" class="loading">Loading certifications...</div>

      <!-- Desktop Grid -->
      <div v-else-if="!isMobile" class="cert-scroll">
        <div class="cert-grid">
          <div
            v-for="cert in filteredCertifications"
            :key="cert.id"
            class="cert-card"
          >
            <p class="platform"><span class="dot"></span>{{ cert.platform }}</p>
            <h3 class="course">{{ cert.courseName }}</h3>
            <hr class="divider" />
            <p class="date">Issued {{ cert.completedDate }}</p>
            <button class="view-btn" @click="selectedCert = cert">
              View Certificate <span class="arrow">→</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile List -->
      <div v-else class="cert-list">
        <div v-for="cert in filteredCertifications" :key="cert.id" class="cert-list-item">
          <p class="platform"><span class="dot"></span>{{ cert.platform }}</p>
          <h3 class="course">{{ cert.courseName }}</h3>
          <p class="date">Issued {{ cert.completedDate }}</p>
          <button class="view-btn" @click="selectedCert = cert">
            View Certificate <span class="arrow">→</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <ModalCertification v-if="selectedCert" :item="selectedCert" @close="selectedCert = null" />
  </section>
</template>
<style scoped>
.certification-root {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background-color: #fff;
  color: #000;
  padding: 40px 60px;
  box-sizing: border-box;
  padding-top: 20px; /* reduced top spacing */
}

.cert-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

/* Title with custom orange bar */
h1.title {
  display: flex;
  align-items: center;
  font-size: 32px;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 5px; /* tighter spacing */
  color: #000;
}
.title-bar {
  width: 6px;
  height: 35px;
  background-color: #FF5100;
  border-radius: 2px;
  margin-right: 12px;
}

/* Subtitle */
.cert-subtitle {
  color: #666;
  font-size: 0.8rem; /* smaller text */
  font-style: italic;
  margin-top: 0;
  margin-bottom: 40px;
}

/* Category Tabs (pill-shaped) */
.category-tabs {
  background-color: #FF4D00;
  border-radius: 50px;
  padding: 6px;
  display: inline-flex;
  gap: 8px;
  margin-bottom: 24px;
}
.category-tabs button {
  background: transparent;
  color: #fff;
  border: none;
  border-radius: 40px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.category-tabs button.active {
  background-color: #fff;
  color: #FF4D00;
}

/* Mobile Dropdown */
.category-dropdown {
  margin-bottom: 20px;
}
.category-dropdown select {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* Scroll containers */
.cert-scroll,
.cert-list {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  padding-right: 10px;
  box-sizing: border-box;
}

/* Orange scrollbar */
.cert-scroll::-webkit-scrollbar,
.cert-list::-webkit-scrollbar {
  width: 6px;
}
.cert-scroll::-webkit-scrollbar-thumb,
.cert-list::-webkit-scrollbar-thumb {
  background-color: #FF4D00;
  border-radius: 10px;
}

/* Grid layout */
.cert-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

/* Certification Card */
.cert-card {
  background-color: #f9f9fb;
  padding: 16px;
  border-style: solid;
  border-width: 1.5px 0px 1.5px 1.5px;
  border-image: linear-gradient(to right, #FF5100, transparent) 1;
  border-right: none;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  height: 100%; /* equal height cards */
}
.platform {
  font-size: 12px;
  margin-bottom: 0; /* tighter spacing */
  color: #FF5100;
  display: flex;
  align-items: center;
}
.platform .dot {
  width: 6px;
  height: 6px;
  background-color: #FF5100;
  border-radius: 50%;
  margin-right: 6px;
}
.course {
  font-size: 16px;
  font-weight: 800;
  line-height: 1.2;
  margin-top: 2px; /* reduced gap above title */
  margin-bottom: 12px;
}
.divider {
  border: none;
  border-top: 1px solid #ddd;
  margin: 8px 0;
}
.date {
  font-size: 12px;
  color: #555;
  margin-top: auto; /* push date + button to bottom */
  margin-bottom: 0;
}
.view-btn {
  margin-top: 4px; /* tighter spacing above button */
  padding: 8px 12px;
  font-size: 11px;
  background: transparent;
  border: 1px solid #FF5100;
  color: #FF5100;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.view-btn .arrow {
  margin-left: 8px;
}
.view-btn:hover {
  background-color: rgba(255, 77, 0, 0.1);
}

/* Mobile List */
.cert-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.cert-list-item {
  border-bottom: 1px solid #ddd;
  padding-bottom: 12px;
}
.cert-list-item .platform {
  font-size: 12px;
  color: #FF5100;
}
.cert-list-item .course {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 4px;
}
.cert-list-item .date {
  font-size: 12px;
  color: #555;
}
.cert-list-item .view-btn {
  margin-top: 10px;
  padding: 8px 12px;
  font-size: 11px;
  background: transparent;
  border: 1px solid #FF5100;
  color: #FF5100;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.cert-list-item .view-btn:hover {
  background-color: rgba(255, 77, 0, 0.1);
}

/* Loading state */
.loading {
  text-align: center;
  font-size: 1rem;
  color: #555;
  margin-top: 20px;
}

/* Responsive */
@media (max-width: 768px) {
  .certification-root {
    padding: 20px;
  }
  h1.title {
    font-size: 24px;
  }
  .cert-grid {
    grid-template-columns: 1fr;
  }
  .course {
    font-size: 14px;
  }
}
</style>
