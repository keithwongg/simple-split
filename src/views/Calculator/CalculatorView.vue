<script setup>
import * as Utils from "../../helpers/utils.js";
import { ref, computed } from 'vue'
import CustomChip from '@/components/CustomChip.vue';

const NAMES_KEY = "names";
const ITEMS_KEY = "items";
const P2P_KEY = "p2p";
const ADJMATRIX_KEY = "adjmatrix"; // this holds 2 matrix, for the balances

function clearData() {
    NAMES.value = []
    Utils.clearAll(NAMES_KEY, ITEMS_KEY, P2P_KEY, ADJMATRIX_KEY)
    clearNameExistError()
}

/* STEP 1: NAMES */
const NAMES = ref(Utils.getFromLocalStorageAsArray(NAMES_KEY));
const nameInput = ref("");
const nameExistError = ref(false);

const showNames = computed(() => NAMES.value.length > 0)

function clearNameExistError() {
    if (nameExistError.value) {
        nameExistError.value = false
    }
}

function addNames() {
    if (nameInput.length === 0) {
        return
    }
    let titleCaseName = Utils.titleCase(nameInput.value)
    let index = NAMES.value.indexOf(titleCaseName)
    if (index > -1) {
        nameExistError.value = true
        return
    }
    NAMES.value.push(titleCaseName)
    Utils.saveInLocalStorage(NAMES_KEY, NAMES.value)
    nameInput.value = ""
    clearNameExistError()
}

function removeName(event) {
    let i = NAMES.value.indexOf(event)
    NAMES.value.splice(i, 1)
    Utils.saveInLocalStorage(NAMES_KEY, NAMES.value)
}

/* STEP 2: PAID AMOUNT */
const ITEMS = ref(Utils.getFromLocalStorageAsArray(ITEMS_KEY))
const paidBy = ref("");
const paidAmount = ref("");
const itemDescription = ref("");
const toSplitWith = ref("");

function addExpense() {
    let test = Utils.deepCopyArray(toSplitWith.value)
    console.log(JSON.stringify(test))
    let item = {
        id: ITEMS.value.length + 1,
        cost: paidAmount.value,
        cost_per_pax: Utils.roundToTwoDp(paidAmount.value / NAMES.value.length),
        description: Utils.titleCase(itemDescription.value),
        to_receive_from: Utils.deepCopyArray(toSplitWith.value),
        who_paid: paidBy.value,
    }
    ITEMS.value.push(item)
    Utils.saveInLocalStorage(ITEMS_KEY, ITEMS.value)
    paidAmount.value = ""
    itemDescription.value = ""
}

function removeExpense(id) {
    ITEMS.value = Utils.removeItemFromStorageById(id, ITEMS_KEY)
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
    Utils.saveInLocalStorage(ITEMS_KEY, ITEMS.value)
}

</script>

<template>
    <main>

        <h1>Split Expenses</h1>
        <p>{{ NAMES }}</p>
        <p>{{ login }}</p>

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
                        <div class="flex flex-col h-48">
                            <div
                                class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">
                                Add the names of all people involved in the division of expenses
                            </div>
                            <Message v-if="nameExistError" severity="error" icon="pi pi-times-circle"
                                class="mb-2 space-gap">
                                Name Already Exist</Message>
                            <div class="custom-buttons-block">
                                <InputGroup>
                                    <InputGroupAddon>
                                        <OverlayBadge v-if="showNames" :value="NAMES.length" size="small">
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
                            <CustomChip v-for="(name, _) in NAMES" :label="name" @custom-remove="removeName(name)" />
                        </div>
                        <div class="py-6 space-gap">
                            <Button label="Next" @click="activateCallback('2')" />
                        </div>
                    </StepPanel>
                </StepItem>

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
                                    <InputNumber v-model="paidAmount" inputId="priceInput" max-fraction-digits="2" />
                                    <label for="priceInput">Price Input</label>
                                </IftaLabel>

                            </InputGroup>

                        </div>

                        <div class="card flex justify-center">
                            <MultiSelect v-model="toSplitWith" :options="NAMES" filter
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
                                        Paid by: {{ item.who_paid }}
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
                                        Cost Per Pax: {{ item.cost_per_pax }}
                                    </p>
                                    <Button icon="pi pi-times" @click="removeExpense(item.id)" severity="danger"
                                        size="small" aria-label="Remove Expense"></Button>
                                </Fieldset>
                            </div>

                        </div>
                        <div class="flex py-6 gap-3 custom-buttons-block">
                            <Button label="Back" severity="secondary" @click="activateCallback('1')" />
                            <Button label="Next" @click="activateCallback('3')" />
                        </div>
                    </StepPanel>
                </StepItem>

                <StepItem value="3">
                    <Step>Who Paid Who?</Step>
                    <StepPanel v-slot="{ activateCallback }">
                        <div class="flex flex-col h-48">
                            <div
                                class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">
                                Content III</div>
                        </div>
                        <div class="py-6">
                            <Button label="Back" severity="secondary" @click="activateCallback('2')" />
                        </div>
                    </StepPanel>
                </StepItem>

            </Stepper>
        </div>

        <div v-if="showSummary">
            <Divider />
            <Card>
                <template #title>Simple Card</template>
                <template #content>
                    <p class="m-0">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error
                        repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione
                        quam
                        perferendis esse, cupiditate neque
                        quas!
                    </p>
                </template>
            </Card>
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

.custom-card {
    border-color: gray;
    border-style: solid;
}

.full-width {
    width: 100%;
}

fieldset {
    position: relative;
}

fieldset :deep(.p-button) {
    position: absolute;
    right: 10px;
    bottom: 10px;
}
</style>