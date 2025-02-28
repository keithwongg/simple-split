<script setup>
import CustomChip from '@/components/CustomChip.vue';
import { NAMES_KEY } from '@/constants/constants';
import { getFromLocalStorageAsArray, titleCase } from '@/helpers/utils.js';
import { ref, computed, watch } from 'vue';
import { saveInLocalStorage } from '@/helpers/utils.js';

const props = defineProps({
    activateCallback: Function
})

const NAMES = ref(getFromLocalStorageAsArray(NAMES_KEY));
const nameInput = ref('');
const nameExistError = ref(false);

function addNames() {
    if (nameInput.value.length === 0) {
        return
    }
    let titleCaseName = titleCase(nameInput.value)
    let index = NAMES.value.indexOf(titleCaseName)
    if (index > -1) {
        nameExistError.value = true
        return
    }
    console.log(`see names before push: ${NAMES.value} | titlecasename: ${titleCaseName}`)
    NAMES.value.push(titleCaseName)
    console.log(`see names after push: ${NAMES.value}`)
    nameInput.value = ""
    clearNameExistError()
}

function clearNameExistError() {
    if (nameExistError.value) {
        nameExistError.value = false
    }
}

function removeName(name) {
    let i = NAMES.value.indexOf(name)
    NAMES.value.splice(i, 1)
}

function showNames() {
    return getFromLocalStorageAsArray(NAMES_KEY).length > 0
};

watch(NAMES, (newNames, oldNames) => {
    console.log(`newNames ${newNames} ${oldNames}`)
    saveInLocalStorage(NAMES_KEY, newNames)
}, { deep: true })

</script>

<template>
    <div>
        <div class="flex flex-col h-48">
            <div
                class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">
                Add the names of all people involved in the division of expenses
            </div>
            <p>{{ showNames() }}</p>
            <Message v-if="nameExistError" severity="error" icon="pi pi-times-circle" class="mb-2 space-gap">
                Name Already Exist</Message>
            <div class="custom-buttons-block">
                <InputGroup>
                    <InputGroupAddon>
                        <OverlayBadge v-if="showNames()" :value="NAMES.length" size="small">
                            <i class="pi pi-user"></i>
                        </OverlayBadge>
                        <i v-else class="pi pi-user"></i>
                    </InputGroupAddon>
                    <InputText @keyup.enter="addNames()" v-model="nameInput" placeholder="Name" />
                    <Button class="space-gap" @click="addNames()" label="Add +" severity="primary"
                        variant="outlined"></Button>
                </InputGroup>
            </div>
        </div>
        <div class="space-gap" v-if="showNames()">
            <CustomChip v-for="(name, _) in NAMES" :label="name" @custom-remove="removeName(name)" />
        </div>
        <div class="py-6 space-gap">
            <Button label="Next" @click="props.activateCallback('2')" />
        </div>
    </div>
</template>

<style scoped></style>