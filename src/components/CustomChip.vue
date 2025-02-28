<script setup>
const props = defineProps({
    label: String,
})
</script>

<template>
    <Chip :label="props.label">
        <p>{{ props.label }}</p>
        <span @click="$emit('customRemove')" class="pi pi-times-circle"></span>
    </Chip>
</template>

<style scoped></style>