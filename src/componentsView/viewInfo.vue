<script>
import { onMounted, ref } from 'vue';
import { db } from '../firebase/index.js';
import { doc, getDoc } from 'firebase/firestore';

export default {
  name: 'ViewInfo',
  setup() {
    const paragraphOne = ref('');
    const paragraphTwo = ref('');
    const paragraphThree = ref('');
    const paragraphFour = ref('');
    const paragraphFive = ref('');

    onMounted(async () => {
      try {
        const docRef = doc(db, 'views', 'info');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          paragraphOne.value = data.paragraphOne || '';
          paragraphTwo.value = data.paragraphTwo || '';
          paragraphThree.value = data.paragraphThree || '';
          paragraphFour.value = data.paragraphFour || '';
          paragraphFive.value = data.paragraphFive || '';
        } else {
          console.warn('No such document!');
        }
      } catch (error) {
        console.error('Error fetching Firestore data:', error);
      }
    });

    return { paragraphOne, paragraphTwo, paragraphThree, paragraphFour, paragraphFive };
  }
};
</script>

<template>
  <div id="info">
    <section class="info-root">
      <!-- Glowing Icon (desktop only) -->
      <div class="info-icon-container">
        <div class="glow-circle"></div>
        <div class="info-letter">i</div>
      </div>

      <!-- Text Column -->
      <div class="info-text-column">
        <h1>ABOUT ME</h1>
        <div class="info-content-wrapper">
          <div class="info-content">
            <p>{{ paragraphOne }}</p>
            <p>{{ paragraphTwo }}</p>
            <p>{{ paragraphThree }}</p>
            <p>{{ paragraphFour }}</p>
            <p>{{ paragraphFive }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Parent container */
div#info {
  position: relative;
  width: 100vw;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  height: 100vh;
  padding: 0;
  background-color: #0a0b0d;
  overflow: hidden;
}

/* Section: desktop centering */
section.info-root {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  transform: translateY(-50%);
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  padding-left: 5%;
  padding-right: 5%;
  margin: 0;
  background-color: #0a0b0d;
  box-sizing: border-box;
}

/* Icon */
.info-icon-container {
  grid-column: 1;
  justify-self: start;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 450px;
  width: 450px;
}

.glow-circle {
  position: absolute;
  width: 350px;
  height: 350px;
  border: 6px solid #ff4d00;
  border-radius: 50%;
  box-shadow: 0 0 30px rgba(255, 77, 0, 0.6),
              inset 0 0 20px rgba(255, 77, 0, 0.4);
  animation: pulse-glow 3s infinite ease-in-out;
}

.info-letter {
  font-family: serif;
  font-size: 200px;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.8),
               0 0 40px #ff4d00;
}

/* Text column */
.info-text-column {
  grid-column: 3;
  justify-self: end;
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
}

.info-text-column h1 {
  font-size: clamp(1.8rem, 4vw, 3rem);
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-left: 4px solid #ff4d00;
  padding-left: 24px;
  margin-bottom: 20px;
  flex-shrink: 0;
}

/* Content wrapper */
.info-content-wrapper {
  position: relative;
  flex: 1;
  width: 100%;
}

/* REMOVE fade-out effect */
.info-content-wrapper::after {
  display: none !important;
}

/* Scrollable content */
.info-content {
  background: rgba(255, 255, 255, 0.02);
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 60vh;
}

/* Paragraphs */
.info-content-wrapper p,
.info-content-wrapper div {
  font-size: clamp(0.85rem, 1.1vw, 1rem);
  line-height: 1.6;
  margin-bottom: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  text-align: left;
  word-break: break-word;
}

/* Scrollbar styles */
.info-content::-webkit-scrollbar,
.info-content-wrapper::-webkit-scrollbar {
  width: 4px;
}
.info-content::-webkit-scrollbar-track,
.info-content-wrapper::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}
.info-content::-webkit-scrollbar-thumb,
.info-content-wrapper::-webkit-scrollbar-thumb {
  background: #ff4d00;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(255, 77, 0, 0.5);
}

/* Mobile adjustments */
@media (max-width: 768px) {
  /* Remove icon completely */
  .info-icon-container {
    display: none !important;
  }

  section.info-root {
    top: 0 !important;
    transform: none !important;
    position: relative !important;
    display: flex;
    flex-direction: column;
    padding: 20px;
    height: 100vh; /* fill parent */
  }

  .info-text-column {
    flex: 1;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    height: 100%; /* consume full parent */
  }

  .info-text-column h1 {
    font-size: clamp(1.5rem, 6vw, 2.2rem);
    margin-bottom: 16px;
  }

  .info-content-wrapper {
    flex: 1;
    height: 100%; /* take full remaining space */
    overflow-y: auto !important;
    padding-right: 10px;
  }

  .info-content {
    flex: 1;
    max-height: none;
  }
}
</style>
