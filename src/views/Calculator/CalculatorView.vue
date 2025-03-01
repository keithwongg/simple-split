<script setup>
import * as Utils from "../../helpers/utils.js";
import { ref, computed, watch } from 'vue'
import CustomChip from '@/components/CustomChip.vue';
import Step1 from "./Step1.vue";
import Step2 from "./Step2.vue";
import { NAMES_KEY, ITEMS_KEY, ADJMATRIX_KEY } from "@/constants/constants.js";

/* STEP 1: NAMES */

/* STEP 2: PAID AMOUNT / EXPENSES */

function clearData() {
    NAMES.value = []
    ITEMS.value = []
    Utils.clearAll(NAMES_KEY, ITEMS_KEY, ADJMATRIX_KEY)
}

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
                <StepItem value="2">
                    <Step>Who Paid for Items?</Step>
                    <StepPanel v-slot="{ activateCallback }">
                        <Step2 :activate-callback="activateCallback" />
                    </StepPanel>
                </StepItem>
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