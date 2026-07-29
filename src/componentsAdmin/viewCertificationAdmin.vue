<script>
import { ref, onMounted } from 'vue';
import { db } from '../firebase/index.js';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

export default {
  name: 'ViewCertificationAdmin',
  setup() {
    const certifications = ref([]);
    const loading = ref(true);
    const message = ref('');
    const uploading = ref(false);

    // Form fields for new certification
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
      formData.append('key', import.meta.env.VITE_IMGBB_API_KEY);

      try {
        const res = await fetch('https://api.imgbb.com/1/upload', {
          method: 'POST',
          body: formData
        });
        const json = await res.json();
        if (json.success) {
          formUrl.value = json.data.url;
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
        const docRef = doc(db, 'Certifications', formCourseName.value);
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
        // reset form
        formCourseName.value = '';
        formPlatform.value = '';
        formCompletedDate.value = '';
        formType.value = '';
        formUrl.value = '';
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
      } catch (err) {
        console.error("Error deleting certification:", err);
        message.value = '❌ Error deleting certification.';
      }
    };

    onMounted(loadCertifications);

    return { certifications, loading, message, uploading,
             formCourseName, formPlatform, formCompletedDate, formType, formUrl,
             saveCert, deleteCert, uploadToImgBB };
  }
};
</script>

<template>
  <section class="certification-root">
    <h2 class="cert-heading">Certifications – Admin</h2>

    <!-- Table/List View -->
    <div class="cert-table-wrapper">
      <table class="cert-table">
        <thead>
          <tr>
            <th>Delete</th>
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
              <button class="delete-btn" @click="deleteCert(cert.id)">Delete</button>
            </td>
            <td>{{ cert.courseName }}</td>
            <td>{{ cert.platform }}</td>
            <td>{{ cert.completedDate }}</td>
            <td>{{ cert.type }}</td>
            <td>{{ cert.url }}</td>
          </tr>

          <!-- Add New Row -->
          <tr class="add-row">
            <td colspan="6">
              <form @submit.prevent="saveCert" class="add-form">
                <input v-model="formCourseName" type="text" placeholder="Course Name" required />
                <input v-model="formPlatform" type="text" placeholder="Platform" required />
                <input v-model="formCompletedDate" type="date" required />
                <select v-model="formType" required>
                  <option disabled value="">Select Category</option>
                  <option value="Development">Development</option>
                  <option value="Leadership">Leadership</option>
                  <option value="Technology">Technology</option>
                  <option value="Productivity">Productivity</option>
                </select>
                <input type="file" @change="uploadToImgBB($event.target.files[0])" />
                <p v-if="uploading">Uploading...</p>
                <p v-if="formUrl">Image URL: {{ formUrl }}</p>
                <button type="submit" class="btn-save">Add Certification</button>
              </form>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-if="message" class="status-message">{{ message }}</p>
  </section>
</template>
<style scoped>
.certification-root {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background: #fff;
  color: #000;
  padding: 15px 20px; /* reduced padding */
  box-sizing: border-box;
}

.cert-heading {
  font-size: 1rem; /* smaller heading */
  font-weight: 600;
  margin-bottom: 8px;
  border-left: 3px solid #ff4d00;
  padding-left: 8px;
  color: #000;
}

/* Table wrapper */
.cert-table-wrapper {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 12px;
}

/* Table */
.cert-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.7rem; /* smaller text */
}
.cert-table th, .cert-table td {
  border: 1px solid #ddd;
  padding: 4px 6px; /* tighter padding */
}
.cert-table th {
  background: #f9f9f9;
  text-align: left;
  font-weight: 600;
}

/* Delete button */
.delete-btn {
  background: transparent;
  color: #ff4d00;
  border: 1px solid #ff4d00;
  padding: 3px 8px; /* smaller button */
  font-size: 0.65rem;
  border-radius: 3px;
  cursor: pointer;
  font-weight: 600;
}
.delete-btn:hover {
  background: rgba(255,77,0,0.1);
}

/* Add new row */
.add-row td {
  background: #fafafa;
  padding: 8px;
}
.add-form {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px; /* tighter gap */
  align-items: center;
}
.add-form input,
.add-form select {
  padding: 5px;
  font-size: 0.65rem; /* smaller input text */
  border-radius: 3px;
  border: 1px solid #ff4d00;
  background: #fff;
  color: #000;
}
.add-form p {
  grid-column: span 6;
  font-size: 0.65rem;
  margin: 2px 0;
  color: #666;
}

/* Save button */
.btn-save {
  background: #ff4d00;
  color: #fff;
  border: none;
  padding: 5px 10px;
  font-size: 0.65rem;
  border-radius: 3px;
  cursor: pointer;
  font-weight: 600;
  grid-column: span 6;
  justify-self: start;
}
.btn-save:hover {
  background: #e63c00;
}

/* Status message */
.status-message {
  margin-top: 6px;
  font-size: 0.7rem;
  color: #ff8c3c;
}

/* Responsive */
@media (max-width: 768px) {
  .certification-root {
    padding: 10px;
  }
  .cert-table {
    font-size: 0.65rem;
  }
  .add-form {
    grid-template-columns: 1fr;
  }
  .btn-save {
    grid-column: span 1;
    width: 100%;
  }
}
</style>
