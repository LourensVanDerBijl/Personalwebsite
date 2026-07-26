<script>
import { ref, onMounted } from 'vue';
import { db } from '../firebase/index.js';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

export default {
  name: 'ViewVisionAdmin',
  setup() {
    const trainingPaths = ref([]);
    const certOptions = ref([]);
    const message = ref('');
    const editingRowId = ref(null);

    // Career Aspirations
    const formCareerAsp1 = ref('');
    const formCareerAsp2 = ref('');
    const formCareerAsp3 = ref('');

    const loadTrainingPaths = async () => {
      const querySnapshot = await getDocs(collection(db, 'TrainingPath'));
      trainingPaths.value = querySnapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
    };

    const loadCertifications = async () => {
      const querySnapshot = await getDocs(collection(db, 'Certifications'));
      certOptions.value = querySnapshot.docs.map(d => ({
        id: d.id,
        courseName: d.data().courseName
      }));
    };

    const loadVision = async () => {
      const visionDoc = await getDocs(collection(db, 'views'));
      const visionSnap = visionDoc.docs.find(d => d.id === 'Vision');
      if (visionSnap) {
        const data = visionSnap.data();
        formCareerAsp1.value = data.CareerAsp1 || '';
        formCareerAsp2.value = data.CareerAsp2 || '';
        formCareerAsp3.value = data.CareerAsp3 || '';
      }
    };

    const updateDate = async () => {
      const today = new Date();
      const formattedDate = `${today.getFullYear()}/${String(today.getMonth()+1).padStart(2,'0')}/${String(today.getDate()).padStart(2,'0')}`;
      const updateRef = doc(db, 'UpdateDate', 'UpdateDate');
      await setDoc(updateRef, { Date: formattedDate });
    };

    const editPath = (path) => {
      editingRowId.value = path.id;
    };

    const savePath = async (path) => {
      try {
        const docRef = doc(db, 'TrainingPath', path.id || path.LearningPath);
        await setDoc(docRef, {
          LearningPath: path.LearningPath,
          StartDate: path.StartDate,
          Description: path.Description,
          Certificates: Array.isArray(path.Certificates) ? path.Certificates.join('~') : path.Certificates
        });
        await updateDate();
        message.value = '✅ Path saved successfully!';
        await loadTrainingPaths();
        editingRowId.value = null;
      } catch (err) {
        console.error("Error saving path:", err);
        message.value = '❌ Error saving path.';
      }
    };

    const deletePath = async (pathId) => {
      try {
        await deleteDoc(doc(db, 'TrainingPath', pathId));
        await updateDate();
        message.value = '✅ Path deleted.';
        await loadTrainingPaths();
      } catch (err) {
        console.error("Error deleting path:", err);
        message.value = '❌ Error deleting path.';
      }
    };

    const addNewRow = () => {
      const newRow = {
        id: `new-${Date.now()}`,
        LearningPath: '',
        StartDate: '',
        Description: '',
        Certificates: []
      };
      trainingPaths.value.push(newRow);
      editingRowId.value = newRow.id;
    };

    const saveCareerAsp = async () => {
      try {
        const docRef = doc(db, 'views', 'Vision');
        await setDoc(docRef, {
          CareerAsp1: formCareerAsp1.value,
          CareerAsp2: formCareerAsp2.value,
          CareerAsp3: formCareerAsp3.value
        });
        await updateDate();
        message.value = '✅ Career Aspirations updated!';
      } catch (err) {
        console.error("Error saving career aspirations:", err);
        message.value = '❌ Error saving career aspirations.';
      }
    };

    onMounted(() => {
      loadTrainingPaths();
      loadCertifications();
      loadVision();
    });

    return { trainingPaths, certOptions, message, editingRowId,
             formCareerAsp1, formCareerAsp2, formCareerAsp3,
             editPath, savePath, deletePath, addNewRow, saveCareerAsp };
  }
};
</script>

