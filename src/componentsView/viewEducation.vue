<script>
export default {
  name: 'ViewEducation'
};
</script>

<template>
  <div class="education-root">
    <h1>education</h1>
    <p>Welcome to the education component.</p>
  </div>
</template>

<style scoped>
.education-root {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
}

.education-root h1 {
  font-size: 2rem;
  margin-bottom: 10px;
}

.education-root p {
  font-size: 1.2rem;
  color: #333;
}
</style>
