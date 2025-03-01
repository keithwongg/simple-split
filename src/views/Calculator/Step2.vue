<script setup>
import CustomChip from '@/components/CustomChip.vue';
import { NAMES_KEY, ITEMS_KEY } from '@/constants/constants';
import { getFromLocalStorageAsArray, titleCase, roundToTwoDp, deepCopyArray, saveInLocalStorage } from '@/helpers/utils.js';
import { ref, computed, watch } from 'vue';

const props = defineProps({
    activateCallback: Function
})
const NAMES = getFromLocalStorageAsArray(NAMES_KEY)
const ITEMS = ref(getFromLocalStorageAsArray(ITEMS_KEY))
const paidBy = ref("");
const itemDescription = ref("");
const paidAmount = ref("");
const toSplitWith = ref("");

function getListOtherThanPersonWhoPaid() {
    return NAMES.filter((x) => x !== paidBy.value)
}

function addExpense() {
    let item = {
        id: ITEMS.value.length + 1,
        cost: roundToTwoDp(paidAmount.value),
        cost_per_pax: roundToTwoDp(paidAmount.value / NAMES.length),
        description: titleCase(itemDescription.value),
        to_receive_from: deepCopyArray(toSplitWith.value),
        who_paid: paidBy.value,
    }
    ITEMS.value.push(item)
    paidAmount.value = ""
    itemDescription.value = ""
}

function removeExpense(id) {
    ITEMS.value = removeItemFromStorageById(id, ITEMS_KEY)
}

function removeNameFromExpense(id, name) {
    let indexOfObj = ITEMS.value.map(e => e.id).indexOf(id)
    let currentItem = ITEMS.value[indexOfObj]
    let nameExist = currentItem.to_receive_from.some(n => n === name)
    if (!nameExist) {
        console.log('no name to be deleted')
        return
    }
    let index = currentItem.to_receive_from.indexOf(name)
    currentItem.to_receive_from.splice(index, 1)
    if (currentItem.to_receive_from === undefined || currentItem.to_receive_from.length <= 0) {
        ITEMS.value.splice(indexOfObj, 1)
    }
}


watch(ITEMS, (newItems, oldItems) => {
    saveInLocalStorage(ITEMS_KEY, newItems)
})

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
                <Select v-model="paidBy" :options="NAMES" placeholder="Paid By Who?" class="w-full md:w-56" />
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
            <MultiSelect v-model="toSplitWith" :options="getListOtherThanPersonWhoPaid()" filter
                placeholder="Select Who To Split With?" :maxSelectedLabels="15" class="w-full md:w-80" />
        </div>
        <Button class="space-gap" @click="addExpense()" label="Add Expense +" severity="primary"
            variant="outlined"></Button>
        <p>Total number of items: <Badge :value="ITEMS.length"></Badge>
        </p>
        <div class="space-gap">

            <div class="card">
                <Fieldset v-for="item in ITEMS" :legend="`${item.description}: ${item.who_paid}`" :toggleable="true">
                    <p class="m-0">
                        Paid by: <b>{{ item.who_paid }}</b>
                    </p>
                    <p class="m-0">
                        Split with:
                        <CustomChip v-for="name in item.to_receive_from" :label="name"
                            @custom-remove="removeNameFromExpense(item.id, name)" />
                    </p>
                    <p class="m-0">
                        Total Cost: {{ item.cost }}
                    </p>
                    <p class="m-0">
                        Cost Per Pax: <b>{{ item.cost_per_pax }}</b>
                    </p>
                    <Button icon="pi pi-times" @click="removeExpense(item.id)" severity="danger" size="small"
                        aria-label="Remove Expense"></Button>
                </Fieldset>
            </div>

        </div>
        <div class="flex py-6 gap-3 custom-buttons-block">
            <Button label="Back" severity="secondary" @click="activateCallback('1')" />
            <Button as="router-link" to='/summary' label='Show Summary' />
        </div>
    </div>
</template>

<style scoped></style>