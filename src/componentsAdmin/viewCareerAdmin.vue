<script>
import { ref, onMounted } from 'vue';
import { db } from '../firebase/index.js';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

export default {
  name: 'ViewCareerAdmin',
  setup() {
    const companies = ref([]);
    const selectedCompany = ref(null);
    const message = ref('');

    // Form fields
    const formCompany = ref('');
    const formTitle = ref('');
    const formStartDate = ref('');
    const formEndDate = ref('');
    const formDesc1 = ref('');
    const formDesc2 = ref('');
    const formDesc3 = ref('');
    const formDesc4 = ref('');
    const formDesc5 = ref('');
    const formAchievements = ref([]);
    const formStacks = ref([]);

    const loadCareerHistory = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'history'));
        let items = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          items.push({
            id: docSnap.id,
            company: data.company || docSnap.id,
            title: data.title || '',
            startDate: data.startDate || '',
            endDate: data.endDate || '',
            descriptions: [
              data.describtion1,
              data.describtion2,
              data.describtion3,
              data.describtion4,
              data.describtion5
            ].filter(Boolean),
            achievements: data.achievments ? data.achievments.split('~').map(a => a.trim()).filter(Boolean) : [],
            stacks: data.stacks ? data.stacks.split('~').map(s => s.trim()).filter(Boolean) : []
          });
        });
        items.sort((a, b) => {
          if (a.endDate === 'current') return -1;
          if (b.endDate === 'current') return 1;
          return parseInt(b.endDate) - parseInt(a.endDate);
        });
        companies.value = items;
        if (items.length > 0) selectCompany(items[0]);
      } catch (error) {
        console.error('Error loading career history:', error);
      }
    };

    const selectCompany = (company) => {
      selectedCompany.value = company;
      formCompany.value = company.company;
      formTitle.value = company.title;
      formStartDate.value = company.startDate;
      formEndDate.value = company.endDate;
      formDesc1.value = company.descriptions[0] || '';
      formDesc2.value = company.descriptions[1] || '';
      formDesc3.value = company.descriptions[2] || '';
      formDesc4.value = company.descriptions[3] || '';
      formDesc5.value = company.descriptions[4] || '';
      formAchievements.value = [...company.achievements];
      formStacks.value = [...company.stacks];
    };

    const newCompany = () => {
      selectedCompany.value = null;
      formCompany.value = '';
      formTitle.value = '';
      formStartDate.value = '';
      formEndDate.value = '';
      formDesc1.value = '';
      formDesc2.value = '';
      formDesc3.value = '';
      formDesc4.value = '';
      formDesc5.value = '';
      formAchievements.value = [];
      formStacks.value = [];
    };

    const updateDate = async () => {
      const today = new Date();
      const formattedDate = `${today.getFullYear()}/${String(today.getMonth()+1).padStart(2,'0')}/${String(today.getDate()).padStart(2,'0')}`;
      const updateRef = doc(db, 'UpdateDate', 'UpdateDate');
      await setDoc(updateRef, { Date: formattedDate });
    };

    const saveCompany = async () => {
      try {
        const docRef = doc(db, 'history', formCompany.value);
        await setDoc(docRef, {
          company: formCompany.value,
          title: formTitle.value,
          startDate: formStartDate.value,
          endDate: formEndDate.value,
          describtion1: formDesc1.value,
          describtion2: formDesc2.value,
          describtion3: formDesc3.value,
          describtion4: formDesc4.value,
          describtion5: formDesc5.value,
          achievments: formAchievements.value.join('~'),
          stacks: formStacks.value.join('~')
        });
        await updateDate();
        message.value = '✅ Changes saved successfully!';
        await loadCareerHistory();
      } catch (error) {
        console.error('Error saving company:', error);
        message.value = '❌ Error saving changes.';
      }
    };

    const deleteCompany = async (companyId) => {
      try {
        await deleteDoc(doc(db, 'history', companyId));
        await updateDate();
        message.value = '✅ Company deleted.';
        await loadCareerHistory();
      } catch (error) {
        console.error('Error deleting company:', error);
        message.value = '❌ Error deleting company.';
      }
    };

    onMounted(loadCareerHistory);

    return {
      companies, selectedCompany, formCompany, formTitle, formStartDate, formEndDate,
      formDesc1, formDesc2, formDesc3, formDesc4, formDesc5,
      formAchievements, formStacks,
      selectCompany, newCompany, saveCompany, deleteCompany, message
    };
  }
};
</script>

