<script>
import { ref, onMounted } from 'vue';
import { db } from '../firebase/index.js';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

export default {
  name: 'ViewVision',
  setup() {
    const careerAsp = ref({});
    const trainingPaths = ref([]);
    const selectedPath = ref(null);

    const loadVision = async () => {
      const visionDoc = await getDoc(doc(db, 'views', 'Vision'));
      if (visionDoc.exists()) careerAsp.value = visionDoc.data();
    };

    const loadTrainingPaths = async () => {
      const querySnapshot = await getDocs(collection(db, 'TrainingPath'));
      trainingPaths.value = querySnapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      if (trainingPaths.value.length > 0) {
        selectedPath.value = trainingPaths.value[0];
      }
    };

    onMounted(() => {
      loadVision();
      loadTrainingPaths();
    });

    return { careerAsp, trainingPaths, selectedPath };
  }
};
</script>

<template>
  <div id="vision">
    <section class="vision-root">
      <!-- Learning Paths -->
      <div class="learning-section">
        <h1 class="title">Learning Paths</h1>

        <!-- Desktop -->
        <div class="learning-desktop desktop-only">
          <div class="sidebar">
            <button
              v-for="path in trainingPaths"
              :key="path.id"
              :class="{ active: selectedPath && selectedPath.id === path.id }"
              @click="selectedPath = path"
            >
              {{ path.LearningPath }}
            </button>
          </div>

          <div class="details-panel scrollable" v-if="selectedPath">
            <h3 class="details-heading">{{ selectedPath.LearningPath }}</h3>
            <p class="start-date">Started: {{ selectedPath.StartDate }}</p>
            <p class="description">{{ selectedPath.Description }}</p>
            <details class="certificates">
              <summary>Certificates</summary>
              <ul class="cert-list">
                <li v-for="cert in selectedPath.Certificates.split('~')" :key="cert">
                  {{ cert.trim() }}
                </li>
              </ul>
            </details>
          </div>
        </div>

        <!-- Mobile -->
        <div class="learning-mobile mobile-only">
          <select v-model="selectedPath" class="dropdown">
            <option v-for="path in trainingPaths" :key="path.id" :value="path">
              {{ path.LearningPath }}
            </option>
          </select>
          <div v-if="selectedPath" class="scroll-cell scrollable">
            <h3>{{ selectedPath.LearningPath }}</h3>
            <p>Started: {{ selectedPath.StartDate }}</p>
            <p class="description">{{ selectedPath.Description }}</p>
            <details>
              <summary>Certificates</summary>
              <ul>
                <li v-for="cert in selectedPath.Certificates.split('~')" :key="cert">
                  {{ cert.trim() }}
                </li>
              </ul>
            </details>
          </div>
        </div>
      </div>

      <!-- Career Aspirations -->
      <div class="career-section">
        <h2 class="career-title">Career Aspirations</h2>
        <div class="career-cards scrollable">
          <div class="card">
            <h3>1 Year</h3>
            <p class="career-text">{{ careerAsp.CareerAsp1 }}</p>
          </div>
          <div class="card">
            <h3>3 Years</h3>
            <p class="career-text">{{ careerAsp.CareerAsp2 }}</p>
          </div>
          <div class="card">
            <h3>Future</h3>
            <p class="career-text">{{ careerAsp.CareerAsp3 }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Outer container */
div#vision {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: #fff;
  color: #000;
  font-family: 'Inter', sans-serif;
}

section.vision-root {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  padding: 30px 50px 20px 50px;
  box-sizing: border-box;
}

/* Headings with orange accents */
h1.title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 20px;
  padding-left: 20px;
  color: black !important;
  border-left: 4px solid #ff4d00 !important;
}
h2.career-title {
  font-size: 24px;
  font-weight: 600;
  margin-top: 40px;
  padding-left: 20px;
  color: black !important;
  border-left: 4px solid #ff4d00 !important;
}

/* Learning Paths Desktop */
.learning-desktop {
  display: flex;
  gap: 20px;
  flex-grow: 1;
  height: 300px !important; /* fixed height for scroll */
}
.sidebar {
  width: 200px;
  border-right: 3px solid #ff4d00;
}
.sidebar button {
  display: block;
  width: 100%;
  background: transparent;
  border: none;
  padding: 8px 10px;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  color: #495057;
}
.sidebar button.active {
  color: #ff4d00 !important;
  background-color: rgba(255, 77, 0, 0.15) !important;
  font-weight: 600;
}
.details-panel {
  flex-grow: 1;
  padding: 10px;
  border-left: 1px solid #dddddd00;
}
.details-heading {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
}
.start-date {
  font-size: 12px;
  color: #777;
}
.description {
  font-size: 12px !important; /* smaller text */
  color: #333;
  line-height: 1.4;
}
.certificates summary {
  cursor: pointer;
  font-weight: 600;
  color: #ff4d00 !important;
}
.cert-list {
  list-style: none;
  padding-left: 0;
}
.cert-list li::before {
  content: '✔';
  color: #28a745;
  margin-right: 6px;
}

/* Career Aspirations */
.career-cards {
  display: flex;
  gap: 20px;
  margin-top: 20px;
  border-top: 1px solid #ff4d00 !important;
  border-bottom: 1px solid #ff4d00 !important;
  border-right: 1px solid #ff4d00 !important;
}
.card {
  flex: 1;
  border: 1px solid #dddddd00;
  border-left: 4px solid #ff4d00;
  padding: 15px;
  border-radius: 6px;
  background: #fff;
}
.card h3 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
}
.card p.career-text {
  font-size: 12px !important; /* smaller text */
  color: #333;
  line-height: 1.4;
}

/* Mobile */
.mobile-only {
  display: none;
}
.dropdown {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  margin-bottom: 10px;
}
.scroll-cell {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
}

/* Scrollable areas with orange scrollbars */
.scrollable {
  max-height: 100% !important;
  overflow-y: auto !important;
}
.scrollable::-webkit-scrollbar {
  width: 8px;
}
.scrollable::-webkit-scrollbar-thumb {
  background: #ff4d00;
  border-radius: 4px;
}
.scrollable::-webkit-scrollbar-track {
  background: #f1f1f1;
}
/* Firefox */
.scrollable {
  scrollbar-color: #ff4d00 #f1f1f1;
  scrollbar-width: thin;
}

/* Responsive */
@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }
  .mobile-only {
    display: block;
  }
  .career-cards {
    flex-direction: column;
  }
}
</style>
