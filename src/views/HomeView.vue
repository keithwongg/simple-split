<script setup>
import Button from 'primevue/button'
import RouterButtonWithIcon from '@/components/RouterButtonWithIcon.vue';
</script>

<template>
    <main>
        <h1>Simple Split</h1>
        <p>This is a simple calculator to split expenses with friends</p>
        <div class="buttons-container">
            <div class="button-items">
                <i class="pi pi-question"></i>
                <Button as="router-link" to="/how" label="How To Use" />
            </div>
            <div class="button-items">
                <i class="pi pi-play"></i>
                <Button as="router-link" to="/calculate" label="Start Calculating" />
            </div>
            <RouterButtonWithIcon icon-name="play" route="/calculate" label="Start Calculating"></RouterButtonWithIcon>
        </div>
    </main>
</template>

<style scoped>
main {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
}

main>p {
    max-width: 250px;
}

.buttons-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 40px;
}

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