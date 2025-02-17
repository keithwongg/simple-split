<template>
  <div class="about">
    <h1>This is an about page</h1>
    <Knob v-model="value" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
const value = ref(10)
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
