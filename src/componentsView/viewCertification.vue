<script>
export default {
  name: 'ViewCertification'
};
</script>

<template>
  <div class="certification-root">
    <h1>certification</h1>
    <p>Welcome to the certification component.</p>
  </div>
</template>

<style scoped>
.certification-root {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
}

.certification-root h1 {
  font-size: 2rem;
  margin-bottom: 10px;
}

.certification-root p {
  font-size: 1.2rem;
  color: #333;
}
</style>