<template>
  <section class="career-root scrollable">
    <h2 class="career-heading">Career History – Admin Edit</h2>

    <div class="career-layout">
      <!-- Company List -->
      <div class="career-nav">
        <button class="btn-new" @click="newCompany">+ New Company</button>
        <div
          v-for="company in companies"
          :key="company.id"
          class="career-nav-item"
          :class="{ active: selectedCompany && selectedCompany.id === company.id }"
          @click="selectCompany(company)"
        >
          {{ company.company }}
        </div>
      </div>

      <!-- Edit/Add Form -->
      <div class="career-form">
        <form @submit.prevent="saveCompany">
          <!-- Paired fields -->
          <div class="form-row">
            <label>Company:
              <input v-model="formCompany" type="text" />
            </label>
            <label>Title:
              <input v-model="formTitle" type="text" />
            </label>
          </div>

          <div class="form-row">
            <label>Start Date:
              <input v-model="formStartDate" type="text" />
            </label>
            <label>End Date:
              <input v-model="formEndDate" type="text" />
            </label>
          </div>

          <!-- Full-width paragraphs -->
          <label>Paragraph 1:
            <textarea v-model="formDesc1"></textarea>
          </label>
          <label>Paragraph 2:
            <textarea v-model="formDesc2"></textarea>
          </label>
          <label>Paragraph 3:
            <textarea v-model="formDesc3"></textarea>
          </label>
          <label>Paragraph 4:
            <textarea v-model="formDesc4"></textarea>
          </label>
          <label>Paragraph 5:
            <textarea v-model="formDesc5"></textarea>
          </label>

          <!-- Achievements -->
          <label>Achievements:</label>
          <div v-for="(ach, index) in formAchievements" :key="index" class="form-row">
            <input v-model="formAchievements[index]" placeholder="Achievement" />
          </div>
          <button type="button" @click="formAchievements.push('')">+ Add Achievement</button>

          <!-- Stacks -->
          <label>Stacks:</label>
          <div v-for="(stack, index) in formStacks" :key="index" class="form-row">
            <input v-model="formStacks[index]" placeholder="Stack" />
          </div>
          <button type="button" @click="formStacks.push('')">+ Add Stack</button>

          <!-- Actions -->
          <div class="form-actions">
            <button type="submit" class="btn-save">Save Company</button>
            <button type="button" class="btn-delete" v-if="selectedCompany" @click="deleteCompany(selectedCompany.id)">Delete Company</button>
          </div>
        </form>

        <p v-if="message" class="status-message">{{ message }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Root: lock section to viewport */
.career-root {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;        /* contain scroll inside holder */
  padding: 30px 40px;
  background: #fff;
  color: #000;
  box-sizing: border-box;
}

.scrollable {
  flex: 1;
  min-height: 0;           /* allow shrink inside flex */
  overflow-y: auto;        /* vertical scrollbar */
}

/* Orange scrollbar */
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

/* Heading */
.career-heading {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 20px;
  border-left: 4px solid #ff4d00;
  padding-left: 12px;
  color: #000;
}

/* Layout: nav + form */
.career-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 20px;
  min-height: 0;           /* critical for flex scroll */
}

/* Nav bar */
.career-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.btn-new {
  background: #ff4d00;
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-bottom: 10px;
}
.btn-new:hover {
  background: #e63c00;
}
.career-nav-item {
  padding: 6px 14px;
  font-size: 13px;
  color: #fff;
  background: #ff4d00;
  border-radius: 20px;
  cursor: pointer;
}
.career-nav-item.active {
  background: #000;
  color: #ff4d00;
}

/* Form container */
.career-form {
  background: #fafafa;
  padding: 20px;
  border-radius: 8px;
  overflow-y: auto;
}
.career-form label {
  display: block;
  margin-bottom: 12px;
  color: #000;
  font-size: 0.9rem;
}
.career-form input,
.career-form textarea {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ff4d00;
  background: #f9f9f9;
  color: #000;
  margin-top: 4px;
  font-size: 0.95rem;
}
.career-form textarea {
  min-height: 100px; /* full-width paragraphs */
}

/* Paired fields */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 12px;
}
.form-row label {
  margin-bottom: 0;
}

/* Actions */
.form-actions {
  margin-top: 16px;
  display: flex;
  gap: 12px;
}
.btn-save {
  background: #ff4d00;
  color: #fff;
  border: none;
  padding: 10px 16px;
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
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
}
.btn-delete:hover {
  background: rgba(255,77,0,0.1);
}

/* Status message */
.status-message {
  margin-top: 12px;
  font-size: 0.9rem;
  color: #ff8c3c;
}

/* Responsive */
@media (max-width: 768px) {
  .career-layout {
    grid-template-columns: 1fr;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>