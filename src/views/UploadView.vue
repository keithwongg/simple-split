<script setup>
import { getFromLocalStorageAsArray, saveInLocalStorage, removeItemFromStorageById, roundToTwoDp, clearAll } from "@/helpers/utils";
import { NAMES_KEY, ITEMS_KEY, ADJMATRIX_KEY } from "@/constants/constants";
import { ref } from 'vue';

const value = ref(null)
function showSummary() {
    console.log(`check value: ${value.value}`)
    let data = atob(value.value)
    console.log(`data : ${(data)}`)
    let dataParsed = JSON.parse(data)
    console.log(`dataParsed : ${(dataParsed.items)} , - ${dataParsed.names}`)
    if (data.length > 0) {
        saveInLocalStorage(ITEMS_KEY, dataParsed.items)
        saveInLocalStorage(NAMES_KEY, dataParsed.names)
        console.log('saved names and items in local storage')
        window.location = 'summary'
    }
}
</script>

<template>
    <div>
        <h1>Upload</h1>
        <p>Copy and paste the shared text here:</p>
        <Textarea v-model="value" rows="5" cols="30" />
        <Button label="Submit" @click="showSummary"></Button>
    </div>
</template>

<style scoped></style>