<script>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { db } from '../firebase/index.js';
import { collection, doc, getDocs, getDoc } from 'firebase/firestore';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default {
  name: 'ViewSkills',
  setup() {
    const skills = ref([]);
    const loading = ref(true);
    const activeStack = ref("Enterprise Integration");
    const chartInstance = ref(null);
    const chartCanvas = ref(null);
    const focusAreas = ref([]);

    const stacks = [
      "Enterprise Integration",
      "Workday Platform",
      "Software Engineering",
      "Data Engineering",
      "Development Tools",
      "Leadership & Consulting"
    ];

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
          nextTick(() => renderRadarChart());
        }
      }
    };

    const loadFocusAreas = async () => {
      try {
        const docRef = doc(db, "views", "focusAreas");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          focusAreas.value = Object.values(data).filter(Boolean);
        }
      } catch (err) {
        console.error("Error loading focus areas:", err);
      }
    };

    const filteredSkills = computed(() =>
      skills.value.filter(s => s.type === activeStack.value)
    );

    const renderRadarChart = () => {
      if (!chartCanvas.value) return;
      if (chartInstance.value) chartInstance.value.destroy();

      const labels = stacks;
      const data = stacks.map(stack =>
        skills.value.filter(s => s.type === stack).length
      );

      chartInstance.value = new Chart(chartCanvas.value, {
        type: 'radar',
        data: {
          labels,
          datasets: [{
            label: 'Skills Count',
            data,
            backgroundColor: 'rgba(255, 77, 0, 0.2)',
            borderColor: '#ff4d00',
            pointBackgroundColor: '#ff4d00'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              angleLines: { color: '#444' },
              grid: { color: '#333' },
              pointLabels: { color: '#fff', font: { size: 10 } },
              ticks: { color: '#fff', stepSize: 5 }
            }
          },
          plugins: { legend: { display: false } }
        }
      });
    };

    onMounted(() => {
      loadSkills();
      loadFocusAreas();
    });

    watch(skills, () => {
      if (window.innerWidth > 768) {
        nextTick(() => renderRadarChart());
      }
    });

    return { stacks, activeStack, filteredSkills, loading, chartCanvas, focusAreas };
  }
};
</script>

<template>
  <section class="skills-root">
    <h1 class="title">SKILLS</h1>

    <!-- Desktop nav -->
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

    <!-- Mobile nav dropdown -->
    <select v-model="activeStack" class="mobile-nav">
      <option v-for="stack in stacks" :key="stack" :value="stack">
        {{ stack }}
      </option>
    </select>

    <div v-if="loading" class="loading">Loading skills...</div>

    <div v-else class="content">
      <!-- Skills list -->
      <div class="skill-list">
        <ul>
          <li v-for="skill in filteredSkills" :key="skill.id">
            <div class="skill-row">
              <div class="skill-text">
                <span class="skill-name">{{ skill.name }}</span>
                <p class="skill-desc">{{ skill.description }}</p>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: skill.percentage + '%' }"></div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- Radar chart + Focus Areas (desktop only) -->
      <div class="skill-graph desktop-graph">
        <canvas ref="chartCanvas"></canvas>
        <div class="focus-areas">
          <h3>Key Focus Areas</h3>
          <div class="focus-cards">
            <div v-for="area in focusAreas" :key="area" class="focus-card">
              {{ area }}
            </div>
          </div>
        </div>
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
  padding: 15px 20px;
  box-sizing: border-box;
  justify-content: space-between;
}

.title {
  font-size: 26px;
  font-weight: 600;
  border-left: 4px solid #ff4d00;
  padding-left: 10px;
  margin: 0 0 8px 0;
}

