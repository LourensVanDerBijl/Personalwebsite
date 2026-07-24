<script>
import { ref, onMounted } from 'vue';
import { db } from '../firebase/index.js';
import { doc, getDoc } from 'firebase/firestore';

import ViewNavbar from '../componentsView/viewNavbar.vue';
import ViewHome from '../componentsView/viewHome.vue';
import ViewInfo from '../componentsView/viewInfo.vue';
import ViewCareer from '../componentsView/viewCareer.vue';
import ViewEducation from '../componentsView/viewEducation.vue';
import ViewCertification from '../componentsView/viewCertification.vue';
import ViewSkills from '../componentsView/viewSkills.vue';
import ViewVision from '../componentsView/viewVision.vue';

export default {
  name: 'ViewPage',
  components: { 
    ViewNavbar,
    ViewHome,
    ViewInfo,
    ViewCareer,
    ViewEducation,
    ViewCertification,
    ViewSkills,
    ViewVision
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
  <div class="view-page-root">
    <ViewNavbar :activeSection="activeSection" />

    <main class="page" role="main" aria-label="Main content">
      <div class="componentHolder" id="home"><ViewHome /></div>
      <div class="componentHolder" id="info"><ViewInfo /></div>
      <div class="componentHolder" id="career"><ViewCareer /></div>
      <div class="componentHolder" id="education"><ViewEducation /></div>
      <div class="componentHolder" id="certificates"><ViewCertification /></div>
      <div class="componentHolder" id="skills" style="background-color: black;"><ViewSkills /></div>
      <div class="componentHolder" id="vision"><ViewVision /></div>

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
.view-page-root {
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
  justify-content: space-between; /* pushes update to far right */
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
  box-shadow: 0 0 6px #28a745, 0 0 12px #28a745; /* glowing effect */
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

/* Mobile view adjustments */
@media (max-width: 768px) {
  .page {
    margin-left: 0;
    margin-top: 54px;
  }
  .componentHolder {
    width: 100%;
    margin: 0;
    border-radius: 0;
    height: auto;
    min-height: 100vh;
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
  flex-wrap: wrap; /* allow wrapping on small screens */
}

.status {
  display: flex;
  gap: 20px;
  flex: 1; /* pushes update to the right */
  flex-wrap: wrap; /* wrap status items if too long */
}

.update {
  font-style: italic;
  color: #ccc;
  white-space: nowrap; /* keep it on one line */
}
}
</style>
