<script setup>
import RouterButtonWithIcon from '@/components/RouterButtonWithIcon.vue';
</script>

<template>
  <main>
    <h1>How to Use</h1>
    <ul>
      <li>Enter list of user names</li>
      <li>Enter item description</li>
      <li>Stuff will all be logged</li>
      <li>See the results</li>
    </ul>

    <RouterButtonWithIcon icon-name="play" route="/calculate" label="Start Calculating"></RouterButtonWithIcon>
  </main>
</template>


<style scoped></style>
