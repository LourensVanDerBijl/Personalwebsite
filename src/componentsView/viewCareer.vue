<script>
import { ref, onMounted } from 'vue';
import { db } from '../firebase/index.js';
import { collection, getDocs } from 'firebase/firestore';

export default {
  name: 'ViewCareer',
  setup() {
    const companies = ref([]);
    const selectedCompany = ref(null);

    const loadCareerHistory = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'history'));
        let items = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          items.push({
            id: doc.id,
            company: data.company || doc.id,
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
        if (items.length > 0) selectedCompany.value = items[0];
      } catch (error) {
        console.error('Error loading career history:', error);
      }
    };

    const selectCompany = (company) => {
      selectedCompany.value = company;
    };

    onMounted(loadCareerHistory);

    return { companies, selectedCompany, selectCompany };
  }
};
</script>

<template>
  <div class="career-root">
    <div class="career-header-row">
      <h1 class="career-heading">Career History</h1>
      <div class="career-nav">
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
    </div>

    <div v-if="selectedCompany" class="career-content">
      <div class="career-info">
        <h2>{{ selectedCompany.company }}</h2>
        <p>{{ selectedCompany.startDate }} - {{ selectedCompany.endDate }}</p>
        <p class="career-title">{{ selectedCompany.title }}</p>
      </div>

      <!-- Description -->
      <div class="career-description">
        <h3 class="section-heading">Description</h3>
        <div class="scroll-content">
          <p v-for="(desc, index) in selectedCompany.descriptions" :key="index">
            {{ desc }}
          </p>
        </div>
      </div>

      <!-- Achievements -->
      <div class="career-achievements">
        <h3 class="section-heading">Achievements</h3>
        <div class="scroll-content">
          <ul>
            <li v-for="(ach, index) in selectedCompany.achievements" :key="index">
              {{ ach }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Stacks -->
      <div class="career-stacks">
        <div v-for="(stack, index) in selectedCompany.stacks" :key="index" class="stack-item">
          {{ stack }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.career-root {
  display: flex;
  flex-direction: column;
  padding: 20px;
  min-height: 100vh;
  background: #fff;
  overflow-y: auto;
}

.career-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h1.career-heading {
  font-size: clamp(1.6rem, 4vw, 2.5rem);
  margin: 0;
  border-left: 4px solid #ff4d00;
  padding-left: 20px;
}

.career-nav {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: #ff4d00;
  border-radius: 24px;
}
.career-nav-item {
  padding: 6px 12px;
  font-size: 13px;
  color: #fff;
  cursor: pointer;
}
.career-nav-item.active {
  background: #fff;
  color: #ff4d00;
  border-radius: 20px;
}

.career-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 16px;
  flex: 1;
}

.career-info {
  display: flex;
  flex-wrap: wrap;
  gap: 2px 8px;
}
.career-info h2 {
  font-size: 22px;
  color: #ff4d00;
  margin: 0;
}
.career-info h2 + p {
  font-size: 12px;
  font-style: italic;
}
.career-info .career-title {
  flex-basis: 100%;
  font-size: 13px;
  font-style: italic;
}

/* Section headings */
.section-heading {
  font-size: 14px;
  font-weight: bold;
  margin: 0 0 8px;
  position: sticky;
  top: 0;
  background: inherit;
}

/* Scrollable content fills full height */
.scroll-content {
  flex: 1;
  overflow-y: auto;
}

/* Description */
.career-description {
  grid-column: 1;
  grid-row: 2;
  border: 1px solid black;
  padding: 10px;
  border-radius: 6px;
  background: rgba(0,0,0,0.02);
  font-size: 13px;
  display: flex;
  flex-direction: column;
  height: 300px; /* fixed height */
}

/* Achievements */
.career-achievements {
  grid-column: 2;
  grid-row: 2;
  border: 1px solid orange;
  padding: 10px;
  border-radius: 6px;
  background: rgba(255,165,0,0.02);
  font-size: 13px;
  display: flex;
  flex-direction: column;
  height: 300px; /* fixed height */
}
.career-achievements li {
  font-size: 13px;
  margin-bottom: 6px;
}

/* Stacks */
.career-stacks {
  grid-column: 1 / span 2;
  grid-row: 3;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px;
  border: 1px solid yellow;
  border-radius: 6px;
  background: rgba(255,255,0,0.05);
  max-height: 95px; /* ~2 rows visible */
  overflow-y: auto;
}
.stack-item {
  font-size: 12px;
  padding: 4px 8px;
  background: #f5f5f5;
  border-radius: 4px;
  white-space: nowrap;
}

@media (max-width: 1024px) {
  .career-content {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto auto;
  }
  .career-description,
  .career-achievements,
  .career-stacks {
    grid-column: 1;
    max-height: none;
    height: auto;
  }
}
</style>
