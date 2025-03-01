<script setup>
import { ref } from 'vue';
import { NAMES_KEY, ITEMS_KEY, P2P_KEY, ADJMATRIX_KEY } from '@/constants/constants.js';
import * as Utils from "../helpers/utils.js";

const names = Utils.getFromLocalStorageAsArray(NAMES_KEY)
const items = Utils.getFromLocalStorageAsArray(ITEMS_KEY)
const adjMatrix = []


function renderSummary() {
    addItemCostsToAdjMatrix()
    // addP2PDataToAdjMatrix()

    // let incompleteProgress = items.length === 0 ||
    //     names.length === 0 ||
    //     adjMatrix.length === 0

    // let settledUpDict = {}
    // for (let i = 0; i < names.length; i++) {
    //     settledUpDict[names[i]] = (incompleteProgress) ? 0 : 1 // default to false
    //     for (let j = 0; j < namesArr.length; j++) {
    //         if (i === j) { // avoid if same person
    //             continue
    //         }

    //         let owingValue = adjMatrix[i][j]
    //         let receivingValue = adjMatrix[j][i]

    //         /*
    //          2D Matrix of possibilities:
    //                 o
    //               |      +           |        -        |
    //          r  + | owe +, receive + | owe -, receive +|
    //             - | owe +, receive - | owe -, receive -|
    //         */
    //         if (owingValue === receivingValue) {
    //             continue
    //         }
    //         settledUpDict[namesArr[i]] = 0

    //         // o+r+
    //         if (owingValue >= 0 && receivingValue >= 0) {
    //             if (owingValue > receivingValue) {
    //                 pTagsToAdd.push(createPTag(`${namesArr[i]} owes ${namesArr[j]} $${formatToShow2dpInUi(owingValue - receivingValue)}`))
    //             } else if (receivingValue > owingValue) {
    //                 pTagsToAdd.push(createPTag(`${namesArr[i]} to receive $${formatToShow2dpInUi(receivingValue - owingValue)} from ${namesArr[j]}`))
    //             }
    //             continue
    //         }

    //         // o+r-
    //         if (owingValue >= 0 && receivingValue < 0) {
    //             let valueAfterContra = Math.abs(receivingValue - owingValue)
    //             pTagsToAdd.push(createPTag(`${namesArr[i]} owes ${namesArr[j]} $${formatToShow2dpInUi(valueAfterContra)}`))
    //             continue
    //         }

    //         // o-r+
    //         if (owingValue < 0 && receivingValue >= 0) {
    //             pTagsToAdd.push(createPTag(`${namesArr[i]} overpaid ${namesArr[j]} $${formatToShow2dpInUi(Math.abs(owingValue))}`))
    //             continue
    //         }

    //         // o-r-
    //         if (receivingValue < 0 && owingValue < 0) {
    //             if (receivingValue < owingValue) {
    //                 let valueAfterContra = Math.abs(receivingValue - owingValue)
    //                 pTagsToAdd.push(createPTag(`${namesArr[i]} owes ${namesArr[j]} $${formatToShow2dpInUi(Math.abs(valueAfterContra))}`))
    //             } else if (owingValue > receivingValue) {
    //                 let valueAfterContra = Math.abs(owingValue - receivingValue)
    //                 pTagsToAdd.push(createPTag(`${namesArr[i]} overpaid ${namesArr[j]} $${formatToShow2dpInUi(Math.abs(valueAfterContra))}`))
    //             }
    //             continue
    //         }
    //     }
    // }

    // let allSettledUp = true
    // console.log(`settledupdict: ${JSON.stringify(settledUpDict)}`)
    // for (const [key, value] of Object.entries(settledUpDict)) {
    //     if (value === 1) {
    //         pTagsToAdd.push(createPTag(`${key} is all settled up!`))
    //     } else {
    //         allSettledUp = false
    //     }
    // }

    // if (allSettledUp && !incompleteProgress) {
    //     Utils.addPTagsToSummary([createPTag("All Settled Up! No Balance Remaining")])
    //     return
    // }

    // addPTagsToSummary(pTagsToAdd)
}

createAdjMatrix()
addItemCostsToAdjMatrix()
contraBalances()
// renderSummary()


/*
    Adjacency Matrix - For Summary
*/
function createAdjMatrix() {
    // 0: x owes y, 1: y owes x
    for (let i = 0; i < names.length; i++) {
        adjMatrix.push(Array(names.length).fill(0))
    }
}

function addItemCostsToAdjMatrix() {
    for (let i = 0; i < items.length; i++) {
        let idxPersonWhoPaid = names.indexOf(items[i].who_paid)
        if (idxPersonWhoPaid === -1) {
            console.log('something wrong')
            return
        }
        let peopleToReceiveFrom = items[i].to_receive_from
        for (let j = 0; j < peopleToReceiveFrom.length; j++) {
            let idxPersonToPay = names.indexOf(peopleToReceiveFrom[j])
            if (idxPersonToPay === idxPersonWhoPaid) {
                continue
            }
            adjMatrix[idxPersonToPay][idxPersonWhoPaid] = Utils.roundToTwoDp(adjMatrix[idxPersonToPay][idxPersonWhoPaid] + items[i].cost_per_pax)
        }
    }
    console.log(`adjMatrix[original]: ${adjMatrix}`)
}

function contraBalances() {
    for (let i = 0; i < names.length; i++) {
        for (let j = 0; j < names.length; j++) {
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
                adjMatrix[i][j] = Utils.roundToTwoDp(owingValue - receivingValue)
                adjMatrix[j][i] = 0
            }
            else if (receivingValue > owingValue && owingValue > 0) {
                adjMatrix[j][i] = Utils.roundToTwoDp(receivingValue - owingValue)
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
            <template #title>{{ names[xIndex] }}</template>
            <template #content>
                <div v-for="(item, yIndex) in row">
                    <p v-if="adjMatrix[xIndex][yIndex] > 0">
                        To Receive From {{ names[yIndex] }}: {{ adjMatrix[xIndex][yIndex] }}
                    </p>
                    <p v-if="adjMatrix[yIndex][xIndex] > 0">
                        Owe {{ names[yIndex] }}: {{ adjMatrix[yIndex][xIndex] }}
                    </p>
                </div>
            </template>
        </Card>
        <Divider />

        <h1>Items Logs</h1>

        <Card v-for="item in items" class="card-style">
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
        </Card>

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