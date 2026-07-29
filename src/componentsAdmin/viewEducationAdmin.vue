<script>
import { ref, onMounted } from 'vue';
import { db } from '../firebase/index.js';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

export default {
  name: 'ViewEducationAdmin',
  setup() {
    const educationItems = ref([]);
    const selectedItem = ref(null);
    const message = ref('');
    const uploading = ref(false);

    // Form fields
    const formId = ref('');
    const formName = ref('');
    const formSchool = ref('');
    const formGrade = ref('');
    const formStartDate = ref('');
    const formEndDate = ref('');
    const formDescription = ref('');
    const formUrl = ref('');

    const loadEducation = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'education'));
        let items = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          items.push({
            id: docSnap.id,
            name: data.name || '',
            school: data.School || '',
            grade: data.nqfLevel ? `NQF ${data.nqfLevel}` : '',
            startDate: data.startDate || '',
            endDate: data.endDate || '',
            description: data.description || '',
            url: data.url || ''
          });
        });
        educationItems.value = items;
      } catch (error) {
        console.error('Error loading education history:', error);
      }
    };

    const editItem = (item) => {
      if (!item) {
        selectedItem.value = null;
        formId.value = '';
        formName.value = '';
        formSchool.value = '';
        formGrade.value = '';
        formStartDate.value = '';
        formEndDate.value = '';
        formDescription.value = '';
        formUrl.value = '';
        return;
      }
      selectedItem.value = item;
      formId.value = item.id;
      formName.value = item.name;
      formSchool.value = item.school;
      formGrade.value = item.grade;
      formStartDate.value = item.startDate;
      formEndDate.value = item.endDate;
      formDescription.value = item.description;
      formUrl.value = item.url;
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

    const saveItem = async () => {
      try {
        const docRef = doc(db, 'education', formId.value || formName.value);
        await setDoc(docRef, {
          name: formName.value,
          School: formSchool.value,
          nqfLevel: formGrade.value.replace('NQF ', ''),
          startDate: formStartDate.value,
          endDate: formEndDate.value,
          description: formDescription.value,
          url: formUrl.value
        });
        await updateDate();
        message.value = '✅ Education entry saved successfully!';
        await loadEducation();
        selectedItem.value = null;
      } catch (error) {
        console.error('Error saving education entry:', error);
        message.value = '❌ Error saving education entry.';
      }
    };

    const deleteItem = async (itemId) => {
      try {
        await deleteDoc(doc(db, 'education', itemId));
        await updateDate();
        message.value = '✅ Education entry deleted.';
        await loadEducation();
        selectedItem.value = null;
      } catch (error) {
        console.error('Error deleting education entry:', error);
        message.value = '❌ Error deleting education entry.';
      }
    };

    onMounted(loadEducation);

    return { educationItems, selectedItem, message, uploading,
             formId, formName, formSchool, formGrade, formStartDate, formEndDate, formDescription, formUrl,
             editItem, saveItem, deleteItem, uploadToImgBB };
  }
};
</script>

