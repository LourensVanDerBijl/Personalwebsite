<script>
import { ref, onMounted } from 'vue';
import { db } from '../firebase/index.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default {
  name: 'ViewHomeAdmin',
  setup() {
    const name = ref('');
    const tagline = ref('');
    const subtitle = ref('');
    const linkedin = ref('');
    const email = ref('');
    const github = ref('');
    const cvLink = ref('');
    const transcriptLink = ref('');
    const message = ref('');

    onMounted(async () => {
      const docRef = doc(db, 'views', 'home');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        name.value = data.name || '';
        tagline.value = data.tagline || '';
        subtitle.value = data.subtitle || '';
        linkedin.value = data.linkedIn || '';
        email.value = data.email || '';
        github.value = data.gitHub || '';
        cvLink.value = data.cvLink || 'https://drive.google.com/drive/my-drive';
        transcriptLink.value = data.transcriptLink || 'https://drive.google.com/drive/my-drive';
      }
    });

    const saveChanges = async () => {
      try {
        // Save Home fields
        const docRef = doc(db, 'views', 'home');
        await setDoc(docRef, {
          name: name.value,
          tagline: tagline.value,
          subtitle: subtitle.value,
          linkedIn: linkedin.value,
          email: email.value,
          gitHub: github.value,
          cvLink: cvLink.value,
          transcriptLink: transcriptLink.value
        });

        // Update the UpdateDate document
        const today = new Date();
        const formattedDate = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
        const updateRef = doc(db, 'UpdateDate', 'UpdateDate');
        await setDoc(updateRef, { Date: formattedDate });

        message.value = '✅ Changes saved successfully!';
      } catch (error) {
        console.error(error);
        message.value = '❌ Error saving changes.';
      }
    };

    const openLink = (url) => {
      window.open(url, '_blank');
    };

    return { name, tagline, subtitle, linkedin, email, github, cvLink, transcriptLink, message, saveChanges, openLink };
  }
};
</script>


<template>
  <section class="home-root scrollable">
    <h2 class="section-title">Home – Admin Edit</h2>

    <div class="content-grid">
      <!-- Left Column -->
      <div class="form-column">
        <form class="admin-form" @submit.prevent="saveChanges">
          <label>Tagline:
            <input v-model="tagline" type="text" />
          </label>

          <label>Name:
            <input v-model="name" type="text" />
          </label>

          <label>Subtitle:
            <textarea v-model="subtitle"></textarea>
          </label>

          <label>Email:
            <input v-model="email" type="email" />
          </label>

          <button type="submit" class="btn-save">Save Changes</button>
        </form>
      </div>

      <!-- Right Column -->
      <div class="form-column">
        <form class="admin-form" @submit.prevent="saveChanges">
          <label>LinkedIn URL:
            <input v-model="linkedin" type="text" />
          </label>

          <label>GitHub URL:
            <input v-model="github" type="text" />
          </label>

          <div class="drive-block">
            <p>Locate your CV file in Google Drive and update the version there. The link remains the same.</p>
            <button type="button" class="btn-drive" @click="openLink(cvLink)">Open Google Drive (CV)</button>
          </div>

          <div class="drive-block">
            <p>Locate your Workday Transcript in Google Drive and update the version there. The link remains the same.</p>
            <button type="button" class="btn-drive" @click="openLink(transcriptLink)">Open Google Drive (Transcript)</button>
          </div>
        </form>
      </div>
    </div>

    <p v-if="message" class="status-message">{{ message }}</p>
  </section>
</template>

<style scoped>
.home-root {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: #fff;
  color: #000;
  padding: 20px 40px;
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
  background: #f1f1f1;
}
.scrollable {
  scrollbar-color: #ff4d00 #f1f1f1;
  scrollbar-width: thin;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 20px;
  border-left: 4px solid #ff4d00;
  padding-left: 12px;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  flex: 1;
}

.form-column {
  display: flex;
  flex-direction: column;
}

.admin-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.admin-form label {
  display: flex;
  flex-direction: column;
  color: #000;
  font-size: 0.95rem;
}

.admin-form input,
.admin-form textarea {
  padding: 0.8rem;
  border-radius: 6px;
  border: 1px solid #ff4d00;
  background: #f9f9f9;
  color: #000;
  margin-top: 6px;
  font-size: 0.95rem;
}

.admin-form textarea {
  min-height: 120px;
}

.btn-save {
  background: #ff4d00;
  color: #fff;
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
}
.btn-save:hover {
  background: #e63c00;
}

.drive-block {
  margin-top: 16px;
  font-size: 0.85rem;
  color: #333;
}
.btn-drive {
  background: #ff4d00;
  color: #fff;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  margin-top: 6px;
}
.btn-drive:hover {
  background: #e63c00;
}

.status-message {
  margin-top: 12px;
  font-size: 0.9rem;
  color: #ff4d00;
}
</style>
