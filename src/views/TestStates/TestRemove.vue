<script setup>
import { FRUITS } from './testScript';
import CustomChip from '@/components/CustomChip.vue';
import { ref } from 'vue';

const props = defineProps({
    title: String
})

function removeFruit(fruit) {
    FRUITS.remove(fruit)
}

</script>

<template>
    <h1>{{ props.title }}</h1>
    <CustomChip v-for="(fruit, _) in FRUITS.value" :label="fruit" @custom-remove="removeFruit(fruit)" />

</template>

<style scoped></style>