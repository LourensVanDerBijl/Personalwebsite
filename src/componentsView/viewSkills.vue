<script>
import { ref, onMounted, computed, watch } from 'vue';
import { db } from '../firebase/index.js';
import { collection, getDocs } from 'firebase/firestore';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default {
  name: 'ViewSkills',
  setup() {
    const skills = ref([]);
    const loading = ref(true);
    const activeStack = ref("DevStack");
    const chartInstance = ref(null);
    const chartCanvas = ref(null);

    const stacks = ["DevStack", "WorkdayStack", "TechnologyStack", "ProductivityStack", "LeadershipStack"];

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
        if (window.innerWidth > 768) renderChart(); // only desktop
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
              ticks: { display: false }, // hide bottom labels
              grid: { display: false }
            }
          }
        }
      });
    };

    onMounted(loadSkills);
    watch(activeStack, () => {
      if (window.innerWidth > 768) renderChart();
    });

    return { stacks, activeStack, filteredSkills, loading, chartCanvas };
  }
};
</script>

<template>
  <section class="skills-root">
    <h1 class="title">SKILLS</h1>

    <div class="intro">
      <p>
        This section highlights my technical and leadership capabilities across multiple stacks.
        Select a category below to explore my skills and see a visual breakdown of proficiency.
      </p>
    </div>

    <!-- Desktop navbar -->
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

    <!-- Mobile dropdown -->
    <div class="mobile-nav">
      <select v-model="activeStack">
        <option v-for="stack in stacks" :key="stack" :value="stack">{{ stack }}</option>
      </select>
    </div>

    <div v-if="loading" class="loading">Loading skills...</div>

    <div v-else class="content">
      <!-- Skills list -->
      <div class="skill-list">
        <ul>
          <li v-for="skill in filteredSkills" :key="skill.id">
            <span class="skill-name">{{ skill.name }}</span>
            <span class="skill-desc"> – {{ skill.description }}</span>

            <!-- Progress bar (mobile only) -->
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: skill.percentage + '%' }"></div>
            </div>
          </li>
        </ul>
      </div>

      <!-- Desktop chart -->
      <div class="skill-graph desktop-graph">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
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

.intro {
  background: #111;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  color: #ccc;
  font-size: 0.9rem;
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

.mobile-nav {
  display: none;
  margin-bottom: 16px;
}
.mobile-nav select {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  background: #222;
  color: #fff;
  border: 1px solid #444;
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

/* Orange scrollbar */
.skill-list::-webkit-scrollbar {
  width: 6px;
}
.skill-list::-webkit-scrollbar-thumb {
  background-color: #ff4d00;
  border-radius: 10px;
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

/* Progress bar hidden by default */
.progress-bar {
  background: #333;
  border-radius: 4px;
  height: 6px;
  margin-top: 6px;
  width: 100%;
  display: none; /* only show on mobile */
}
.progress-fill {
  background: #ff4d00;
  height: 100%;
  border-radius: 4px;
}

/* Desktop chart */
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

/* Responsive rules */
@media (max-width: 768px) {
  .desktop-nav { display: none; }
  .mobile-nav { display: block; }
  .desktop-graph { display: none; }
  .progress-bar { display: block; }
  .content { flex-direction: column; }
  .skill-list { width: 100%; flex: none; height: 100%; }
}
</style>
