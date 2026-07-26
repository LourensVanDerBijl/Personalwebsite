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
    const uploading = ref(false);

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
        certifications.value.sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate));
      } catch (err) {
        console.error("Error loading certifications:", err);
      } finally {
        loading.value = false;
      }
    };

    const editCert = (cert) => {
      if (!cert) {
        // New entry
        selectedCert.value = null;
        formId.value = '';
        formCourseName.value = '';
        formPlatform.value = '';
        formCompletedDate.value = '';
        formType.value = '';
        formUrl.value = '';
        return;
      }
      selectedCert.value = cert;
      formId.value = cert.id;
      formCourseName.value = cert.courseName;
      formPlatform.value = cert.platform;
      formCompletedDate.value = cert.completedDate;
      formType.value = cert.type;
      formUrl.value = cert.url;
    };

    const updateDate = async () => {
      const today = new Date();
      const formattedDate = `${today.getFullYear()}/${String(today.getMonth()+1).padStart(2,'0')}/${String(today.getDate()).padStart(2,'0')}`;
      const updateRef = doc(db, 'UpdateDate', 'UpdateDate');
      await setDoc(updateRef, { Date: formattedDate });
    };

    const uploadToImgBB = async (file) => {
      uploading.value = true;
      const formData = new FormData();
      formData.append('image', file);
      formData.append('key', '3349c3dc30a2389651ec2ff95ae722d6'); // replace with your key

      try {
        const res = await fetch('https://api.imgbb.com/1/upload', {
          method: 'POST',
          body: formData
        });
        const json = await res.json();
        if (json.success) {
          formUrl.value = json.data.url; // only direct URL
          message.value = '✅ Image uploaded successfully!';
        } else {
          message.value = '❌ Upload failed.';
        }
      } catch (err) {
        console.error(err);
        message.value = '❌ Error uploading image.';
      } finally {
        uploading.value = false;
      }
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
        await updateDate();
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
        await updateDate();
        message.value = '✅ Certification deleted.';
        await loadCertifications();
        selectedCert.value = null;
      } catch (err) {
        console.error("Error deleting certification:", err);
        message.value = '❌ Error deleting certification.';
      }
    };

    onMounted(loadCertifications);

    return { certifications, loading, selectedCert, message, uploading,
             formId, formCourseName, formPlatform, formCompletedDate, formType, formUrl,
             editCert, saveCert, deleteCert, uploadToImgBB };
  }
};
</script>

<template>
  <section class="certification-root">
    <h2 class="cert-heading">Certifications – Admin Edit</h2>

    <!-- Table Panel -->
    <div class="cert-table-wrapper">
      <table class="cert-table">
        <thead>
          <tr>
            <th>Actions</th>
            <th>Course Name</th>
            <th>Platform</th>
            <th>Completed Date</th>
            <th>Category</th>
            <th>Image URL</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cert in certifications" :key="cert.id">
            <td>
              <button class="edit-btn" @click="editCert(cert)">Edit</button>
              <button class="delete-btn" @click="deleteCert(cert.id)">Delete</button>
            </td>
            <td>{{ cert.courseName }}</td>
            <td>{{ cert.platform }}</td>
            <td>{{ cert.completedDate }}</td>
            <td>{{ cert.type }}</td>
            <td>{{ cert.url }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Form Panel -->
    <div class="cert-form">
      <h3>{{ selectedCert ? 'Edit Certification' : 'Add Certification' }}</h3>
      <form @submit.prevent="saveCert" class="form-grid">
        <label class="full-width">Course Name:
          <input v-model="formCourseName" type="text" />
        </label>

        <label>Platform:
          <input v-model="formPlatform" type="text" />
        </label>

        <label>Completed Date:
          <input v-model="formCompletedDate" type="date" />
        </label>

        <label>Category:
          <select v-model="formType">
            <option value="Development">Development</option>
            <option value="Leadership">Leadership</option>
            <option value="Technology">Technology</option>
            <option value="Productivity">Productivity</option>
          </select>
        </label>

        <label>Certificate Image:
          <input type="file" @change="uploadToImgBB($event.target.files[0])" />
        </label>

        <p v-if="uploading">Uploading...</p>
        <p v-if="formUrl">Image URL: {{ formUrl }}</p>

        <div class="full-width">
          <button type="submit" class="btn-save">Save</button>
          <button type="button" class="btn-delete" v-if="selectedCert" @click="deleteCert(selectedCert.id)">Delete</button>
        </div>
      </form>
      <p v-if="message" class="status-message">{{ message }}</p>
    </div>
  </section>
</template>

<style scoped>
.certification-root {
  display: flex;
  flex-direction: column;
  height: 100vh; /* one full screen */
  width: 100%;
  background: #fff;
  color: #000;
  padding: 20px 30px;
  box-sizing: border-box;
}

.cert-heading {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 12px;
  border-left: 4px solid #ff4d00;
  padding-left: 12px;
}

/* Table panel */
.cert-table-wrapper {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 16px;
}
.cert-table {
  width: 100%;
  border-collapse: collapse;
}
.cert-table th, .cert-table td {
  border: 1px solid #ddd;
  padding: 8px;
  font-size: 0.9rem;
}
.cert-table th {
  background: #f9f9f9;
  text-align: left;
}

/* Buttons */
.edit-btn, .delete-btn {
  padding: 6px 12px;
  font-size: 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}
.edit-btn {
  background: #ff8c3c;
  color: #fff;
  border: none;
}
.edit-btn:hover {
  background: #e67320;
}

.delete-btn {
  background: transparent;
  color: #ff4d00;
  border: 1px solid #ff4d00;
}
.delete-btn:hover {
  background: rgba(255,77,0,0.1);
}

/* Form panel */
.cert-form {
  flex-shrink: 0;
  max-height: 280px;       /* compact form */
  overflow-y: auto;        /* scroll inside form */
  background: rgba(0,0,0,0.05);
  padding: 16px;
  border-radius: 8px;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.form-grid label {
  display: flex;
  flex-direction: column;
  color: #000;
}
.form-grid .full-width {
  grid-column: span 2;
}

.cert-form input,
.cert-form select {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ff4d00;
  background: #fff;
  color: #000;
  margin-top: 4px;
}

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

.btn-delete {
  background: transparent;
  color: #ff4d00;
  border: 1px solid #ff4d00;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  margin-left: 10px;
}
.btn-delete:hover {
  background: rgba(255,77,0,0.1);
}

.status-message {
  margin-top: 8px;
  font-size: 0.9rem;
  color: #ff8c3c;
}
</style>