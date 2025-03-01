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
    <div>
        <p class="space-gap">Total number of items:
            <Badge :value="ITEMS.value.length" />
        </p>

        <SelectButton v-model="logType" :options="logTypes" />

        <div class="space-gap">
            <div v-if="logType === 'By Name'">
                <div v-for="name in NAMES.value" class="space-gap">
                    <Fieldset v-if="countItemsByName(name) > 0" class="space-gap custom-card"
                        :legend="`${name} paid: ${countItemsByName(name)} ${getItemLabel(name)}`" :toggleable="true">
                        <div v-for="(item, index) in ITEMS.value">
                            <div v-if="item.who_paid === name">
                                <div class="custom-item">
                                    <div class="custom-badge">
                                        <Badge :value="`#${index + 1}`" severity="secondary"/>
                                    </div>
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
                                        severity="danger" size="small" aria-label="Remove Expense"></Button>
                                </div>
                            </div>
                        </div>
                    </Fieldset>
                </div>
            </div>
            <div v-else class="card">
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
                        size="small" aria-label="Remove Expense"></Button>
                </Fieldset>
            </div>
        </div>
    </div>

</template>

<style scoped>
.space-gap {
    margin-top: 20px;
    margin-bottom: 10px;
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
    border-radius: 6%;
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