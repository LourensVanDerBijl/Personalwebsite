<script>
import { ref, onMounted } from 'vue';
import { db } from '../firebase/index.js';
import { doc, getDoc } from 'firebase/firestore';

import ViewNavbarAdmin from '../componentsAdmin/viewNavbarAdmin.vue';
import ViewHomeAdmin from '../componentsAdmin/viewHomeAdmin.vue';
import ViewInfoAdmin from '../componentsAdmin/viewInfoAdmin.vue';
import ViewCareerAdmin from '../componentsAdmin/viewCareerAdmin.vue';
import ViewEducationAdmin from '../componentsAdmin/viewEducationAdmin.vue';
import ViewCertificationAdmin from '../componentsAdmin/viewCertificationAdmin.vue';
import ViewSkillsAdmin from '../componentsAdmin/viewSkillsAdmin.vue';
import ViewVisionAdmin from '../componentsAdmin/viewVisionAdmin.vue';

export default {
  name: 'AdminPage',
  components: { 
    ViewNavbarAdmin,
    ViewHomeAdmin,
    ViewInfoAdmin,
    ViewCareerAdmin,
    ViewEducationAdmin,
    ViewCertificationAdmin,
    ViewSkillsAdmin,
    ViewVisionAdmin
  },
  setup() {
    const activeSection = ref('home');
    const lastUpdate = ref(null);

    onMounted(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              activeSection.value = entry.target.id;
            }
          });
        },
        { threshold: 0.5 }
      );

      document.querySelectorAll('.componentHolder').forEach((section) => {
        observer.observe(section);
      });

      // Load last update date from Firestore
      const loadUpdateDate = async () => {
        const updateDoc = await getDoc(doc(db, 'UpdateDate', 'UpdateDate'));
        if (updateDoc.exists()) {
          lastUpdate.value = updateDoc.data().Date;
        }
      };
      loadUpdateDate();
    });

    return { activeSection, lastUpdate };
  }
};
</script>

<template>
  <div class="admin-page-root">
    <ViewNavbarAdmin :activeSection="activeSection" />

    <main class="page" role="main" aria-label="Admin content">
      <div class="componentHolder" id="home"><ViewHomeAdmin /></div>
      <div class="componentHolder" id="info"><ViewInfoAdmin /></div>
      <div class="componentHolder" id="career"><ViewCareerAdmin /></div>
      <div class="componentHolder" id="education"><ViewEducationAdmin /></div>
      <div class="componentHolder" id="certificates"><ViewCertificationAdmin /></div>
      <div class="componentHolder" id="skills" style="background-color: black;"><ViewSkillsAdmin /></div>
      <div class="componentHolder" id="vision"><ViewVisionAdmin /></div>

      <footer class="page-footer">
        <div class="status">
          <span class="status-item">
            Website: <span class="dot green"></span> Live
          </span>
          <span class="status-item">
            Database: <span class="dot green"></span> Stable
          </span>
          <span class="status-item">
            Authentication: <span class="dot green"></span> Secure
          </span>
        </div>
        <div class="update">
          Last Update: {{ lastUpdate || 'Loading...' }}
        </div>
      </footer>
    </main>
  </div>
</template>

<style scoped>
.admin-page-root {
  min-height: 100vh;
  width: 100%;
  display: block;
}

.page {
  margin-left: 54px;
  min-height: 100vh;
  background-color: #ffffff;
  color: #000000;
  box-sizing: border-box;
  scroll-behavior: smooth;
}

.componentHolder {
  background: rgb(249, 249, 249);
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  padding: 0 !important;
  height: 100vh;
  box-sizing: border-box;
  border-radius: 0;
}

.page-footer {
  margin-top: 15px;
  padding: 12px 20px;
  border-top: 1px solid rgba(0,0,0,0.06);
  background-color: #000;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.status {
  display: flex;
  gap: 20px;
}
.status-item {
  display: flex;
  align-items: center;
  gap: 6px;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}
.dot.green {
  background-color: #28a745;
  box-shadow: 0 0 6px #28a745, 0 0 12px #28a745;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 4px #28a745, 0 0 8px #28a745; }
  50% { box-shadow: 0 0 8px #28a745, 0 0 16px #28a745; }
  100% { box-shadow: 0 0 4px #28a745, 0 0 8px #28a745; }
}

.update {
  font-style: italic;
  color: #ccc;
}
</style>
