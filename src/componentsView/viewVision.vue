<script>
export default {
  name: 'ViewVision'
};
</script>

<template>
  <div class="vision-root">
    <h1>vision</h1>
    <p>Welcome to the vision component.</p>
  </div>
</template>

<style scoped>
.vision-root {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
}

.vision-root h1 {
  font-size: 2rem;
  margin-bottom: 10px;
}

.vision-root p {
  font-size: 1.2rem;
  color: #333;
}
</style>
