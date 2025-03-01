<script setup>
import { roundToTwoDp } from '@/helpers/utils.js';
import { NAMES, ITEMS } from './Calculator/calculatorStates.js';
import ItemLogs from './Calculator/ItemLogs.vue';

const adjMatrix = []

createAdjMatrix()
addItemCostsToAdjMatrix()
contraBalances()

/*
    Adjacency Matrix - For Summary
*/
function createAdjMatrix() {
    // 0: x owes y, 1: y owes x
    for (let i = 0; i < NAMES.value.length; i++) {
        adjMatrix.push(Array(NAMES.value.length).fill(0))
    }
}

function addItemCostsToAdjMatrix() {
    for (let i = 0; i < ITEMS.value.length; i++) {
        let idxPersonWhoPaid = NAMES.value.indexOf(ITEMS.value[i].who_paid)
        if (idxPersonWhoPaid === -1) {
            console.log('something wrong')
            return
        }
        let peopleToReceiveFrom = ITEMS.value[i].to_receive_from
        for (let j = 0; j < peopleToReceiveFrom.length; j++) {
            let idxPersonToPay = NAMES.value.indexOf(peopleToReceiveFrom[j])
            if (idxPersonToPay === idxPersonWhoPaid) {
                continue
            }
            adjMatrix[idxPersonWhoPaid][idxPersonToPay] = roundToTwoDp(adjMatrix[idxPersonWhoPaid][idxPersonToPay] + ITEMS.value[i].cost_per_pax)
        }
    }
    console.log(`adjMatrix[original]: ${adjMatrix}`)
}

function contraBalances() {
    for (let i = 0; i < NAMES.value.length; i++) {
        for (let j = 0; j < NAMES.value.length; j++) {
            let samePerson = i == j
            if (samePerson) {
                continue
            }

            let owingValue = adjMatrix[i][j]
            let receivingValue = adjMatrix[j][i]

            /*
             2D Matrix of possibilities:
                    o
                  |      +           |        -        |
             r  + | owe +, receive + | owe -, receive +|
                - | owe +, receive - | owe -, receive -|
            */
            if (owingValue > receivingValue && receivingValue > 0) {
                adjMatrix[i][j] = roundToTwoDp(owingValue - receivingValue)
                adjMatrix[j][i] = 0
            }
            else if (receivingValue > owingValue && owingValue > 0) {
                adjMatrix[j][i] = roundToTwoDp(receivingValue - owingValue)
                adjMatrix[i][j] = 0
            }
        }
    }
    console.log(`adjMatrix[contra]: ${adjMatrix}`)
}


</script>

<template>
    <div>
        <h1>Summary</h1>

        <Divider />
        <Card v-for="(row, xIndex) in adjMatrix">
            <template #title>{{ NAMES.value[xIndex] }}</template>
            <template #content>
                <div v-for="(item, yIndex) in row">
                    <p v-if="adjMatrix[xIndex][yIndex] > 0">
                        To Receive From {{ NAMES.value[yIndex] }}: {{ adjMatrix[xIndex][yIndex] }}
                    </p>
                    <p v-if="adjMatrix[yIndex][xIndex] > 0">
                        Owe {{ NAMES.value[yIndex] }}: {{ adjMatrix[yIndex][xIndex] }}
                    </p>
                </div>
            </template>
        </Card>
        <Divider />

        <h1>Items Logs</h1>

        <!-- <Card v-for="item in ITEMS.value" class="card-style">
            <template #title>
                {{ item.description }}
            </template>
            <template #content>
                <p>
                    Paid by: {{ item.who_paid }}
                </p>
                <p>
                    Split with: <span v-for="name in item.to_receive_from">{{ name }}</span>
                </p>
                <p>
                    Total Cost: {{ item.cost }}
                </p>
                <p>
                    Cost Per Pax: {{ item.cost_per_pax }}
                </p>
            </template>
        </Card> -->

        <ItemLogs :editable="false" />
        <Button as="router-link" to='/calculate' label='Edit Logs in Calculator' severity="primary" />
    </div>
</template>

<style scoped>
.card-style {
    background-color: var(--p-surface-800);
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
    margin: 10px 0px;
}
</style>