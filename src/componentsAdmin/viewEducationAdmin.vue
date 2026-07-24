<script>
import { ref, onMounted } from 'vue';
import { db } from '../firebase/index.js';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import viewEducationImage from '../assets/images/viewEducation.png';

export default {
  name: 'ViewEducationAdmin',
  setup() {
    const educationItems = ref([]);
    const selectedItem = ref(null);
    const message = ref('');

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

        items.sort((a, b) => {
          if (a.endDate === 'current') return -1;
          if (b.endDate === 'current') return 1;
          return parseInt(b.endDate) - parseInt(a.endDate);
        });

        educationItems.value = items;
      } catch (error) {
        console.error('Error loading education history:', error);
      }
    };

    const editItem = (item) => {
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
        message.value = '✅ Education entry deleted.';
        await loadEducation();
        selectedItem.value = null;
      } catch (error) {
        console.error('Error deleting education entry:', error);
        message.value = '❌ Error deleting education entry.';
      }
    };

    onMounted(loadEducation);

    return { educationItems, selectedItem, message,
             formId, formName, formSchool, formGrade, formStartDate, formEndDate, formDescription, formUrl,
             editItem, saveItem, deleteItem, viewEducationImage };
  }
};
</script>

<template>
  <div id="education">
    <section class="education-root">
      <div class="education-text-column">
        <h1 class="education-heading">EDUCATION (Admin)</h1>

        <!-- Education Items -->
        <div class="education-content-wrapper">
          <div class="education-content">
            <div
              v-for="item in educationItems"
              :key="item.id"
              class="education-item"
              @click="editItem(item)"
            >
              <div class="education-col-left">
                <p><strong>Institution:</strong> {{ item.school }}</p>
                <p><strong>Qualification:</strong> {{ item.name }}</p>
                <p><strong>Date:</strong> {{ item.startDate }} – {{ item.endDate }}</p>
                <p><strong>Grade:</strong> {{ item.grade }}</p>
              </div>
              <div class="education-col-right">
                <p>{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Edit/Add Form -->
        <div class="education-form">
          <h2>{{ selectedItem ? 'Edit Education Entry' : 'Add Education Entry' }}</h2>
          <form @submit.prevent="saveItem">
            <label>Qualification:
              <input v-model="formName" type="text" />
            </label>
            <label>Institution:
              <input v-model="formSchool" type="text" />
            </label>
            <label>Grade (NQF Level):
              <input v-model="formGrade" type="text" />
            </label>
            <label>Start Date:
              <input v-model="formStartDate" type="text" />
            </label>
            <label>End Date:
              <input v-model="formEndDate" type="text" />
            </label>
            <label>Description:
              <textarea v-model="formDescription"></textarea>
            </label>
            <label>Image URL:
              <input v-model="formUrl" type="text" />
            </label>
            <button type="submit" class="btn-save">Save</button>
            <button type="button" class="btn-delete" v-if="selectedItem" @click="deleteItem(selectedItem.id)">Delete</button>
          </form>
          <p v-if="message" class="status-message">{{ message }}</p>
        </div>

        <!-- Image Block -->
        <div class="education-image-block">
          <img :src="viewEducationImage" alt="Education certificate" />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
div#education {
  width: 100vw;
  height: 100vh;
  background-color: #0a0b0d;
  overflow: hidden;
}

section.education-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0;
  box-sizing: border-box;
}

.education-text-column {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 40px 5% 20px 5%;
}

.education-heading {
  margin: 0 0 20px 0;
  font-size: clamp(1.8rem, 4vw, 3rem);
  color: #fff;
  text-transform: uppercase;
  border-left: 4px solid #ff4d00;
  padding-left: 24px;
  align-self: flex-start;
}

.education-content-wrapper {
  flex: 0 0 auto;
  width: 100%;
  display: flex;
  justify-content: flex-start;
}

.education-content {
  background: rgba(255, 255, 255, 0);
  padding: 20px;
  overflow-y: auto;
  max-height: 55vh;
  width: 90%;
}

.education-item {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  padding: 12px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  cursor: pointer;
  transition: background 0.2s ease;
}
.education-item:hover {
  background: rgba(255,77,0,0.2);
}

.education-col-left p,
.education-col-right p {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.85);
  margin: 4px 0;
}
.education-col-left strong {
  color: #ff4d00;
}

.education-form {
  margin-top: 20px;
  background: rgba(255,255,255,0.05);
  padding: 20px;
  border-radius: 8px;
  width: 90%;
}
.education-form label {
  display: block;
  margin-bottom: 10px;
  color: #ccc;
}
.education-form input,
.education-form textarea {
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