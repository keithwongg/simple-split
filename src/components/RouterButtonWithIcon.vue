<script setup>
import { ref, defineProps } from 'vue'
const props = defineProps({
    route: String,
    iconName: String,
    label: String
})

const iconClass = ref(`pi pi-${props.iconName}`)
</script>

<template>
    <div class="button-items">
        <i :class='iconClass'></i>
        <Button as="router-link" :to='props.route' :label='props.label' />
    </div>
</template>

<style scoped>
.button-items {
    display: flex;
    flex-direction: row;
    place-items: center;
    gap: 12px;
}

.button-items>a {
    min-width: 150px;
}
</style>