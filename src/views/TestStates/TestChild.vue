<script setup>
import { FRUITS } from './testScript';
import { ref } from 'vue';

const newFruit = ref('');
const props = defineProps({
    title: String
})

function addFruit() {
    FRUITS.add(newFruit.value)
    newFruit = ''
}

</script>

<template>
    <h1>{{ props.title }}</h1>
    <InputText v-model="newFruit" @keyup.enter="addFruit()"></InputText>
    <Button label="Add" @click="FRUITS.add(newFruit)" />
</template>

<style scoped></style>