<script setup>
import RouterButtonWithIcon from '@/components/RouterButtonWithIcon.vue';
</script>

<template>
    <main>
        <h1>Simple Split</h1>
        <p>This is a simple one page calculator to split bills with people.</p>
        <p>Data is stored solely in local storage on the browser and nowhere else.</p>
        <div class="buttons-container">
            <RouterButtonWithIcon icon-name="play" route="/calculate" label="Start Calculating"></RouterButtonWithIcon>
            <RouterButtonWithIcon icon-name="question" route="/how" label="How To Use" severity="secondary">
            </RouterButtonWithIcon>
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
    margin-top: 20px;
}
</style>