<script>
import { onMounted, ref } from 'vue';
import { db } from '../firebase/index.js';
import { doc, getDoc } from 'firebase/firestore';

export default {
  name: 'ViewHome',
  setup() {
    const name = ref('');
    const tagline = ref('');
    const subtitle = ref('');

    onMounted(async () => {
      try {
        const docRef = doc(db, 'views', 'home');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          name.value = data.name || '';
          tagline.value = data.tagline || '';
          subtitle.value = data.subtitle || '';
        } else {
          console.warn('No such document!');
        }
      } catch (error) {
        console.error('Error fetching Firestore data:', error);
      }
    });

    const openLink = (url) => {
      window.open(url, '_blank');
    };

    const sendEmail = (service) => {
      if (service === 'outlook') {
        window.location.href = 'mailto:lourensvdbijl@gmail.com';
      } else if (service === 'gmail') {
        window.open(
          'https://mail.google.com/mail/?view=cm&fs=1&to=lourensvdbijl@gmail.com',
          '_blank'
        );
      }
    };

    return { name, tagline, subtitle, openLink, sendEmail };
  }
};
</script>

<template>
  <section class="home-root">
    <!-- Left Column: Content -->
    <div class="hero-content-left">
      <p class="tagline">{{ tagline }}</p>
      <h1 class="name">{{ name }}</h1>
      <h2 class="subtitle">{{ subtitle }}</h2>

      <div class="buttons">
        <button class="btn-secondary" @click="openLink('https://www.linkedin.com/in/louis-van-der-bijl-453a6a19b')">Connect</button>
        <button class="btn-secondary" @click="sendEmail('outlook')">Email-Outlook</button>
        <button class="btn-secondary" @click="sendEmail('gmail')">Email-Gmail</button>
        <button class="btn-secondary" @click="openLink('https://github.com/LourensVanDerBijl?tab=repositories')">GitHub</button>
        <button class="btn-secondary" @click="openLink('https://drive.google.com/uc?export=download&id=19CdvvQBIcg4fshYY4nssQ_fnZuQxy_PH')">Download CV</button>
        <button class="btn-secondary" @click="openLink('https://drive.google.com/uc?export=download&id=1jIdYOqDQQ2qIo71m9h2MzPwBnVdIRT54')">Download WD Transcript</button>
      </div>
    </div>

    <!-- Right Column: Visual -->
    <div class="hero-image-right">
      <img src="../assets/images/viewHome.png" alt="Hero Visual" class="hero-image" />
    </div>
  </section>
</template>

<style scoped>
.home-root {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  width: 100%;
  margin: 0;
  padding-left: 60px;     /* gap from sidebar */
  column-gap: 80px;       /* space between text and image */
  background-color: transparent;
}

.hero-content-left {
  padding-left: 20px;     /* internal breathing room */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.tagline {
  font-size: 1rem;
  color: #ff8c3c;
  text-shadow: 
    0 0 8px rgba(255, 140, 60, 0.8), 
    0 0 12px rgba(255, 140, 60, 0.4);
  margin-bottom: 10px;
}

.name {
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 700;
  margin: 0;
  color: #111827;
}

.subtitle {
  font-size: clamp(0.8rem, 2.2vw, 0.95rem);
  color: #888;
  margin-top: 40px;
  font-style: italic;
  max-width: 800px;
  line-height: 1.5;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 40px;
  justify-content: flex-start;
}

.buttons button {
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  min-width: 70px;
  border-radius: 3px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-sizing: border-box;

  background-color: #000000;
  color: #ffffff;
  border: 1px solid #ffffff;
}

.buttons button:hover {
  background-color: #000;
  color: #ffffff;
  border-color: #ff8c3c;
  text-shadow: 
    0 0 6px rgba(255, 140, 60, 1),
    0 0 12px rgba(255, 95, 31, 0.9),
    0 0 18px rgba(255, 140, 60, 0.8);
  box-shadow: 
    0 0 6px rgba(255, 140, 60, 1),
    0 0 12px rgba(255, 95, 31, 0.9),
    0 0 18px rgba(255, 140, 60, 0.8);
}

.hero-image-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.hero-image {
  max-height: 100vh;
  width: auto;
  object-fit: contain;
}

/* Mobile view adjustments */
@media (max-width: 768px) {
  .home-root {
    grid-template-columns: 1fr;
    height: auto;
    max-height: none;
    overflow: visible;
    padding-left: 0;       /* reset sidebar gap */
    column-gap: 0;         /* no column gap */
    justify-items: center; /* center content horizontally */
  }

  .hero-image-right {
    display: none;
  }

  .hero-content-left {
    padding: 40px 8%;
    align-items: center;
    text-align: center;
    justify-content: center; /* center vertically */
  }

  .buttons {
    justify-content: center;
  }

  .buttons button {
    font-size: 14px;
    padding: 8px 14px;
  }
}
</style>
