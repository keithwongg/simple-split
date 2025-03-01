<script setup>
import Step1 from "./Step1.vue";
import Step2 from "./Step2.vue";
import { clearData } from "./calculatorStates.js";
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
</style>