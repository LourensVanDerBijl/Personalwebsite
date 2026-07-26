<script>
import { ref, onMounted, computed } from 'vue';
import { db } from '../firebase/index.js';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

export default {
  name: 'ViewSkillsAdmin',
  setup() {
    const skills = ref([]);
    const loading = ref(true);
    const activeStack = ref("DevStack");
    const message = ref('');

    const stacks = ["DevStack", "WorkdayStack", "TechnologyStack", "ProductivityStack", "LeadershipStack"];

    // Form fields
    const formId = ref('');
    const formName = ref('');
    const formDescription = ref('');
    const formPercentage = ref(0);
    const formType = ref('DevStack');

    const loadSkills = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "skills"));
        skills.value = querySnapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        }));
      } catch (err) {
        console.error("Error loading skills:", err);
      } finally {
        loading.value = false;
      }
    };

    const filteredSkills = computed(() =>
      skills.value.filter(s => s.type === activeStack.value)
    );

    const editSkill = (skill) => {
      formId.value = skill.id;
      formName.value = skill.name;
      formDescription.value = skill.description;
      formPercentage.value = skill.percentage;
      formType.value = skill.type;
    };

    const updateDate = async () => {
      const today = new Date();
      const formattedDate = `${today.getFullYear()}/${String(today.getMonth()+1).padStart(2,'0')}/${String(today.getDate()).padStart(2,'0')}`;
      const updateRef = doc(db, 'UpdateDate', 'UpdateDate');
      await setDoc(updateRef, { Date: formattedDate });
    };

    const saveSkill = async () => {
      try {
        const docRef = doc(db, 'skills', formId.value || formName.value);
        await setDoc(docRef, {
          name: formName.value,
          description: formDescription.value,
          percentage: Number(formPercentage.value),
          type: formType.value
        });
        await updateDate();
        message.value = '✅ Skill saved successfully!';
        await loadSkills();
        formId.value = '';
      } catch (err) {
        console.error("Error saving skill:", err);
        message.value = '❌ Error saving skill.';
      }
    };

    const deleteSkill = async (skillId) => {
      try {
        await deleteDoc(doc(db, 'skills', skillId));
        await updateDate();
        message.value = '✅ Skill deleted.';
        await loadSkills();
      } catch (err) {
        console.error("Error deleting skill:", err);
        message.value = '❌ Error deleting skill.';
      }
    };

    onMounted(loadSkills);

    return { stacks, activeStack, filteredSkills, loading,
             formId, formName, formDescription, formPercentage, formType,
             editSkill, saveSkill, deleteSkill, message };
  }
};
</script>

<template>
  <section class="skills-root">
    <h1 class="title">SKILLS (Admin)</h1>

    <!-- Nav bar -->
    <nav class="stack-nav">
      <button
        v-for="stack in stacks"
        :key="stack"
        :class="['nav-btn', { active: activeStack === stack }]"
        @click="activeStack = stack"
      >
        {{ stack }}
      </button>
    </nav>

    <div v-if="loading" class="loading">Loading skills...</div>

    <!-- Skills Table -->
    <div v-else class="skills-table-wrapper">
      <table class="skills-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Percentage</th>
            <th>Stack</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="skill in filteredSkills" :key="skill.id">
            <td>{{ skill.name }}</td>
            <td>{{ skill.description }}</td>
            <td>{{ skill.percentage }}%</td>
            <td>{{ skill.type }}</td>
            <td>
              <button class="edit-btn" @click="editSkill(skill)">Edit</button>
              <button class="delete-btn" @click="deleteSkill(skill.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Form -->
    <div class="skill-form">
      <h2>{{ formId ? 'Edit Skill' : 'Add Skill' }}</h2>
      <form @submit.prevent="saveSkill" class="form-grid">
        <label class="full-width">Name:
          <input v-model="formName" type="text" />
        </label>
        <label>Description:
          <input v-model="formDescription" type="text" />
        </label>
        <label>Percentage:
          <input v-model="formPercentage" type="number" min="0" max="100" />
        </label>
        <label>Stack:
          <select v-model="formType">
            <option v-for="stack in stacks" :key="stack" :value="stack">{{ stack }}</option>
          </select>
        </label>
        <div class="full-width">
          <button type="submit" class="btn-save">Save</button>
        </div>
      </form>
      <p v-if="message" class="status-message">{{ message }}</p>
    </div>
  </section>
</template>

<style scoped>
.skills-root {
  display: flex;
  flex-direction: column;
  height: 100vh; /* one full screen */
  width: 100%;
  background-color: #0a0b0d;
  color: #fff;
  padding: 20px 30px;
  box-sizing: border-box;
}

.title {
  font-size: 32px;
  font-weight: 500;
  border-left: 4px solid #ff4d00;
  padding-left: 12px;
  margin-bottom: 16px;
}

/* Nav bar */
.stack-nav {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  width: 100%;
}
.nav-btn {
  flex: 1;
  background: #222;
  color: #fff;
  border: 1px solid #444;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}
.nav-btn.active {
  background: #ff4d00;
  border-color: #ff4d00;
}

/* Table */
.skills-table-wrapper {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 16px;
}
.skills-table {
  width: 100%;
  border-collapse: collapse;
}
.skills-table th, .skills-table td {
  border: 1px solid #333;
  padding: 8px;
  font-size: 0.9rem;
}
.skills-table th {
  background: #111;
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
.edit-btn:hover { background: #e67320; }
.delete-btn {
  background: transparent;
  color: #ff4d00;
  border: 1px solid #ff4d00;
}
.delete-btn:hover { background: rgba(255,77,0,0.1); }

/* Form */
.skill-form {
  flex-shrink: 0;
  max-height: 220px;
  overflow-y: auto;
  background: rgba(255,255,255,0.05);
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
  color: #fff;
}
.form-grid .full-width {
  grid-column: span 2;
}
.skill-form input, .skill-form select {
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
}
.btn-save:hover { background: #e63c00; }

.status-message {
  margin-top: 8px;
  font-size: 0.9rem;
  color: #ff8c3c;
}
</style>
