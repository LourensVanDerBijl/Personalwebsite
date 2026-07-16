<script>
import ViewNavbar from '../componentsView/viewNavbar.vue';

export default {
  name: 'ViewPage',
  components: { ViewNavbar },
  mounted() {
    const sections = document.querySelectorAll('.componentHolder');
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const id = section.getAttribute('id');

        // If we've scrolled past this section, mark its link active
        if (scrollPos >= sectionTop - 60) {
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    });
  }
};
</script>

<template>
  <div class="view-page-root">
    <ViewNavbar />

    <main class="page" role="main" aria-label="Main content">
      <div class="componentHolder" id="home">
        <h1>Home</h1>
        <p>Welcome to the public view of your PersonalWebsite.</p>
      </div>

      <div class="componentHolder" id="contact">
        <h2>Contact</h2>
        <p>Contact details or a contact form can go here.</p>
      </div>

      <div class="componentHolder" id="about">
        <h2>About</h2>
        <p>Replace this with your About / Hero content.</p>
      </div>

      <div class="componentHolder" id="career">
        <h2>Career</h2>
        <p>Career details go here.</p>
      </div>

      <div class="componentHolder" id="education">
        <h2>Education</h2>
        <p>Education details go here.</p>
      </div>

      <div class="componentHolder" id="certificates">
        <h2>Certificates</h2>
        <p>List or link to certificates here.</p>
      </div>

      <div class="componentHolder" id="skills">
        <h2>Skills</h2>
        <p>Skills list goes here.</p>
      </div>

      <div class="componentHolder" id="vision">
        <h2>Vision</h2>
        <p>Vision and goals go here.</p>
      </div>

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
  margin-left: 54px; /* match sidebar width */
  padding: 0;
  min-height: 100vh;
  background-color: #ffffff;
  color: #000000;
  box-sizing: border-box;
}

.componentHolder {
  background: rgb(224, 224, 224);
  width: calc(100% - 30px);
  height: calc(100vh - 30px);
  margin: 15px auto;
  padding: 15px;
  overflow-y: auto;
  box-sizing: border-box;
  border-radius: 8px;
}

.componentHolder h1 {
  margin: 0 0 8px 0;
  font-size: 1.8rem;
  color: #000000;
}
.componentHolder h2 {
  margin: 0 0 8px 0;
  font-size: 1.25rem;
  color: #000000;
}

.page-footer {
  margin-top: 15px;
  padding-top: 12px;
  border-top: 1px solid rgba(0,0,0,0.06);
}

@media (max-width: 480px) {
  .componentHolder {
    width: calc(100% - 30px);
    height: calc(100vh - 30px);
    padding: 12px;
  }
}
</style>
