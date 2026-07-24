<script>
import { onMounted, ref } from 'vue';
import { db } from '../firebase/index.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default {
  name: 'ViewInfoAdmin',
  setup() {
    const paragraphOne = ref('');
    const paragraphTwo = ref('');
    const paragraphThree = ref('');
    const paragraphFour = ref('');
    const paragraphFive = ref('');
    const message = ref('');

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
        }
      } catch (error) {
        console.error('Error fetching Firestore data:', error);
      }
    });

    const saveChanges = async () => {
      try {
        // Save Info paragraphs
        const docRef = doc(db, 'views', 'info');
        await setDoc(docRef, {
          paragraphOne: paragraphOne.value,
          paragraphTwo: paragraphTwo.value,
          paragraphThree: paragraphThree.value,
          paragraphFour: paragraphFour.value,
          paragraphFive: paragraphFive.value
        });

        // Update the UpdateDate document
        const today = new Date();
        const formattedDate = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
        const updateRef = doc(db, 'UpdateDate', 'UpdateDate');
        await setDoc(updateRef, { Date: formattedDate });

        message.value = '✅ Changes saved successfully!';
      } catch (error) {
        console.error('Error saving Firestore data:', error);
        message.value = '❌ Error saving changes.';
      }
    };

    return { paragraphOne, paragraphTwo, paragraphThree, paragraphFour, paragraphFive, message, saveChanges };
  }
};
</script>

<template>
  <section class="info-root scrollable">
    <h2 class="section-title">Info – Admin Edit</h2>

    <form class="info-form" @submit.prevent="saveChanges">
      <label>Paragraph One:
        <textarea v-model="paragraphOne"></textarea>
      </label>
      <label>Paragraph Two:
        <textarea v-model="paragraphTwo"></textarea>
      </label>
      <label>Paragraph Three:
        <textarea v-model="paragraphThree"></textarea>
      </label>
      <label>Paragraph Four:
        <textarea v-model="paragraphFour"></textarea>
      </label>
      <label>Paragraph Five:
        <textarea v-model="paragraphFive"></textarea>
      </label>

      <button type="submit" class="btn-save">Save Changes</button>
    </form>

    <p v-if="message" class="status-message">{{ message }}</p>
  </section>
</template>

<style scoped>
.info-root {
  display: flex;
  flex-direction: column;
  height: 100%; /* fit inside componentHolder */
  width: 100%;
  background-color: #0a0b0d;
  color: #fff;
  padding: 30px 40px;
  box-sizing: border-box;
}

.scrollable {
  overflow-y: auto;
}

/* Orange scrollbar */
.scrollable::-webkit-scrollbar {
  width: 8px;
}
.scrollable::-webkit-scrollbar-thumb {
  background: #ff4d00;
  border-radius: 4px;
}
.scrollable::-webkit-scrollbar-track {
  background: #1a1a1a;
}
.scrollable {
  scrollbar-color: #ff4d00 #1a1a1a;
  scrollbar-width: thin;
}

.section-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 20px;
  border-left: 4px solid #ff4d00;
  padding-left: 12px;
}

.info-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.info-form label {
  color: #ccc;
  font-size: 0.95rem;
  display: flex;
  flex-direction: column;
}

.info-form textarea {
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #ff4d00;
  background: #0a0b0d;
  color: #fff;
  margin-top: 6px;
  min-height: 140px; /* bigger for paragraphs */
  font-size: 0.95rem;
  line-height: 1.4;
}

.btn-save {
  background: #ff4d00;
  color: #fff;
  border: none;
  padding: 0.9rem 1.4rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  margin-top: 10px;
}
.btn-save:hover {
  background: #e63c00;
}

.status-message {
  margin-top: 12px;
  font-size: 0.9rem;
  color: #ff8c3c;
}
</style>
