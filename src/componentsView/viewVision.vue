<script>
import { ref, onMounted } from 'vue';
import { db } from '../firebase/index.js';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

export default {
  name: 'ViewVision',
  setup() {
    const careerAsp = ref({});
    const trainingPaths = ref([]);
    const mainTab = ref('LearningPaths'); // 'LearningPaths' or 'CareerAsp'
    const subTab = ref(null); // selected subnav

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
        subTab.value = trainingPaths.value[0].id; // default first path
      }
    };

    onMounted(() => {
      loadVision();
      loadTrainingPaths();
    });

    return { careerAsp, trainingPaths, mainTab, subTab };
  }
};
</script>

<template>
  <div id="vision">
    <section class="vision-root">
      <!-- Top Nav -->
      <nav class="top-nav">
        <button :class="{active: mainTab==='LearningPaths'}"
                @click="mainTab='LearningPaths'; subTab=trainingPaths.length?trainingPaths[0].id:null">
          Learning Paths
        </button>
        <button :class="{active: mainTab==='CareerAsp'}"
                @click="mainTab='CareerAsp'; subTab='1year'">
          Career Aspirations
        </button>
      </nav>

      <!-- Sub Nav -->
      <nav class="sub-nav" v-if="mainTab==='LearningPaths'">
        <button v-for="path in trainingPaths" :key="path.id"
                :class="{active: subTab===path.id}"
                @click="subTab=path.id">
          {{ path.LearningPath }}
        </button>
      </nav>
      <nav class="sub-nav" v-else>
        <button :class="{active: subTab==='1year'}" @click="subTab='1year'">1 Year</button>
        <button :class="{active: subTab==='3years'}" @click="subTab='3years'">3 Years</button>
        <button :class="{active: subTab==='future'}" @click="subTab='future'">Future</button>
      </nav>

      <!-- Content Panel -->
      <div class="content-panel scrollable">
        <!-- Learning Paths -->
        <div v-if="mainTab==='LearningPaths'">
          <template v-for="path in trainingPaths" :key="path.id">
            <div v-if="subTab===path.id">
              <h3 class="details-heading">{{ path.LearningPath }}</h3>
              <p class="start-date">Started: {{ path.StartDate }}</p>
              <p class="description">{{ path.Description }}</p>
              <h4 class="cert-heading">Certificates</h4>
              <ul class="cert-list">
                <li v-for="cert in path.Certificates.split('~')" :key="cert">{{ cert.trim() }}</li>
              </ul>
            </div>
          </template>
        </div>

        <!-- Career Aspirations -->
        <div v-else>
          <div v-if="subTab==='1year'">
            <h3>1 Year</h3>
            <p class="career-text">{{ careerAsp.CareerAsp1 }}</p>
          </div>
          <div v-if="subTab==='3years'">
            <h3>3 Years</h3>
            <p class="career-text">{{ careerAsp.CareerAsp2 }}</p>
          </div>
          <div v-if="subTab==='future'">
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

/* Main container with gradient + card look */
section.vision-root {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  background: linear-gradient(to bottom, #FF4D00 0%, #FFFFFF 100%);
  border-radius: 16px;
  overflow: hidden;
  padding: 0;
  box-sizing: border-box;
}

/* Top Nav – 3D capsule buttons */
.top-nav {
  display: flex;
  gap: 12px;
  padding: 16px 24px;
  justify-content: center;
  border-bottom: none;
}
.top-nav button {
  height: 38px;
  padding: 0 24px;
  border-radius: 19px;
  border: none;
  background: linear-gradient(to bottom, #ffffff 0%, #f0f0f0 50%, #e0e0e0 51%, #ffffff 100%);
  color: #000;
  font-weight: 800;
  text-transform: uppercase;
  font-size: 13px;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 
    inset 0 2px 3px rgba(255,255,255,0.7), 
    inset 0 -2px 3px rgba(0,0,0,0.1),
    0 4px 8px rgba(0,0,0,0.15);
  cursor: pointer;
  transition: all 0.2s ease;
}
.top-nav button.active {
  background: linear-gradient(to bottom, #ff4d00 0%, #ff6a33 100%);
  color: #fff;
  box-shadow: 
    inset 0 2px 3px rgba(255,255,255,0.4), 
    inset 0 -2px 3px rgba(0,0,0,0.2),
    0 4px 10px rgba(0,0,0,0.25);
}

/* Sub Nav – horizontal scroll, pill buttons */
.sub-nav {
  display: flex !important;
  flex-wrap: nowrap !important;
  overflow-x: auto !important;
  -webkit-overflow-scrolling: touch;
  gap: 12px;
  padding: 8px 40px 16px 40px;
  border-bottom: none;
}
.sub-nav::-webkit-scrollbar {
  height: 6px;
}
.sub-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 77, 0, 0.6);
  border-radius: 3px;
}
.sub-nav::-webkit-scrollbar-track {
  background: transparent;
}
.sub-nav {
  scrollbar-color: rgba(255,77,0,0.6) transparent;
  scrollbar-width: thin;
}
.sub-nav button {
  flex-shrink: 0 !important;
  white-space: nowrap !important;
  background-color: #ffffff !important;
  border-radius: 20px !important;
  border: 1px solid #ccc;
  color: #555;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.sub-nav button:hover {
  color: #ff4d00;
}
.sub-nav button.active {
  background: #ff4d00 !important;
  color: #fff !important;
  border-color: #ff4d00 !important;
}

/* Content Panel */
.content-panel {
  flex: 1;
  background: #fafafa;
  padding: 20px;
  border-radius: 0 0 16px 16px;
  border-top: none;
}
.details-heading {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 6px;
}
.start-date {
  font-size: 0.75rem;
  color: #777;
}
.description {
  font-size: 0.8rem;
  color: #333;
  line-height: 1.4;
}

/* Certificates Heading */
.cert-heading {
  border: 2px solid #FF5F1F;
  padding: 10px;
  border-radius: 4px;
  display: inline-block;
  color: #FF5F1F;
  margin-top: 30px;
  font-size: 0.9rem;
  font-weight: 600;
}

/* Certificates List */
.cert-heading + ul {
  list-style-type: none;
  padding-left: 0;
  margin-top: 15px;
}

/* Individual Certificate Items */
.cert-heading + ul li {
  font-size: 1.1rem;
  font-style: italic;
  width: 60%;
  margin-bottom: 12px;
  padding-bottom: 8px;
  background-image: linear-gradient(to right, #FF5F1F 0%, #FF5F1F 20%, rgba(255, 95, 31, 0) 80%);
  background-size: 100% 2px;
  background-repeat: no-repeat;
  background-position: left bottom;
}

/* Remove old checkmarks */
.cert-heading + ul li::before {
  content: none !important;
  display: none !important;
}

/* Career text */
.career-text {
  font-size: 0.8rem;
  color: #333;
  line-height: 1.4;
}

/* Scrollable areas */
.scrollable {
  overflow-y: auto;
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
.scrollable {
  scrollbar-color: #ff4d00 #f1f1f1;
  scrollbar-width: thin;
}
</style>
