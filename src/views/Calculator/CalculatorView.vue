<script setup>
import * as Utils from "../../helpers/utils.js";
import { ref, computed, watch } from 'vue'
import CustomChip from '@/components/CustomChip.vue';
import Step1 from "./Step1.vue";
import { NAMES_KEY, ITEMS_KEY, ADJMATRIX_KEY } from "@/constants/constants.js";

/* STEP 1: NAMES */

// function getListOtherThanPersonWhoPaid(name) {
//     let names = Utils.getFromLocalStorageAsArray(NAMES_KEY)
//     return names.filter((x) => x !== name)
// }

// /* STEP 2: PAID AMOUNT / EXPENSES */
// const ITEMS = ref([])
// const paidBy = ref("");
// const paidAmount = ref("");
// const itemDescription = ref("");
// const toSplitWith = ref("");

// function addExpense() {
//     let test = Utils.deepCopyArray(toSplitWith.value)
//     console.log(JSON.stringify(test))
//     let item = {
//         id: ITEMS.value.length + 1,
//         cost: paidAmount.value,
//         cost_per_pax: Utils.roundToTwoDp(paidAmount.value / NAMES.value.length),
//         description: Utils.titleCase(itemDescription.value),
//         to_receive_from: Utils.deepCopyArray(toSplitWith.value),
//         who_paid: paidBy.value,
//     }
//     ITEMS.value.push(item)
//     Utils.saveInLocalStorage(ITEMS_KEY, ITEMS.value)
//     paidAmount.value = ""
//     itemDescription.value = ""
// }

// function removeExpense(id) {
//     ITEMS.value = Utils.removeItemFromStorageById(id, ITEMS_KEY)
// }

// function removeNameFromExpense(id, name) {
//     let indexOfObj = ITEMS.value.map(e => e.id).indexOf(id)
//     let currentItem = ITEMS.value[indexOfObj]
//     let nameExist = currentItem.to_receive_from.some(n => n === name)
//     if (!nameExist) {
//         console.log('no name to be deleted')
//         return
//     }
//     let index = currentItem.to_receive_from.indexOf(name)
//     currentItem.to_receive_from.splice(index, 1)
//     if (currentItem.to_receive_from === undefined || currentItem.to_receive_from.length <= 0) {
//         ITEMS.value.splice(indexOfObj, 1)
//     }
//     Utils.saveInLocalStorage(ITEMS_KEY, ITEMS.value)
// }


// watch(ITEMS, (newItems, oldItems) => {
//     Utils.saveInLocalStorage(ITEMS_KEY, newItems)
// })

// function clearData() {
//     NAMES.value = []
//     ITEMS.value = []
//     Utils.clearAll(NAMES_KEY, ITEMS_KEY, ADJMATRIX_KEY)
// }

</script>

<template>
    <main>

        <h1>Split Expenses</h1>

        <div>
            <p>If you want to restart from scratch and clear all data, click the button below:</p>
            <Button class="space-gap" @click="clearData()" label="Clear All Data" severity="warn"
                variant="outlined"></Button>
        </div>

        <Divider />

        <div class="card">
            <Stepper value="1">

                <StepItem value="1">
                    <Step>People Involved</Step>
                    <StepPanel v-slot="{ activateCallback }">
                        <Step1 :activate-callback="activateCallback" />
                    </StepPanel>
                </StepItem>
                <!-- 
                <StepItem value="2">
                    <Step>Who Paid for Items?</Step>
                    <StepPanel v-slot="{ activateCallback }">
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
                                <Select v-model="paidBy" :options="NAMES" placeholder="Paid By Who?"
                                    class="w-full md:w-56" />
                            </InputGroup>
                            <InputGroup>
                                <IftaLabel>
                                    <InputText id="itemDescriptionInput" v-model="itemDescription"
                                        max-fraction-digits="2" />
                                    <label for="itemDescriptionInput">Item Description</label>
                                </IftaLabel>
                                <IftaLabel variant="on">
                                    <InputNumber v-model="paidAmount" inputId="priceInput" :maxFractionDigits="2" />
                                    <label for="priceInput">Price Input</label>
                                </IftaLabel>

                            </InputGroup>

                        </div>

                        <div class="card flex justify-center">
                            <MultiSelect v-model="toSplitWith" :options="getListOtherThanPersonWhoPaid(paidBy)" filter
                                placeholder="Select Who To Split With?" :maxSelectedLabels="15"
                                class="w-full md:w-80" />
                        </div>
                        <Button class="space-gap" @click="addExpense()" label="Add Expense +" severity="primary"
                            variant="outlined"></Button>
                        <p>Total number of items: <Badge :value="ITEMS.length"></Badge>
                        </p>
                        <div class="space-gap">

                            <div class="card">
                                <Fieldset v-for="item in ITEMS" :legend="`${item.description}: ${item.who_paid}`"
                                    :toggleable="true">
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
                                    <Button icon="pi pi-times" @click="removeExpense(item.id)" severity="danger"
                                        size="small" aria-label="Remove Expense"></Button>
                                </Fieldset>
                            </div>

                        </div>
                        <div class="flex py-6 gap-3 custom-buttons-block">
                            <Button label="Back" severity="secondary" @click="activateCallback('1')" />
                            <Button as="router-link" to='/summary' label='Show Summary' />
                        </div>
                    </StepPanel>
                </StepItem> -->
            </Stepper>
        </div>
    </main>
</template>

<style scoped>
.space-gap {
    margin-top: 20px;
    margin-bottom: 10px;
}

.p-inputgroup {
    margin-top: 12px;
}

.custom-buttons-block {
    display: flex;
    gap: 12px;
}

.full-width {
    width: 100%;
}

fieldset {
    position: relative;
    background-color: var(--p-surface-800);
}

fieldset :deep(.p-button) {
    position: absolute;
    right: 10px;
    bottom: 10px;
}
</style>