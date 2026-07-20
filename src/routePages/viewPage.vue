<script>
import { ref, onMounted } from 'vue';
import ViewNavbar from '../componentsView/viewNavbar.vue';

// Import all your section components
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
    const activeSection = ref('home'); // default section

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
    });

    return { activeSection };
  }
};
</script>

<template>
  <div class="view-page-root">
    <!-- Pass activeSection down to navbar -->
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
        <router-link to="/admin">Admin</router-link>
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
  margin-left: 54px; /* match sidebar width on desktop */
  min-height: 100vh;
  background-color: #ffffff;
  color: #000000;
  box-sizing: border-box;
  scroll-behavior: smooth;
}

.componentHolder {
  background: rgb(249, 249, 249);
  width: 100% !important;       /* full width */
  max-width: none !important;   /* remove max-width constraint */
  margin: 0 !important;         /* remove margins */
  padding: 0 !important;        /* remove padding */
  height: 100vh;                /* each section fills viewport */
  box-sizing: border-box;
  border-radius: 0;             /* no rounding */
}

.page-footer {
  margin-top: 15px;
  padding-top: 12px;
  border-top: 1px solid rgba(0,0,0,0.06);
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
}
</style>
