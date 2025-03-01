<script setup>
import CustomChip from '@/components/CustomChip.vue';
import { titleCase } from '@/helpers/utils.js';
import { ref, computed } from 'vue';
import { NAMES } from './calculatorStates';

const props = defineProps({
    activateCallback: Function
})
const nameInput = ref('');
const nameExistError = ref(false);
const showNames = computed(() => NAMES.value.length > 0)

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
    NAMES.add(titleCaseName)
    nameInput.value = ""
    clearNameExistError()
}

function clearNameExistError() {
    if (nameExistError.value) {
        nameExistError.value = false
    }
}

</script>

<template>
    <div>
        <div class="flex flex-col h-48">
            <div
                class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">
                Add the names of all people involved in the division of expenses
            </div>
            <p>computed shownames: {{ showNames }}</p>
            <Message v-if="nameExistError" severity="error" icon="pi pi-times-circle" class="mb-2 space-gap">
                Name Already Exist</Message>
            <div class="custom-buttons-block">
                <InputGroup>
                    <InputGroupAddon>
                        <OverlayBadge v-if="showNames" :value="NAMES.value.length" size="small">
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
        <div class="space-gap" v-if="showNames">
            <CustomChip v-for="(name, _) in NAMES.value" :label="name" @custom-remove="NAMES.remove(name)" />
        </div>
        <div class="py-6 space-gap">
            <Button label="Next" @click="props.activateCallback('2')" />
        </div>
    </div>
</template>

<style scoped></style>