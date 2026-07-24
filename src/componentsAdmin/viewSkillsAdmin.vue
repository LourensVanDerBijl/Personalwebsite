<script>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { db } from '../firebase/index.js';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default {
  name: 'ViewSkillsAdmin',
  setup() {
    const skills = ref([]);
    const loading = ref(true);
    const activeStack = ref("DevStack");
    const chartInstance = ref(null);
    const chartCanvas = ref(null);
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
        if (window.innerWidth > 768) {
          nextTick(() => renderChart());
        }
      }
    };

    const filteredSkills = computed(() =>
      skills.value.filter(s => s.type === activeStack.value)
    );

    const renderChart = () => {
      if (!chartCanvas.value) return;
      if (chartInstance.value) chartInstance.value.destroy();

      const labels = filteredSkills.value.map(s => s.name);
      const data = filteredSkills.value.map(s => s.percentage);

      chartInstance.value = new Chart(chartCanvas.value, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Proficiency (%)',
            data,
            backgroundColor: 'rgba(255, 77, 0, 0.7)'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 800 },
          plugins: { legend: { display: false } },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: { color: '#fff' }
            },
            x: {
              ticks: { display: false },
              grid: { display: false }
            }
          }
        }
      });
    };

    const editSkill = (skill) => {
      formId.value = skill.id;
      formName.value = skill.name;
      formDescription.value = skill.description;
      formPercentage.value = skill.percentage;
      formType.value = skill.type;
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
        message.value = '✅ Skill deleted.';
        await loadSkills();
      } catch (err) {
        console.error("Error deleting skill:", err);
        message.value = '❌ Error deleting skill.';
      }
    };

    onMounted(loadSkills);
    watch(activeStack, () => {
      if (window.innerWidth > 768) {
        nextTick(() => renderChart());
      }
    });

    return { stacks, activeStack, filteredSkills, loading, chartCanvas,
             formId, formName, formDescription, formPercentage, formType,
             editSkill, saveSkill, deleteSkill, message };
  }
};
</script>

<template>
  <section class="skills-root">
    <h1 class="title">SKILLS (Admin)</h1>

    <nav class="stack-nav desktop-nav">
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

    <div v-else class="content">
      <!-- Skills list -->
      <div class="skill-list">
        <ul>
          <li v-for="skill in filteredSkills" :key="skill.id">
            <span class="skill-name">{{ skill.name }}</span>
            <span class="skill-desc"> – {{ skill.description }}</span>
            <span class="skill-percent"> ({{ skill.percentage }}%)</span>
            <button class="edit-btn" @click="editSkill(skill)">Edit</button>
            <button class="delete-btn" @click="deleteSkill(skill.id)">Delete</button>
          </li>
        </ul>
      </div>

      <!-- Desktop chart -->
      <div class="skill-graph desktop-graph">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>

    <!-- Add/Edit Form -->
    <div class="skill-form">
      <h2>{{ formId ? 'Edit Skill' : 'Add Skill' }}</h2>
      <form @submit.prevent="saveSkill">
        <label>Name:
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
        <button type="submit" class="btn-save">Save</button>
      </form>
      <p v-if="message" class="status-message">{{ message }}</p>
    </div>
  </section>
</template>

<style scoped>
.skills-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-color: #0a0b0d;
  color: #fff;
  padding: 40px 20px;
  box-sizing: border-box;
}

.title {
  font-size: 32px;
  font-weight: 500;
  border-left: 4px solid #ff4d00;
  padding-left: 12px;
  margin-bottom: 16px;
}

.stack-nav {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.nav-btn {
  background: #222;
  color: #fff;
  border: 1px solid #444;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}
.nav-btn.active {
  background: #ff4d00;
  border-color: #ff4d00;
}

.content {
  display: flex;
  gap: 20px;
  flex: 1;
  min-height: 0;
}

.skill-list {
  flex: 1;
  background: #111;
  padding: 12px;
  border-radius: 6px;
  overflow-y: auto;
  font-size: 0.85rem;
}
.skill-list li {
  margin-bottom: 12px;
  color: #ddd;
}
.skill-name {
  font-weight: bold;
  color: #ff4d00;
}
.skill-desc {
  color: #ccc;
}
.skill-percent {
  color: #fff;
  margin-left: 6px;
}
.edit-btn, .delete-btn {
  margin-left: 10px;
  padding: 4px 8px;
  font-size: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
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

.skill-graph {
  flex: 1;
  background: #111;
  padding: 12px;
  border-radius: 6px;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
}
.skill-graph canvas {
  width: 100% !important;
  height: 100% !important;
}

.skill-form {
  margin-top: 30px;
  background: rgba(255,255,255,0.05);
  padding: 20px;
  border-radius: 8px;
  width: 100%;
}

.skill-form h2 {
  margin-bottom: 16px;
  font-size: 1.2rem;
  color: #ff4d00;
}

.skill-form label {
  display: block;
  margin-bottom: 10px;
  color: #ccc;
}

.skill-form input,
.skill-form select {
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

.status-message {
  margin-top: 12px;
  font-size: 0.9rem;
  color: #ff8c3c;
}
</style>