<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase"; // adjust path if needed

const router = useRouter();
const errorMessage = ref("");

async function handleGoogleLogin() {
  try {
    await signInWithPopup(auth, googleProvider);
    router.push("/admin"); // redirect after success
  } catch (error) {
    errorMessage.value = error.message;
  }
}
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="modal-close" @click="$emit('close')">×</button>

      <div class="modal-body">
        <!-- Warning text -->
        <div class="modal-warning">
          <h2>Authorise Access Only</h2>
          <p>
            This section is strictly for website administration.  
            It is used to update details and manage content.  
            This is not part of the public website experience.
          </p>
        </div>

        <!-- Google SSO Button -->
        <div class="modal-actions">
          <button type="button" class="btn-sso" @click="handleGoogleLogin">
            Sign in with Google SSO
          </button>
          <button type="button" class="btn-cancel" @click="$emit('close')">
            Cancel
          </button>
        </div>

        <!-- Error Message -->
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(10, 11, 13, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background: #0a0b0d;
  border: 2px solid #ff4d00;
  border-radius: 8px;
  padding: 20px;
  width: 400px;
  max-width: 95%;
  color: #fff;
  box-shadow: 0 0 20px rgba(255, 77, 0, 0.6);
  position: relative;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 14px;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #ff4d00;
  cursor: pointer;
}

.modal-body { margin-top: 40px; }

/* Glowing red warning text */
.modal-warning {
  border: 1px solid #ff1e1e;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 20px;
  background: rgba(255, 30, 30, 0.1);
  box-shadow: 0 0 12px rgba(255, 30, 30, 0.7);
}
.modal-warning h2 {
  color: #ff1e1e;
  text-shadow: 0 0 8px rgba(255, 30, 30, 0.8);
  margin-bottom: 8px;
}
.modal-warning p {
  color: rgba(255, 200, 200, 0.9);
  font-size: 13px;
  line-height: 1.5;
}

/* Buttons */
.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.btn-sso {
  background: #ff4d00;
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
  flex: 1;
  margin-right: 10px;
}
.btn-sso:hover { background: #e63c00; }
.btn-cancel {
  background: transparent;
  color: #ff4d00;
  border: 1px solid #ff4d00;
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
}
.btn-cancel:hover { background: rgba(255, 77, 0, 0.1); }

.error {
  margin-top: 1rem;
  color: #ff4b2b;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
  .modal-content { width: 95%; }
}
</style>
