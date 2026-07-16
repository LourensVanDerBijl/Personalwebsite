<script>
import homeIcon from '../assets/SvgIcons/home.svg';
import contactIcon from '../assets/SvgIcons/contact.svg';
import careerIcon from '../assets/SvgIcons/career.svg';
import educationIcon from '../assets/SvgIcons/education.svg';
import certificatesIcon from '../assets/SvgIcons/certificates.svg';
import skillsIcon from '../assets/SvgIcons/skills.svg';
import visionIcon from '../assets/SvgIcons/vision.svg';
import loginIcon from '../assets/SvgIcons/login.svg';

export default {
  name: 'ViewNavbar',
  data() {
    return {
      icons: {
        home: homeIcon,
        contact: contactIcon,
        career: careerIcon,
        education: educationIcon,
        certificates: certificatesIcon,
        skills: skillsIcon,
        vision: visionIcon,
        login: loginIcon
      },
      sidebarWidth: '54px'
    };
  }
};
</script>

<template>
  <aside
    class="sidebar"
    :style="{ width: sidebarWidth }"
    role="navigation"
    aria-label="Main navigation"
  >
    <nav class="sidebar-inner" role="menubar" aria-orientation="vertical">
      <ul class="sidebar-nav" role="list">
        <li><a href="#home" class="nav-link"><img :src="icons.home" class="icon" alt="Home" /></a></li>
        <li><a href="#contact" class="nav-link"><img :src="icons.contact" class="icon" alt="Contact" /></a></li>
        <li><a href="#about" class="nav-link"><img :src="icons.career" class="icon" alt="Career" /></a></li>
        <li><a href="#education" class="nav-link"><img :src="icons.education" class="icon" alt="Education" /></a></li>
        <li><a href="#certificates" class="nav-link"><img :src="icons.certificates" class="icon" alt="Certificates" /></a></li>
        <li><a href="#skills" class="nav-link"><img :src="icons.skills" class="icon" alt="Skills" /></a></li>
        <li><a href="#vision" class="nav-link"><img :src="icons.vision" class="icon" alt="Vision" /></a></li>
      </ul>

      <div class="sidebar-footer">
        <a href="/login" class="nav-link login-link">
          <img :src="icons.login" class="icon" alt="Login" />
        </a>
      </div>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 54px;
  padding: 8px 6px;
  box-sizing: border-box;
  background-color: #000;
  border-right: 1px solid rgba(255,255,255,0.06);
  backdrop-filter: blur(8px) saturate(140%);
  -webkit-backdrop-filter: blur(8px) saturate(140%);
  box-shadow: 6px 0 30px rgba(0,0,0,0.45);
  z-index: 1000;
}

.sidebar-inner {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100%;
}

.sidebar-nav {
  list-style: none;
  margin: 0;
  padding: 6px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.sidebar-nav .nav-link,
.sidebar-footer .nav-link {
  display: flex;
  align-items: center;
  padding: 8px;
  color: #d1d1d1;
  text-decoration: none;
  transition: color 0.3s, background-color 0.3s;
  width: 100%;
  box-sizing: border-box;
  border-radius: 6px;
  justify-content: center;
}

.sidebar-nav .icon,
.sidebar-footer .icon {
  width: 20px;
  height: 20px;
  filter: invert(0.8);
  transition: filter 0.3s ease;
}

/* Hover and active states */
.sidebar-nav .nav-link:hover,
.sidebar-footer .nav-link:hover,
.sidebar-nav .nav-link.active {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.1);
}

.sidebar-nav .nav-link:hover .icon,
.sidebar-nav .nav-link.active .icon,
.sidebar-footer .nav-link:hover .icon {
  filter: invert(53%) sepia(97%) saturate(5458%) hue-rotate(3deg) brightness(103%) contrast(105%)
          drop-shadow(0 0 6px rgba(255, 140, 60, 0.85))
          drop-shadow(0 0 12px rgba(255, 95, 31, 0.55));
}

.sidebar-footer {
  display: flex;
  justify-content: center;
  padding-top: 8px;
}

.login-link {
  width: 100%;
  justify-content: center;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
}
</style>
