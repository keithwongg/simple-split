<script setup>
import CustomChip from '@/components/CustomChip.vue';
import { titleCase, roundToTwoDp, deepCopyArray } from '@/helpers/utils.js';
import { ref, computed } from 'vue';
import { NAMES, ITEMS } from './calculatorStates';

const props = defineProps({
    activateCallback: Function
})
const paidBy = ref("");
const itemDescription = ref("");
const paidAmount = ref("");
const toSplitWith = ref("");
const getListOtherThanPersonWhoPaid = computed(() => {
    return NAMES.value.filter((x) => x !== paidBy.value)
})

function addExpense() {
    let item = {
        id: ITEMS.value.length + 1,
        cost: roundToTwoDp(paidAmount.value),
        cost_per_pax: roundToTwoDp(paidAmount.value / NAMES.value.length),
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
            <MultiSelect v-model="toSplitWith" :options="getListOtherThanPersonWhoPaid" filter
                placeholder="Select Who To Split With?" :maxSelectedLabels="15" class="w-full md:w-80" />
        </div>
        <Button class="space-gap" @click="addExpense()" label="Add Expense +" severity="primary"
            variant="outlined"></Button>
        <p>Total number of items: <Badge :value="ITEMS.value.length"></Badge>
        </p>
        <div class="space-gap">

            <div class="card">
                <Fieldset v-for="item in ITEMS.value" :legend="`${item.description}: ${item.who_paid}`"
                    :toggleable="true">
                    <p class="m-0">
                        Paid by: <b>{{ item.who_paid }}</b>
                    </p>
                    <p class="m-0">
                        Split with:
                        <CustomChip v-for="name in item.to_receive_from" :label="name"
                            @custom-remove="ITEMS.removeName(item.id, name)" />
                    </p>
                    <p class="m-0">
                        Total Cost: {{ item.cost }}
                    </p>
                    <p class="m-0">
                        Cost Per Pax: <b>{{ item.cost_per_pax }}</b>
                    </p>
                    <Button icon="pi pi-times" @click="ITEMS.remove(item.id)" severity="danger" size="small"
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