<template>
  <section class="education-root scrollable">
    <h2 class="education-heading">Education – Admin Edit</h2>

    <!-- Dropdown Selector -->
    <div class="education-selector">
      <label>Select Entry:</label>
      <select @change="editItem($event.target.value ? educationItems.find(e => e.id === $event.target.value) : null)">
        <option disabled selected value="">-- Choose an entry --</option>
        <option v-for="item in educationItems" :key="item.id" :value="item.id">
          {{ item.name }} ({{ item.school }})
        </option>
        <option value="">+ New Entry</option>
      </select>
    </div>

    <!-- Edit/Add Form -->
    <div class="education-form">
      <h3>{{ selectedItem ? 'Edit Education Entry' : 'Add Education Entry' }}</h3>
      <form @submit.prevent="saveItem">
        <!-- Row 1 -->
        <div class="form-row">
          <label>Qualification:
            <input v-model="formName" type="text" />
          </label>
          <label>Institution:
            <input v-model="formSchool" type="text" />
          </label>
        </div>

        <!-- Row 2 -->
        <div class="form-row">
          <label>Start Date:
            <input v-model="formStartDate" type="text" />
          </label>
          <label>End Date:
            <input v-model="formEndDate" type="text" />
          </label>
        </div>

        <!-- Row 3 -->
        <div class="form-row">
          <label>NQF Grade:
            <input v-model="formGrade" type="text" />
          </label>
          <label>Certificate File:
            <input type="file" @change="uploadToImgBB($event.target.files[0])" />
          </label>
        </div>

        <!-- Full-width description -->
        <label>Description:
          <textarea v-model="formDescription"></textarea>
        </label>

        <p v-if="uploading">Uploading...</p>
        <p v-if="formUrl">Image URL: {{ formUrl }}</p>

        <div class="form-actions">
          <button type="submit" class="btn-save">Save Entry</button>
          <button type="button" class="btn-delete" v-if="selectedItem" @click="deleteItem(selectedItem.id)">Delete Entry</button>
        </div>
      </form>
      <p v-if="message" class="status-message">{{ message }}</p>
    </div>
  </section>
</template>
<style scoped>
.education-root {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background: #0a0b0d;
  color: #fff;
  padding: 20px 30px; /* reduced padding */
  box-sizing: border-box;
}

.education-heading {
  font-size: 1.2rem; /* smaller heading */
  font-weight: 600;
  margin-bottom: 16px;
  border-left: 3px solid #ff4d00;
  padding-left: 10px;
  color: #fff;
}

.education-selector {
  margin-bottom: 16px;
}
.education-selector label {
  margin-right: 8px;
  font-weight: 500;
  font-size: 0.8rem; /* smaller label text */
}
.education-selector select {
  padding: 6px; /* tighter padding */
  border-radius: 4px;
  border: 1px solid #ff4d00;
  background: #0a0b0d;
  color: #fff;
  font-size: 0.8rem; /* smaller text */
}

.education-form {
  background: rgba(255,255,255,0.05);
  padding: 16px; /* reduced padding */
  border-radius: 6px;
  width: 90%;
}
.education-form h3 {
  margin-bottom: 12px;
  font-size: 1rem; /* smaller subheading */
  font-weight: 600;
  color: #ff4d00;
}
.education-form label {
  display: block;
  margin-bottom: 8px;
  color: #fff;
  font-size: 0.8rem; /* smaller label text */
}
.education-form input,
.education-form textarea {
  width: 100%;
  padding: 6px; /* tighter padding */
  border-radius: 4px;
  border: 1px solid #ff4d00;
  background: #0a0b0d;
  color: #fff;
  margin-top: 3px;
  font-size: 0.8rem; /* smaller text */
}
.education-form textarea {
  min-height: 80px; /* shorter textarea */
}

/* Two-column rows */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px; /* reduced gap */
  margin-bottom: 10px;
}
.form-row label {
  margin-bottom: 0;
}

/* Actions */
.form-actions {
  margin-top: 12px;
  display: flex;
  gap: 10px;
}
.btn-save,
.btn-delete {
  font-size: 0.8rem; /* smaller button text */
  padding: 6px 12px; /* tighter buttons */
  border-radius: 4px;
  cursor: pointer;
}
.btn-save {
  background: #ff4d00;
  color: #fff;
  border: none;
}
.btn-save:hover {
  background: #e63c00;
}
.btn-delete {
  background: transparent;
  color: #ff4d00;
  border: 1px solid #ff4d00;
}
.btn-delete:hover {
  background: rgba(255,77,0,0.1);
}

/* Status message */
.status-message {
  margin-top: 10px;
  font-size: 0.8rem; /* smaller status text */
  color: #ff8c3c;
}

/* Responsive */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
