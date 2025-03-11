<script setup>
import { roundToTwoDp } from '@/helpers/utils.js';
import { NAMES, ITEMS } from './Calculator/calculatorStates.js';
import ItemLogs from './Calculator/ItemLogs.vue';
import { ref } from 'vue';

const adjMatrix = []
const visible = ref(false)

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

function exportCurrentData() {
    let data = JSON.stringify({ items: ITEMS.value, names: NAMES.value })
    console.log(`checkdata: ${data}`)
    let bindata = new TextEncoder().encode(data)
    console.log(`checkbindata: ${btoa(bindata)}`)
    let decdata = new TextDecoder().decode(bindata)
    console.log(`checkdecodeddata: ${decdata}`)

    let base64Encoded = btoa(data)
    let text = `Copy and Paste in Simple Split to see breakdown.\nText to Paste: ${base64Encoded}`
    navigator.clipboard.writeText(text)
    return base64Encoded
}

function shareData() {
    visible.value = true
    exportCurrentData()
}

</script>

<template>
    <div class="container">
        <h1>Summary</h1>

        <Divider />
        <div v-if="ITEMS.value.length >= 1">

            <Button label="Share with Friends" @click="shareData" />

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
            <ItemLogs :editable="false" />


            <div class="buttons">
                <Button as="router-link" to='/calculate' label='Edit Logs in Calculator' severity="primary"
                    class="button" />
            </div>
        </div>
        <div v-else>
            <p class="space-gap">No present items. Enter values in the calculator.</p>
            <div class="buttons">
                <Button as="router-link" to='/calculate' label='Start Calculating' severity="primary" class="button" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.space-gap {
    margin-bottom: 20px;
}

.container {
    height: 80vh;
    width: 80vw;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 0 auto;
    padding: 40px;
}

.card-style {
    background-color: var(--p-surface-800);
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
    margin: 10px 0px;
}

.buttons {
    max-width: 200px;
    width: 100%;
    padding-bottom: 30px;
}

@media (max-width: 800px) {
    .container {
        padding: 54px 0px 0px 0px;
    }
}
</style>