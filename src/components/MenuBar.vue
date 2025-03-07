<script setup>
import { ref } from 'vue';
const items = ref([
    {
        route: '/',
        label: 'Home',
        icon: 'pi pi-home'
    },
    {
        route: '/calculate',
        label: 'Calculate',
        icon: 'pi pi-calculator'
    },
    {
        route: '/how',
        label: 'How to use',
        icon: 'pi pi-question'
    }
])
</script>

<template>
    <Menubar :model="items" breakpoint="362px">
        <template #item="{ item, props, hasSubmenu }">
            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                    <span :class="item.icon" />
                    <span>{{ item.label }}</span>
                </a>
            </router-link>
        </template>
    </Menubar>
</template>

<style scoped></style>