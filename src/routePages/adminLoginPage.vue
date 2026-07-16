<!-- src/routePages/adminLoginPage.vue -->
<script>
export default {
  name: 'AdminLoginPage'
}
</script>

<template>
  <main class="login container">
    <header>
      <h1>Admin Login</h1>
      <p>Sign in to access the admin dashboard.</p>
    </header>

    <section>
      <form @submit.prevent>
        <label>
          Email
          <input type="email" name="email" autocomplete="username" />
        </label>

        <label>
          Password
          <input type="password" name="password" autocomplete="current-password" />
        </label>

        <div class="actions">
          <button type="submit">Sign in</button>
          <router-link to="/">Back to site</router-link>
        </div>
      </form>
    </section>
  </main>
</template>

<style scoped>
.container { max-width: 420px; margin: 2rem auto; padding: 0 1rem; }
form { display: grid; gap: .75rem; }
label { display: flex; flex-direction: column; font-size: .95rem; }
input { padding: .5rem; border-radius: 4px; border: 1px solid #333; background: #0b0b0b; color: #fff; }
.actions { display:flex; gap:.5rem; align-items:center; margin-top:.5rem; }
button { padding:.5rem 1rem; border-radius:4px; cursor:pointer; }
</style>
