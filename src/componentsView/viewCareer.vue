<script>
import { ref, onMounted } from 'vue';
import { db } from '../firebase/index.js';
import { collection, getDocs } from 'firebase/firestore';

export default {
  name: 'ViewCareer',
  setup() {
    const companies = ref([]);
    const selectedCompany = ref(null);
    const activeTab = ref('description');

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
      activeTab.value = 'description';
    };

    const selectTab = (tab) => {
      activeTab.value = tab;
    };

    onMounted(loadCareerHistory);

    return { companies, selectedCompany, activeTab, selectCompany, selectTab };
  }
};
</script>

<template>
  <div class="career-root">
    <!-- Header row: heading left, nav right -->
    <div class="career-header-row">
      <h1 class="career-heading">Career History</h1>
      <div class="career-nav">
        <!-- Desktop pill nav -->
        <div
          v-for="company in companies"
          :key="company.id"
          class="career-nav-item"
          :class="{ active: selectedCompany && selectedCompany.id === company.id }"
          @click="selectCompany(company)"
        >
          {{ company.company }}
        </div>

        <!-- Mobile dropdown -->
        <select
          class="career-nav-dropdown"
          v-model="selectedCompany"
          @change="selectCompany(selectedCompany)"
        >
          <option v-for="company in companies" :key="company.id" :value="company">
            {{ company.company }}
          </option>
        </select>
      </div>
    </div>

    <!-- Main Content -->
    <div v-if="selectedCompany" class="career-content">
      <!-- Company Info -->
      <div class="career-info">
        <div class="career-info-top">
          <h2>{{ selectedCompany.company }}</h2>
          <p>{{ selectedCompany.startDate }} - {{ selectedCompany.endDate }}</p>
        </div>
        <p class="career-title">{{ selectedCompany.title }}</p>
      </div>

      <!-- Tab Nav -->
      <div class="career-subnav">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'description' }"
          @click="selectTab('description')"
        >
          Description
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'achievements' }"
          @click="selectTab('achievements')"
        >
          Achievements
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'stacks' }"
          @click="selectTab('stacks')"
        >
          Stack
        </button>
      </div>

      <!-- Scrollable Content Area -->
      <div class="career-details">
        <div v-if="activeTab === 'description'">
          <p v-for="(desc, index) in selectedCompany.descriptions" :key="index">
            {{ desc }}
          </p>
        </div>

        <div v-if="activeTab === 'achievements'">
          <ul>
            <li v-for="(ach, index) in selectedCompany.achievements" :key="index">
              {{ ach }}
            </li>
          </ul>
        </div>

        <div v-if="activeTab === 'stacks'" class="stack-list">
          <div v-for="(stack, index) in selectedCompany.stacks" :key="index" class="stack-item">
            {{ stack }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Root */
.career-root {
  display: flex;
  flex-direction: column;
  padding: 20px;
  min-height: 100vh;
  background: #fff;
}

/* Header row: heading left, nav right */
.career-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.career-heading {
  color: #000000;
  font-size: clamp(1.6rem, 4vw, 2.5rem);
  margin: 0;
  border-left: 4px solid #ff4d00;
  padding-left: 20px;
}

.career-nav {
  display: flex;
  gap: 6px;
  padding: 6px;
  background: #ff4d00;
  border-radius: 24px;
}

/* Desktop pill nav items */
.career-nav-item {
  padding: 6px 14px;
  font-size: 13px;
  color: #fff;
  cursor: pointer;
}
.career-nav-item.active {
  background: #fff;
  color: #ff4d00;
  border-radius: 20px;
}

/* Mobile dropdown (hidden by default) */
.career-nav-dropdown {
  display: none;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ff4d00;
  background: #fff;
  color: #ff4d00;
  font-size: 14px;
}

/* Main content container */
.career-content {
  margin-top: 30px;
  height: calc(100vh - 160px);
  max-height: calc(100vh - 160px);
  display: flex;
  flex-direction: column;
  background-color: #ffffff00;
  border: 1px solid #e0e0e000;
  border-left: 4px solid #ff4d00;
  border-radius: 6px;
  padding: 28px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0);
}

.career-info {
  padding-bottom: 12px;
  border-bottom: 1px solid #d5d3d200;
  margin-bottom: 20px;
}

/* Company info */
.career-info-top {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 8px;
}
.career-info h2 {
  color: #ff4d00;
  margin: 0;
  font-size: 20px;
}
.career-info p:not(.career-title) {
  font-size: 0.8rem;
  font-style: italic;
  color: #666;
  margin: 0;
}
.career-info .career-title {
  font-size: 0.85rem;
  font-style: italic;
  margin: 0 0 16px 0;
}

/* Subnav tabs */
.career-subnav {
  display: flex;
  gap: 10px;
  background-color: #f4f2f2;
  border: 1px solid #ff5100;
  border-left: none;
  border-right: none;
  padding: 6px 12px;
  margin-bottom: 20px;
}
.career-subnav button {
  color: #666666;
  font-weight: 600;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  cursor: pointer;
  padding: 6px 0;
  margin-right: 20px;
  font-size: 0.9rem;
}
.career-subnav button:hover,
.career-subnav button.active {
  color: #ff4d00;
  border-bottom: 2px solid #ff4d00;
}

/* Scrollable details area */
.career-details {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 15px;
  color: #444444;
  font-size: 0.85rem;
  line-height: 1.6;
  border-top: none;
  border-left: none;
  padding: 24px;
}
.career-details p {
  margin-bottom: 14px;
}
.career-details li {
  margin-bottom: 10px;
}
.career-details::-webkit-scrollbar {
  width: 6px;
}
.career-details::-webkit-scrollbar-thumb {
  background-color: #ff4d00;
  border-radius: 10px;
}
.career-details::-webkit-scrollbar-thumb:hover {
  background-color: #ff4d00;
}

/* Stack items */
.stack-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.stack-item {
  font-size: 0.8rem;
  padding: 4px 10px;
  background: #f25f207f;
  border-radius: 4px;
  white-space: nowrap;
}

/* Responsive: swap pill nav for dropdown */
@media (max-width: 768px) {
  .career-nav {
    background: none;
    border-radius: 0;
    padding: 0;
  }
  .career-nav-item {
    display: none; /* hide pills */
  }
  .career-nav-dropdown {
    display: block; /* show dropdown */
    width: 100%;
    margin-top: 8px;
  }
}
</style>
