<script>
import { ref, onMounted } from 'vue';
import { db } from '../firebase/index.js';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

export default {
  name: 'ViewCertificationAdmin',
  setup() {
    const certifications = ref([]);
    const loading = ref(true);
    const selectedCert = ref(null);
    const message = ref('');

    // Form fields
    const formId = ref('');
    const formCourseName = ref('');
    const formPlatform = ref('');
    const formCompletedDate = ref('');
    const formType = ref('');
    const formUrl = ref('');

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

    const editCert = (cert) => {
      selectedCert.value = cert;
      formId.value = cert.id;
      formCourseName.value = cert.courseName;
      formPlatform.value = cert.platform;
      formCompletedDate.value = cert.completedDate;
      formType.value = cert.type;
      formUrl.value = cert.url;
    };

    const saveCert = async () => {
      try {
        const docRef = doc(db, 'Certifications', formId.value || formCourseName.value);
        await setDoc(docRef, {
          courseName: formCourseName.value,
          platform: formPlatform.value,
          completedDate: formCompletedDate.value,
          type: formType.value,
          url: formUrl.value
        });
        message.value = '✅ Certification saved successfully!';
        await loadCertifications();
        selectedCert.value = null;
      } catch (err) {
        console.error("Error saving certification:", err);
        message.value = '❌ Error saving certification.';
      }
    };

    const deleteCert = async (certId) => {
      try {
        await deleteDoc(doc(db, 'Certifications', certId));
        message.value = '✅ Certification deleted.';
        await loadCertifications();
        selectedCert.value = null;
      } catch (err) {
        console.error("Error deleting certification:", err);
        message.value = '❌ Error deleting certification.';
      }
    };

    onMounted(loadCertifications);

    return { certifications, loading, selectedCert, message,
             formId, formCourseName, formPlatform, formCompletedDate, formType, formUrl,
             editCert, saveCert, deleteCert };
  }
};
</script>

<template>
  <section class="certification-root">
    <div class="cert-content">
      <h1 class="title">CERTIFICATIONS (Admin)</h1>

      <div v-if="loading" class="loading">Loading certifications...</div>

      <div v-else class="cert-grid">
        <div
          v-for="cert in certifications"
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
            <div class="actions">
              <button class="edit-btn" @click="editCert(cert)">Edit</button>
              <button class="delete-btn" @click="deleteCert(cert.id)">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit/Add Form -->
      <div v-if="selectedCert || true" class="cert-form">
        <h2>{{ selectedCert ? 'Edit Certification' : 'Add Certification' }}</h2>
        <form @submit.prevent="saveCert">
          <label>Course Name:
            <input v-model="formCourseName" type="text" />
          </label>
          <label>Platform:
            <input v-model="formPlatform" type="text" />
          </label>
          <label>Completed Date:
            <input v-model="formCompletedDate" type="date" />
          </label>
          <label>Category:
            <input v-model="formType" type="text" />
          </label>
          <label>Image URL:
            <input v-model="formUrl" type="text" />
          </label>
          <button type="submit" class="btn-save">Save</button>
        </form>
        <p v-if="message" class="status-message">{{ message }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.certification-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-color: #0a0b0d;
  color: #fff;
  padding: 40px 60px;
  box-sizing: border-box;
}

.cert-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

h1.title {
  color: #fff;
  font-size: 45px;
  font-weight: 500;
  border-left: 4px solid #ff4d00;
  padding-left: 20px;
  margin-bottom: 24px;
  margin-top: 0;
}

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
}
.actions {
  display: flex;
  gap: 10px;
}
.edit-btn, .delete-btn {
  padding: 6px 14px;
  font-size: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}
.edit-btn {
  background-color: #ff8c3c;
  color: #fff;
  border: none;
}
.edit-btn:hover { background-color: #e67320; }
.delete-btn {
  background: transparent;
  color: #ff4d00;
  border: 1px solid #ff4d00;
}
.delete-btn:hover { background: rgba(255,77,0,0.1); }

.cert-form {
  margin-top: 40px;
  background: rgba(255,255,255,0.05);
  padding: 20px;
  border-radius: 8px;
}
.cert-form label {
  display: block;
  margin-bottom: 10px;
  color: #ccc;
}
.cert-form input {
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
.btn-save:hover { background: #e63c00; }

.status-message {
  margin-top: 12px;
  font-size: 0.9rem;
  color: #ff8c3c;
}
</style>
