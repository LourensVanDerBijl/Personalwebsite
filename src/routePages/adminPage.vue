<!-- src/routePages/adminPage.vue -->
<script>
export default {
  name: 'AdminPage'
}
</script>

<template>
  <main class="admin container">
    <header>
      <h1>Admin Dashboard</h1>
      <p>Manage site content and settings here.</p>
    </header>

    <section>
      <p>Admin tools and forms will go here.</p>
      <router-link to="/admin/login">Sign out / Login</router-link>
    </section>
  </main>
</template>

<style scoped>
.container { max-width: 900px; margin: 2rem auto; padding: 0 1rem; }
h1 { margin-bottom: .5rem; }
</style>
