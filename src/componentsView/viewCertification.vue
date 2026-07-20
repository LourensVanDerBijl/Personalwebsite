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
    const selectedCert = ref(null); // track which cert is open in modal

    const categories = ["All", "Development", "Leadership", "Technology", "Productivity"];

    const loadCertifications = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Certifications'));
        certifications.value = querySnapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        }));
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
      <h1 class="title">CERTIFICATIONS</h1>

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
            :style="{ backgroundImage: 'url(' + cert.url + ')' }"
          >
            <div class="overlay">
              <div class="text-container">
                <h3 class="course">{{ cert.courseName }}</h3>
                <p class="platform">{{ cert.platform }}</p>
                <p class="date">Issued {{ cert.completedDate }}</p>
                <p class="type">Category: {{ cert.type }}</p>
              </div>
              <button class="view-btn" @click="selectedCert = cert">View Certificate</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile List -->
      <div v-else class="cert-list">
        <div v-for="cert in filteredCertifications" :key="cert.id" class="cert-list-item">
          <h3 class="course">{{ cert.courseName }}</h3>
          <p class="platform">{{ cert.platform }}</p>
          <p class="date">Issued {{ cert.completedDate }}</p>
          <button class="view-btn" @click="selectedCert = cert">View Certificate</button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <ModalCertification v-if="selectedCert" :item="selectedCert" @close="selectedCert = null" />
  </section>
</template>

<style scoped>
/* ... keep all your existing styles from before ... */
</style>


<style scoped>
.certification-root {
  display: flex;
  flex-direction: column;
  height: 100vh;   /* lock section to viewport height */
  width: 100%;
  background-color: #fff;
  color: #000;
  padding: 40px 60px;
  box-sizing: border-box;
}

.cert-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

/* Heading style */
h1.title {
  color: rgb(0, 0, 0);
  font-size: 45px;
  font-weight: 500;
  letter-spacing: -1.68px;
  border-left: 4px solid rgb(255, 77, 0);
  padding-left: 20px;
  margin-bottom: 24px;
  margin-top: 0;
}

/* Desktop Nav Tabs */
.category-tabs {
  display: flex;
  background-color: rgb(244, 242, 242);
  border-bottom: 1px solid rgb(255, 81, 0);
  padding: 6px 12px;
  gap: 30px;
  margin-bottom: 24px;
}

.category-tabs button {
  background: transparent;
  border: none;
  padding: 8px 0px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  color: rgb(102, 102, 102);
  border-bottom: 2px solid transparent;
}

.category-tabs button.active {
  color: rgb(255, 77, 0);
  border-bottom: 2px solid rgb(255, 77, 0);
}

/* Mobile Dropdown */
.category-dropdown {
  margin-bottom: 20px;
}
.category-dropdown select {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* Scroll containers (desktop + mobile) */
.cert-scroll,
.cert-list {
  flex: 1;
  height: 100%;          /* fill parent height */
  overflow-y: auto;       /* internal scroll */
  padding-right: 10px;
  box-sizing: border-box;
}

/* Orange scrollbar styling */
.cert-scroll::-webkit-scrollbar,
.cert-list::-webkit-scrollbar {
  width: 6px;
}
.cert-scroll::-webkit-scrollbar-thumb,
.cert-list::-webkit-scrollbar-thumb {
  background-color: rgb(255, 77, 0);
  border-radius: 10px;
}
.cert-scroll::-webkit-scrollbar-thumb:hover,
.cert-list::-webkit-scrollbar-thumb:hover {
  background-color: rgb(255, 77, 0);
}

/* Desktop Grid */
.cert-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}
.cert-card {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  min-height: 220px;
  background-size: cover;
  background-position: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}
.cert-card .overlay {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.65);
  color: #fff;
  text-align: center;
}
.cert-card .overlay .text-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.cert-card .overlay .course {
  font-size: 1.05rem;
  line-height: 1.2;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.cert-card .overlay .platform,
.cert-card .overlay .date,
.cert-card .overlay .type {
  font-size: 0.8rem;
  margin: 1px 0;
  opacity: 0.85;
}
.cert-card .overlay .view-btn {
  margin-top: auto;
  padding: 6px 14px;
  font-size: 0.75rem;
  background-color: #ff8c3c;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: 600;
}
.cert-card .overlay .view-btn:hover {
  background-color: #e67320;
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
.cert-list-item .course {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 4px;
}
.cert-list-item .platform {
  font-size: 0.9rem;
  color: #555;
}
.cert-list-item .date {
  font-size: 0.85rem;
  color: #777;
}
.cert-list-item .view-btn[data-v-cd098497] {
    background-color: rgb(255, 140, 60);
    color: white;
    border: none;
    padding: 6px 14px;
    border-radius: 4px;
    cursor: pointer;
}

/* Loading state */
.loading {
  text-align: center;
  font-size: 1.2rem;
  color: #555;
  margin-top: 20px;
}

/* Mobile-specific adjustments */
@media (max-width: 768px) {
  .certification-root {
    padding: 20px; /* reduce padding on mobile */
    height: 100vh; /* lock to viewport height */
  }

  h1.title {
    font-size: 28px; /* smaller heading */
    border-left-width: 3px;
    padding-left: 12px;
    margin-bottom: 16px;
  }

  .category-tabs {
    display: none; /* hide desktop tabs */
  }

  .category-dropdown select {
    font-size: 14px;
  }

  .cert-grid {
    grid-template-columns: 1fr; /* single column cards if ever shown */
  }

  .cert-card {
    min-height: 180px;
  }

  .cert-card .overlay .course {
    font-size: 0.95rem;
  }

  .cert-list {
    height: 100%;          /* lock list to viewport height */
    overflow-y: auto;       /* internal scroll */
    padding-right: 10px;
  }

  .cert-list-item .course {
    font-size: 1rem;
  }
}
</style>
