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

        // Sort so "current" comes first
        items.sort((a, b) => {
          if (a.endDate.toLowerCase() === 'current') return -1;
          if (b.endDate.toLowerCase() === 'current') return 1;
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
    <!-- Heading -->
    <h1 class="career-heading">Career History</h1>

    <!-- Career nav (red block) -->
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

    <!-- Main Content -->
    <div v-if="selectedCompany" class="career-content">
      <!-- Tab Nav (green block) -->
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
          <div class="career-info-top">
            <h2>{{ selectedCompany.title }}</h2>
            <p>{{ selectedCompany.startDate }} – {{ selectedCompany.endDate }}</p>
          </div>
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
/* Root: lock section to viewport */
.career-root {
  height: 100vh;           /* Lock height to the viewport */
  display: flex;           /* Flexbox layout */
  flex-direction: column;  /* Stack heading, nav, content vertically */
  overflow: hidden;        /* Prevent whole page scroll */
  padding: 20px;
  padding-top: 8px !important;
  background: #fff;
  box-sizing: border-box;
}

/* Heading */
.career-heading {
  color: #000;
  font-size: clamp(1.6rem, 4vw, 2.5rem);
  margin-top: 12px !important;
  margin-bottom: 32px !important;
  border-left: 4px solid #ff4d00;
  padding-left: 20px;
}

/* Career nav (red block) */
.career-nav {
  display: flex;
  gap: 6px;
  padding: 6px;
  border-radius: 0 !important;
  padding-bottom: 5px !important;
  background: #ff4d00;
}
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

/* Mobile dropdown */
.career-nav-dropdown {
  display: none;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ff4d00;
  background: #fff;
  color: #ff4d00;
  font-size: 14px;
}

/* Subnav (secondary tier) */
.career-subnav {
  background-color: #ff4d004a;
  display: flex;
  width: 100%;
  padding: 0;
  margin-top: 0;
  border-radius: 0 !important;
}
.career-subnav button {
  color: #908c8c;
  font-weight: 100;
  background: transparent;
  border: 1px solid #ff4d0031;
  transition: all 0.2s ease;
  cursor: pointer;
  padding: 2px 16px;
  margin-right: -1px;
  font-size: 0.7rem;
}
.career-subnav button:hover,
.career-subnav button.active {
  color: #ededed;
  border-bottom: 2px solid #ff4d00;
  background: #ff4d0067;
}

/* Content wrapper: fills remaining space */
.career-content {
  flex: 1;                 /* Fill vertical space */
  display: flex;
  flex-direction: column;
  min-height: 0;           /* CRITICAL: allow shrink */
  overflow: hidden;        /* contain scroll inside details */
  border-left: none !important;
  border-radius: 0 !important;
  padding: 0;
}

/* Info top */
.career-info-top {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 20px;
  font-size: 13px !important;
  padding: 20px;
}
.career-info-top h2 {
  color: #ff4d00;
  margin: 0;
  font-size: 22px;
  font-weight: 700;
}
.career-info-top p {
  font-size: 0.85rem;
  font-style: italic;
  color: #666;
  margin: 0;
}

/* Details area: scrollable inside holder */
.career-details {
  flex: 1;                 /* Fill remaining space */
  min-height: 0;           /* CRITICAL for flex scroll */
  overflow-y: auto;        /* Vertical scrollbar */
  margin-top: 0;
  padding: 0 15px 20px 20px;
  color: #444;
  font-size: 13px;
  line-height: 1.6;
}
.career-details p {
  margin-bottom: 14px;
  font-size: 13px !important;
}
.career-details li {
  margin-bottom: 10px;
  font-size: 13px !important;
}

/* Scrollbar styling */
.career-details::-webkit-scrollbar {
  width: 6px;
}
.career-details::-webkit-scrollbar-thumb {
  background-color: #ff4d00;
  border-radius: 10px;
}

/* Stack items */
.stack-list {
  padding: 10px 0;
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

/* Responsive */
@media (max-width: 768px) {
  .career-nav {
    background: none;
    border-radius: 0;
    padding: 0;
  }
  .career-nav-item {
    display: none;
  }
  .career-nav-dropdown {
    display: block;
    width: 100%;
    margin-top: 8px;
  }
  .career-subnav {
    width: 100%;
  }
}
</style>