/* Desktop nav styling */
.desktop-nav {
  display: flex;
  gap: 8px;
  padding: 6px;
  width: 100%;
  margin-top: 8px;
  margin-bottom: 0px;
  justify-content: space-between;
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0px;
}
.desktop-nav .nav-btn {
  border-radius: 100px;
  padding: 10px 24px;
  border: none;
  cursor: pointer;
  background-color: transparent;
  color: #a1a1a1;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.desktop-nav .nav-btn:hover:not(.active) {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}
.desktop-nav .nav-btn.active {
  background-color: #ff4d00;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(255, 77, 0, 0.3);
}

.mobile-nav {
  display: none;
}

/* Mobile view (<1200px) */
@media (max-width: 1200px) {
  .desktop-nav { display: none !important; }
  .mobile-nav { 
    display: block; 
    width: 100%;
    padding: 8px;
    margin: 8px 0;
    border-radius: 6px;
    border: 1px solid #444;
    background: #111;
    color: #fff;
    font-size: 0.85rem;
  }

  .content { 
    flex-direction: column; 
    overflow-y: auto; 
  }

  /* Keep radar chart visible on mobile */
  .focus-areas { display: none; }   /* hide focus areas only */
  .progress-bar { width: 100px; }
}

.content {
  display: flex;
  gap: 16px;
  flex: 1;
  min-height: 0;
  position: relative;
  overflow: hidden;
}

/* Scrollbar Styles */
.skill-list {
  flex: 1;
  background: #111;
  padding: 10px 30px 10px 10px;
  border-radius: 6px;
  overflow-y: auto;
  font-size: 0.75rem;
  max-height: 100%; /* ensures scrollbar works */
  scrollbar-width: thin;
  scrollbar-color: rgba(214, 67, 4, 0.959) rgba(10, 0, 0, 0.071);
}
.skill-list::-webkit-scrollbar {
  width: 5px;
}
.skill-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.031);
}
.skill-list::-webkit-scrollbar-thumb {
  background: rgba(214, 67, 4, 0.959);
  border-radius: 10px;
  box-shadow: rgba(214, 67, 4, 0.5) 0px 0px 6px;
}

.skills-root .content::after {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(to right, transparent, rgba(255, 77, 0, 0.5), transparent);
  animation: scan-line 4s linear infinite;
  pointer-events: none;
  z-index: 2;
}

/* Skills list items */
.skill-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.skill-list ul li {
  position: relative;
  padding-bottom: 8px;
  margin-bottom: 8px;
}
.skill-list ul li::after {
  content: "";
  position: absolute;
  bottom: 0; left: 0;
  width: 100%; height: 1px;
  background: linear-gradient(to right, rgba(255, 77, 0, 0.8), rgba(255, 77, 0, 0));
}
.skill-list ul li:last-child::after { display: none; }

.skill-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.skill-text {
  flex: 1;
  margin-right: 10px;
}
.skill-name {
  font-weight: bold;
  color: #ff4d00;
  font-size: 0.75rem;
  display: block;
  margin-bottom: 0;
  line-height: 1.2;
}
.skill-desc {
  color: #ccc;
  font-size: 0.7rem;
  margin-top: 0;
  line-height: 1.2;
}

/* Progress bar aligned right */
.progress-bar {
  background: #333;
  border-radius: 4px;
  height: 6px;
  width: 120px;
  flex-shrink: 0;
}
.progress-fill {
  background: #ff4d00;
  height: 100%;
  border-radius: 4px;
}

/* Radar chart */
.skill-graph.desktop-graph {
  flex: 1;
  background-color: transparent;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.skill-graph.desktop-graph canvas {
  flex-grow: 0;
  height: 260px !important;
  margin-bottom: 12px;
  animation: ai-scan-pulse 3s infinite ease-in-out;
  transition: all 0.3s ease;
  will-change: transform, filter;
}
.skill-graph.desktop-graph canvas:hover {
  transform: scale(1.02);
  filter: brightness(1.1);
}

/* AI scan pulse keyframes */
@keyframes ai-scan-pulse {
  0% { filter: brightness(1) contrast(1); transform: scale(1); }
  50% { filter: brightness(1.2) contrast(1.1); transform: scale(1.01); }
  100% { filter: brightness(1) contrast(1); transform: scale(1); }
}

/* Focus Areas Section */
.focus-areas {
  margin-top: auto;
  padding: 12px;
  border: 0.01px solid rgb(255, 77, 0);
  box-shadow: 0 0 1px rgb(255, 77, 0);
  border-radius: 6px;
}
.focus-areas h3 {
  font-size: 0.8rem;
  font-weight: 600;
  color: #ff4d00;
  margin-top: 0px;
  margin-bottom: 8px;
}
.focus-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.focus-card {
  background: #222;
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  flex: 1 1 calc(33% - 8px);
  text-align: center;
  border: 1px solid #ff4d00;
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.focus-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(255,77,0,0.3);
}

/* Loading state */
.loading {
  text-align: center;
  font-size: 0.8rem;
  color: #ccc;
  margin-top: 20px;
}
</style>
