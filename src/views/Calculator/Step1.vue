<script setup>
import CustomChip from '@/components/CustomChip.vue';
import { titleCase } from '@/helpers/utils.js';
import { ref, computed } from 'vue';
import { NAMES } from './calculatorStates';
import { useConfirm } from 'primevue';
import { useToast } from 'primevue';

const props = defineProps({
    activateCallback: Function
})
const nameInput = ref('');
const nameExistError = ref(false);
const showNames = computed(() => NAMES.value.length > 0)
const confirm = useConfirm()
const toast = useToast()

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

const confirmRemoveName = (name) => {
    confirm.require({
        message: `Are you sure? All items related to ${name} will be deleted.`,
        header: 'Delete Name',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancel',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Delete',
            severity: 'danger'
        },
        accept: () => {
            NAMES.remove(name)
            toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Name and related items deleted', life: 3000 });
        },
        reject: () => {
        }
    });
};

</script>

<template>
    <div class="step-container">
        <div class="flex flex-col h-48">
            <div
                class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">
                Add the names of all people involved in the division of expenses
            </div>
            <Message v-if="nameExistError" severity="error" icon="pi pi-times-circle" class="mb-2 space-gap">
                Name Already Exist</Message>
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
        <div class="space-gap" v-if="showNames">
            <Toast />
            <ConfirmDialog></ConfirmDialog>
            <CustomChip v-for="(name, _) in NAMES.value" :label="name" @custom-remove="confirmRemoveName(name)" />
        </div>
        <div class="py-6 space-gap">
            <Button label="Next" @click="props.activateCallback('2')" />
        </div>
    </div>
</template>

<style scoped>
.space-gap {
    margin-top: 20px;
    margin-bottom: 10px;
}

.p-inputgroup {
    margin-top: 12px;
}

.step-container {
    width: 80%;
    max-width: 80%;
    overflow: scroll;
}
</style>