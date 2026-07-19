<script>
export default {
  name: 'ViewSkills'
};
</script>

<template>
  <div class="skills-root">
    <h1>skills</h1>
    <p>Welcome to the skills component.</p>
  </div>
</template>

<style scoped>
.skills-root {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
}

.skills-root h1 {
  font-size: 2rem;
  margin-bottom: 10px;
}

.skills-root p {
  font-size: 1.2rem;
  color: #333;
}
</style>
