<script setup>
import Button from 'primevue/button'
</script>

<template>
    <main>
        <h1>Simple Split</h1>
        <p>This is a simple calculator to split expenses with friends</p>
        <div class="buttons">
            <Button @click="$router.push('how')" label="How To Use" />
            <Button @click="$router.push('calculate')" label="Start Calculating" />
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

.buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 40px;
}

.buttons>button {
    max-width: 200px;
}
</style>