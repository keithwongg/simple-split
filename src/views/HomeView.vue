<script setup>
import RouterButtonWithIcon from '@/components/RouterButtonWithIcon.vue';
</script>

<template>
    <div>
        <div class="simple-split-background"></div>
        <div class="background-tint"></div>

        <div class="container">
            <div>
                <h1 class="title">SIMPLE SPLIT</h1>
                <p>This is a simple one page calculator to split bills with people.</p>
                <p>Data is stored solely in local storage on the browser and nowhere else.</p>
                <div class="buttons-container">
                    <RouterButtonWithIcon icon-name="play" route="/calculate" label="Start Calculating">
                    </RouterButtonWithIcon>
                    <RouterButtonWithIcon icon-name="question" route="/how" label="How To Use" severity="secondary">
                    </RouterButtonWithIcon>

                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    height: 80vh;
    width: 80vw;
    display: flex;
    flex-direction: column;
    place-items: center;
    justify-content: center;
    gap: 12px;
    margin: 0 auto;
}

.buttons-container {
    margin-top: 40px;
    width: 100%;
    display: flex;
    flex-direction: column;
    place-items: start;
    gap: 12px;
}

.simple-split-background {
    position: absolute;
    z-index: -2;
    background-image: url('/src/assets/background.jpg');
    background-size: cover;
    /* Stretches to fit */
    background-repeat: no-repeat;
    height: 100vh;
    width: 100vw;
}

.background-tint {
    position: absolute;
    z-index: -1;
    height: 100vh;
    width: 100vw;
    background-color: rgba(3, 3, 3, 0.858);
    background-blend-mode: multiply;
}

.title {
    font-size: 48px;
    color: white;
    font-weight: 700;
}

@media (max-width: 400px) {
    .title {
        font-size: 32px;
    }
}
</style>