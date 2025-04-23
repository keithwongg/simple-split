<script setup>
import CustomChip from '@/components/CustomChip.vue';
import { ref } from 'vue';
import { NAMES, ITEMS } from './calculatorStates';

const props = defineProps({
    editable: {
        type: Boolean,
        required: true
    }
})
const logTypes = ['By Items', 'By Name']
const logType = ref('By Items')

function countItemsByName(name) {
    return ITEMS.value.filter((x) => x.who_paid === name).length
}

function getItemLabel(name) {
    return countItemsByName(name) > 1 ? 'items' : 'item'
}

</script>

<template>
    <div class="itemlogs-container">
        <p class="space-gap">Total number of items:
            <Badge :value="ITEMS.value.length" />
        </p>

        <SelectButton v-model="logType" :options="logTypes" />

        <div class="space-gap">
            <div v-if="logType === 'By Name'">
                <div v-for="name in NAMES.value" class="space-gap">
                    <Fieldset v-if="countItemsByName(name) > 0" class="space-gap"
                        :legend="`${name} paid: ${countItemsByName(name)} ${getItemLabel(name)}`" :toggleable="true">
                        <div v-for="(item, index) in ITEMS.value">
                            <div v-if="item.who_paid === name">
                                <div class="custom-item">
                                    <p class="m-0 title">
                                        {{ item.description }}
                                    </p>
                                    <p class="m-0">
                                        Total Cost: {{ item.cost }}
                                    </p>
                                    <p class="m-0">
                                        Cost Per Pax: <b>{{ item.cost_per_pax }}</b>
                                    </p>
                                    <p class="m-0">
                                        Split with:
                                        <CustomChip v-for="name in item.to_receive_from" :label="name"
                                            :editable="props.editable"
                                            @custom-remove="ITEMS.removeName(item.id, name)" />
                                    </p>
                                    <Button v-if="props.editable" icon="pi pi-times" @click="ITEMS.remove(item.id)"
                                        severity="danger" size="small" aria-label="Remove Expense" label="Remove"
                                        style="margin-top: 8px;"></Button>
                                </div>
                            </div>

                        </div>
                    </Fieldset>
                </div>
            </div>
            <div v-else>
                <Fieldset v-for="item in ITEMS.value" :legend="`${item.description}: ${item.who_paid}`"
                    :toggleable="true">
                    <p class="m-0">
                        Paid by: <b>{{ item.who_paid }}</b>
                    </p>
                    <p class="m-0">
                        Total Cost: {{ item.cost }}
                    </p>
                    <p class="m-0">
                        Cost Per Pax: <b>{{ item.cost_per_pax }}</b>
                    </p>
                    <p class="m-0">
                        Split with:
                        <CustomChip v-for="name in item.to_receive_from" :label="name" :editable="props.editable"
                            @custom-remove="ITEMS.removeName(item.id, name)" />
                    </p>
                    <Button v-if="props.editable" icon="pi pi-times" @click="ITEMS.remove(item.id)" severity="danger"
                        size="small" aria-label="Remove Expense" label="Remove" style="margin-top: 8px;"></Button>
                </Fieldset>
            </div>
        </div>
    </div>

</template>

<style scoped>
.itemlogs-container {
    width: 100%;
    margin-bottom: 24px;
}

.space-gap {
    margin-top: 20px;
    margin-bottom: 10px;
}

fieldset {
    position: relative;
    background-color: var(--p-surface-800);
    width: 90%;
}

fieldset :deep(.p-fieldset-legend-label) {
    font-size: 16px;
}

.custom-card {
    background-color: var(--p-surface-800);
}

.custom-item {
    background-color: var(--p-surface-700);
    margin: 8px 0px;
    padding: 12px;
    border-radius: 5px;
    overflow-x: scroll;
}

.title {
    font-size: 16px;
    font-weight: bold;
}

.custom-badge {
    position: absolute;
    right: 30px;
}
</style>