<template>
  <section class="vision-root">
    <h1 class="title">Vision (Admin)</h1>

    <!-- Learning Paths Table -->
    <div class="paths-table-wrapper">
      <table class="paths-table">
        <thead>
          <tr>
            <th>Learning Path</th>
            <th>Start Date</th>
            <th>Description</th>
            <th>Certificates</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="path in trainingPaths" :key="path.id">
            <td>
              <input v-if="editingRowId === path.id" v-model="path.LearningPath" />
              <span v-else>{{ path.LearningPath }}</span>
            </td>
            <td>
              <input v-if="editingRowId === path.id" type="date" v-model="path.StartDate" />
              <span v-else>{{ path.StartDate }}</span>
            </td>
            <td>
              <textarea v-if="editingRowId === path.id" v-model="path.Description"></textarea>
              <span v-else>{{ path.Description }}</span>
            </td>
            <td>
              <select v-if="editingRowId === path.id" v-model="path.Certificates" multiple>
                <option v-for="cert in certOptions" :key="cert.id" :value="cert.courseName">
                  {{ cert.courseName }}
                </option>
              </select>
              <span v-else>{{ path.Certificates }}</span>
            </td>
            <td>
              <button v-if="editingRowId === path.id" @click="savePath(path)" class="btn-save">Save</button>
              <button v-else @click="editPath(path)" class="edit-btn">Edit</button>
              <button @click="deletePath(path.id)" class="delete-btn">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <button @click="addNewRow" class="btn-add">+ Add New Path</button>
    </div>

    <!-- Career Aspirations -->
    <div class="career-panel">
      <h2>Career Aspirations</h2>
      <form @submit.prevent="saveCareerAsp">
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
</template>

<style scoped>
.vision-root {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #fff;
  color: #000;
  padding: 20px 30px;
}

.title {
  font-size: 32px;
  font-weight: 500;
  border-left: 4px solid #ff4d00;
  padding-left: 12px;
  margin-bottom: 16px;
}

/* Table */
.paths-table-wrapper {
  flex: 0 0 60%;
  overflow-y: auto;
}
.paths-table {
  width: 100%;
  border-collapse: collapse;
}
.paths-table th, .paths-table td {
  border: 1px solid #ddd;
  padding: 6px;              /* tighter padding */
  font-size: 0.75rem;        /* smaller text */
  vertical-align: top;
}
.paths-table th {
  background: #f9f9f9;
  text-align: left;
  font-size: 0.8rem;         /* slightly larger for headers */
}


/* Buttons */
.btn-save, .btn-add, .edit-btn, .delete-btn {
  font-size: 0.75rem;        /* smaller button text */
  padding: 6px 10px;         /* tighter buttons */
}
.edit-btn { background: #ff8c3c; color: #fff; border: none; }
.edit-btn:hover { background: #e67320; }
.delete-btn { background: transparent; color: #ff4d00; border: 1px solid #ff4d00; }
.delete-btn:hover { background: rgba(255,77,0,0.1); }
.btn-save {
  background: #ff4d00;
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}
.btn-save:hover {
  background: #e63c00;
}

.btn-add {
  background: #28a745;
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;
}
.btn-add:hover {
  background: #218838;
}

.status-message {
  margin-top: 12px;
  font-size: 0.9rem;
  color: #ff8c3c;
}

/* Career panel */
.career-panel {
  flex: 0 0 40%;
  background: rgba(0,0,0,0.05);
  padding: 16px;
  border-radius: 8px;
  overflow-y: auto;
}
.career-panel h2 {
  font-size: 1.2rem;
  color: #ff4d00;
  margin-bottom: 12px;
}
.career-panel label {
  display: block;
  margin-bottom: 8px;
  color: #000;
  font-size: 0.8rem;         /* smaller labels */
}
.career-panel textarea {
  width: 100%;
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #ff4d00;
  background: #fff;
  color: #000;
  margin-top: 4px;
  font-size: 0.8rem;         /* smaller text in textareas */
}
</style>