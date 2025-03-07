<script setup>
import Step1 from "./Step1.vue";
import Step2 from "./Step2.vue";
import { clearData } from "./calculatorStates.js";
import MenuBar from "@/components/MenuBar.vue";
</script>

<template>
    <div class="container">
        <MenuBar class="menubar" />

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
    </div>
</template>

<style scoped>
.menubar {
    position: absolute;
    top: 0px;
    left: 0px;
    height: 42px;
    width: 100vw;
}

.container {
    height: 80vh;
    width: 80vw;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 0px auto;
    padding: 54px 40px 40px 40px;
}

.space-gap {
    margin-top: 20px;
    margin-bottom: 10px;
}

.card {
    padding-bottom: 30px;
}

@media (max-width: 800px) {
    .container {
        padding: 54px 0px 0px 0px;
    }
}
</style>