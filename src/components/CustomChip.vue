<script setup>
const props = defineProps({
    label: String,
    editable: {
        type: Boolean,
        default: true,
        required: false
    }
})
</script>

<template>
    <Tag :label="props.label" class="custom-background" rounded severity="secondary">
        <p>{{ props.label }}</p>
        <span v-if="props.editable" @click="$emit('customRemove')" class="pi pi-times-circle"></span>
    </Tag>
</template>

<style scoped>
span:hover {
    cursor: pointer;
}

.custom-background {
    background-color: var(--p-surface-600);
    margin: 4px;
}
</style>