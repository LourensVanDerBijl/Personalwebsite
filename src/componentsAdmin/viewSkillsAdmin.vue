<script>
import { ref, onMounted, computed } from 'vue';
import { db } from '../firebase/index.js';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

export default {
  name: 'ViewSkillsAdmin',
  setup() {
    const skills = ref([]);
    const loading = ref(true);
    const activeStack = ref("Enterprise Integration");
    const message = ref('');

    const stacks = [
      "Enterprise Integration",
      "Workday Platform",
      "Software Engineering",
      "Data Engineering",
      "Development Tools",
      "Leadership & Consulting"
    ];

    // Form fields for new skill
    const formName = ref('');
    const formDescription = ref('');
    const formPercentage = ref(0);
    const formType = ref('Enterprise Integration');

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

    const updateDate = async () => {
      const today = new Date();
      const formattedDate = `${today.getFullYear()}/${String(today.getMonth()+1).padStart(2,'0')}/${String(today.getDate()).padStart(2,'0')}`;
      const updateRef = doc(db, 'UpdateDate', 'UpdateDate');
      await setDoc(updateRef, { Date: formattedDate });
    };

    const saveSkill = async () => {
      try {
        const docRef = doc(db, 'skills', formName.value);
        await setDoc(docRef, {
          name: formName.value,
          description: formDescription.value,
          percentage: Number(formPercentage.value),
          type: formType.value
        });
        await updateDate();
        message.value = '✅ Skill saved successfully!';
        await loadSkills();
        // reset form
        formName.value = '';
        formDescription.value = '';
        formPercentage.value = 0;
        formType.value = activeStack.value;
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
             formName, formDescription, formPercentage, formType,
             saveSkill, deleteSkill, message };
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
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="skill in filteredSkills" :key="skill.id">
            <td>{{ skill.name }}</td>
            <td>{{ skill.description }}</td>
            <td>{{ skill.percentage }}%</td>
            <td>{{ skill.type }}</td>
            <td>
              <button class="delete-btn" @click="deleteSkill(skill.id)">Delete</button>
            </td>
          </tr>

          <!-- Add New Row -->
          <tr class="add-row">
            <td colspan="5">
              <form @submit.prevent="saveSkill" class="add-form">
                <input v-model="formName" type="text" placeholder="Skill Name" required />
                <input v-model="formDescription" type="text" placeholder="Description" required />
                <input v-model="formPercentage" type="number" min="0" max="100" placeholder="%" required />
                <select v-model="formType" required>
                  <option v-for="stack in stacks" :key="stack" :value="stack">{{ stack }}</option>
                </select>
                <button type="submit" class="btn-save">Add Skill</button>
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
.skills-root {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background-color: #0a0b0d;
  color: #fff;
  padding: 12px 20px; /* tighter padding */
  box-sizing: border-box;
}

.title {
  font-size: 28px;
  font-weight: 500;
  border-left: 4px solid #ff4d00;
  padding-left: 10px;
  margin-top: 4px;   /* minimal space from top */
  margin-bottom: 8px; /* tighter spacing below */
}

/* Nav bar */
.stack-nav {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  width: 100%;
}
.nav-btn {
  flex: 1;
  background: #222;
  color: #fff;
  border: 1px solid #444;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem; /* smaller text */
}
.nav-btn.active {
  background: #ff4d00;
  border-color: #ff4d00;
}

/* Table */
.skills-table-wrapper {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 12px;
}
.skills-table {
  width: 100%;
  border-collapse: collapse;
}
.skills-table th, .skills-table td {
  border: 1px solid #333;
  padding: 6px;
  font-size: 0.75rem; /* smaller text */
}
.skills-table th {
  background: #111;
  text-align: left;
}

/* Delete button */
.delete-btn {
  background: transparent;
  color: #ff4d00;
  border: 1px solid #ff4d00;
  padding: 4px 10px;
  font-size: 0.7rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}
.delete-btn:hover { background: rgba(255,77,0,0.1); }

/* Add new row */
.add-row td {
  background: #000000;
  padding: 6px;
}
.add-form {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
  align-items: center;
}
.add-form input,
.add-form select {
  padding: 5px;
  font-size: 0.7rem;
  border-radius: 3px;
  border: 1px solid #ff4d00;
  background: #fff;
  color: #000;
}
.btn-save {
  background: #ff4d00;
  color: #fff;
  border: none;
  padding: 5px 10px;
  font-size: 0.7rem;
  border-radius: 3px;
  cursor: pointer;
  font-weight: 600;
}
.btn-save:hover {
  background: #e63c00;
}

/* Status message */
.status-message {
  margin-top: 6px;
  font-size: 0.75rem;
  color: #ff8c3c;
}

/* Loading */
.loading {
  text-align: center;
  font-size: 0.8rem;
  color: #ccc;
  margin-top: 12px;
}
</style>
