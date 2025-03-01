<script setup>
import { titleCase, roundToTwoDp, deepCopyArray } from '@/helpers/utils.js';
import { ref } from 'vue';
import { NAMES, ITEMS } from './calculatorStates';
import ItemLogs from './ItemLogs.vue';

const props = defineProps({
    activateCallback: Function
})
const paidBy = ref("");
const itemDescription = ref("");
const paidAmount = ref("");
const toSplitWith = ref("");

function addExpense() {
    let item = {
        id: ITEMS.value.length + 1,
        cost: roundToTwoDp(paidAmount.value),
        cost_per_pax: roundToTwoDp(paidAmount.value / toSplitWith.value.length),
        description: titleCase(itemDescription.value),
        to_receive_from: deepCopyArray(toSplitWith.value),
        who_paid: paidBy.value,
    }
    ITEMS.add(item)
    paidAmount.value = ""
    itemDescription.value = ""
}

</script>

<template>
    <div>
        <div class="flex flex-col h-48">
            <div
                class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">
                Add an expense paid by an individual, and who to split that expense with
            </div>
        </div>
        <div class="space-gap">
            <InputGroup>
                <InputGroupAddon>
                    <i class="pi pi-user"></i>
                </InputGroupAddon>
                <Select v-model="paidBy" :options="NAMES.value" placeholder="Paid By Who?" class="w-full md:w-56" />
            </InputGroup>
            <InputGroup>
                <IftaLabel>
                    <InputText id="itemDescriptionInput" v-model="itemDescription" max-fraction-digits="2" />
                    <label for="itemDescriptionInput">Item Description</label>
                </IftaLabel>
                <IftaLabel variant="on">
                    <InputNumber v-model="paidAmount" inputId="priceInput" :maxFractionDigits="2" />
                    <label for="priceInput">Price Input</label>
                </IftaLabel>

            </InputGroup>

        </div>

        <div class="card flex justify-center">
            <MultiSelect v-model="toSplitWith" :options="NAMES.value" filter placeholder="Select Who To Split With?"
                :maxSelectedLabels="15" class="w-full md:w-80" />
        </div>

        <Button class="space-gap" @click="addExpense()" label="Add Expense +" severity="primary"
            variant="outlined"></Button>

        <ItemLogs :editable="true" />

        <div class="flex py-6 gap-3 custom-buttons-block">
            <Button label="Back" severity="secondary" @click="activateCallback('1')" />
            <Button as="router-link" to='/summary' label='Show Summary' />
        </div>
    </div>
</template>

<style scoped>
.space-gap {
    margin-top: 20px;
    margin-bottom: 10px;
}

.custom-buttons-block {
    display: flex;
    gap: 12px;
}
</style>