<script>
import { ref, onMounted } from 'vue';
import { db } from '../firebase/index.js';
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

export default {
  name: 'ViewVisionAdmin',
  setup() {
    const careerAsp = ref({});
    const trainingPaths = ref([]);
    const selectedPath = ref(null);
    const message = ref('');

    // Form fields for Learning Path
    const formId = ref('');
    const formLearningPath = ref('');
    const formStartDate = ref('');
    const formDescription = ref('');
    const formCertificates = ref('');

    // Form fields for Career Aspirations
    const formCareerAsp1 = ref('');
    const formCareerAsp2 = ref('');
    const formCareerAsp3 = ref('');

    const loadVision = async () => {
      const visionDoc = await getDoc(doc(db, 'views', 'Vision'));
      if (visionDoc.exists()) {
        careerAsp.value = visionDoc.data();
        formCareerAsp1.value = careerAsp.value.CareerAsp1 || '';
        formCareerAsp2.value = careerAsp.value.CareerAsp2 || '';
        formCareerAsp3.value = careerAsp.value.CareerAsp3 || '';
      }
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

    const editPath = (path) => {
      selectedPath.value = path;
      formId.value = path.id;
      formLearningPath.value = path.LearningPath;
      formStartDate.value = path.StartDate;
      formDescription.value = path.Description;
      formCertificates.value = path.Certificates;
    };

    const savePath = async () => {
      try {
        const docRef = doc(db, 'TrainingPath', formId.value || formLearningPath.value);
        await setDoc(docRef, {
          LearningPath: formLearningPath.value,
          StartDate: formStartDate.value,
          Description: formDescription.value,
          Certificates: formCertificates.value
        });
        message.value = '✅ Learning Path saved successfully!';
        await loadTrainingPaths();
        selectedPath.value = null;
      } catch (err) {
        console.error("Error saving path:", err);
        message.value = '❌ Error saving path.';
      }
    };

    const deletePath = async (pathId) => {
      try {
        await deleteDoc(doc(db, 'TrainingPath', pathId));
        message.value = '✅ Learning Path deleted.';
        await loadTrainingPaths();
        selectedPath.value = null;
      } catch (err) {
        console.error("Error deleting path:", err);
        message.value = '❌ Error deleting path.';
      }
    };

    const saveCareerAsp = async () => {
      try {
        await setDoc(doc(db, 'views', 'Vision'), {
          CareerAsp1: formCareerAsp1.value,
          CareerAsp2: formCareerAsp2.value,
          CareerAsp3: formCareerAsp3.value
        });
        message.value = '✅ Career Aspirations updated!';
        await loadVision();
      } catch (err) {
        console.error("Error saving career aspirations:", err);
        message.value = '❌ Error saving career aspirations.';
      }
    };

    onMounted(() => {
      loadVision();
      loadTrainingPaths();
    });

    return { careerAsp, trainingPaths, selectedPath, message,
             formId, formLearningPath, formStartDate, formDescription, formCertificates,
             formCareerAsp1, formCareerAsp2, formCareerAsp3,
             editPath, savePath, deletePath, saveCareerAsp };
  }
};
</script>

<template>
  <div id="vision">
    <section class="vision-root">
      <!-- Learning Paths -->
      <div class="learning-section">
        <h1 class="title">Learning Paths (Admin)</h1>

        <div class="learning-desktop">
          <div class="sidebar">
            <button
              v-for="path in trainingPaths"
              :key="path.id"
              :class="{ active: selectedPath && selectedPath.id === path.id }"
              @click="editPath(path)"
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

        <!-- Add/Edit Form -->
        <div class="path-form">
          <h2>{{ formId ? 'Edit Path' : 'Add Path' }}</h2>
          <form @submit.prevent="savePath">
            <label>Learning Path:
              <input v-model="formLearningPath" type="text" />
            </label>
            <label>Start Date:
              <input v-model="formStartDate" type="text" />
            </label>
            <label>Description:
              <textarea v-model="formDescription"></textarea>
            </label>
            <label>Certificates (separate with ~):
              <textarea v-model="formCertificates"></textarea>
            </label>
            <button type="submit" class="btn-save">Save</button>
            <button type="button" class="btn-delete" v-if="selectedPath" @click="deletePath(selectedPath.id)">Delete</button>
          </form>
        </div>
      </div>

      <!-- Career Aspirations -->
      <div class="career-section">
        <h2 class="career-title">Career Aspirations (Admin)</h2>
        <form @submit.prevent="saveCareerAsp" class="career-form">
          <label>1 Year:
            <textarea v-model="formCareerAsp1"></textarea>
          </label>
          <label>3 Years:
            <textarea v-model="formCareerAsp2"></textarea>
          </label>
          <label>Future:
            <textarea v-model="formCareerAsp3"></textarea>
          </label>
          <button type="submit" class="btn-save">Save Aspirations</button>
        </form>
      </div>

      <p v-if="message" class="status-message">{{ message }}</p>
    </section>
  </div>
</template>

<style scoped>
div#vision {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: #0a0b0d;
  color: #fff;
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

h1.title, h2.career-title {
  font-weight: 600;
  margin-bottom: 20px;
  padding-left: 20px;
  border-left: 4px solid #ff4d00;
  color: #fff;
}

.learning-desktop {
  display: flex;
  gap: 20px;
  flex-grow: 1;
  height: 300px;
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
  color: #ccc;
}
.sidebar button.active {
  color: #ff4d00;
  background-color: rgba(255, 77, 0, 0.15);
  font-weight: 600;
}
.details-panel {
  flex-grow: 1;
  padding: 10px;
}
.details-heading {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
}
.start-date {
  font-size: 12px;
  color: #aaa;
}
.description {
  font-size: 12px;
  color: #ccc;
  line-height: 1.4;
}
.certificates summary {
  cursor: pointer;
  font-weight: 600;
  color: #ff4d00;
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

.path-form, .career-form {
  margin-top: 20px;
  background: rgba(255,255,255,0.05);
  padding: 20px;
  border-radius: 8px;
  width: 100%;
}

.path-form h2, .career-form h2 {
  margin-bottom: 16px;
  font-size: 1.2rem;
  color: #ff4d00;
}

.path-form label, .career-form label {
  display: block;
  margin-bottom: 10px;
  color: #ccc;
}

.path-form input,
.path-form textarea,
.career-form textarea {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ff4d00;
  background: #0a0b0d;
  color: #fff;
  margin-top: 4px;
}

.btn-save {
  background: #ff4d00;
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;
}
.btn-save:hover {
  background: #e63c00;
}

.btn-delete {
  background: transparent;
  color: #ff4d00;
  border: 1px solid #ff4d00;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;
  margin-left: 10px;
}
.btn-delete:hover {
  background: rgba(255,77,0,0.1);
}

.status-message {
  margin-top: 12px;
  font-size: 0.9rem;
  color: #ff8c3c;
}
</style>