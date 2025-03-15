<script setup>
import { roundToTwoDp } from '@/helpers/utils.js';
import { NAMES, ITEMS } from './Calculator/calculatorStates.js';
import ItemLogs from './Calculator/ItemLogs.vue';
import html2canvas from 'html2canvas';

const adjMatrix = []
const backgroundColor = '#18181b'

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

function screenShotFullPage() {
    html2canvas(document.querySelector(`#settleup-breakdown`),
        {
            backgroundColor: backgroundColor
        }).then(canvas => {
            html2canvas(document.querySelector(`#items-breakdown`),
                {
                    backgroundColor: backgroundColor
                }).then(canvas2 => {
                    var dataURL = verticalCanvases(canvas, canvas2)
                    downloadImage(dataURL, `summary.jpeg`);
                });
        });
}

function screenShotComponent(id) {
    html2canvas(document.querySelector(`#${id}`),
        {
            backgroundColor: backgroundColor
        }).then(canvas => {
            let dataURL = canvas.toDataURL("image/jpeg", 1.0);
            downloadImage(dataURL, `${id}.jpeg`);
        });
}

/* assumes each canvas has the same width */
var verticalCanvases = function (cnv1, cnv2) {
    var newCanvas = document.createElement('canvas')
    let ctx = newCanvas.getContext('2d')
    let width = cnv1.width
    let height = cnv1.height + cnv2.height

    newCanvas.width = width;
    newCanvas.height = height;

    [{
        cnv: cnv1,
        y: 0
    },
    {
        cnv: cnv2,
        y: cnv1.height
    }].forEach(function (n) {
        ctx.beginPath();
        ctx.drawImage(n.cnv, 0, n.y, width, n.cnv.height);
    });

    return newCanvas.toDataURL("image/jpeg", 1.0);
};

function downloadImage(data, filename = 'untitled.jpeg') {
    var a = document.createElement('a');
    a.href = data;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
}

</script>

<template>
    <div class="container">
        <div class="title-container">
            <h1>Summary</h1>
            <Button icon='pi pi-download' iconPos="left" label="Save Screenshot" @click="screenShotFullPage()" />
        </div>

        <Divider />
        <div v-if="ITEMS.value.length >= 1">
            <div id="settleup-breakdown">
                <div class="title-container">
                    <h1>To Settle Up</h1>
                    <Button icon='pi pi-download' iconPos="left" @click="screenShotComponent('settleup-breakdown')" />
                </div>
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

            </div>
            <Divider />

            <div id="items-breakdown">
                <div class="title-container">
                    <h1>Items Logs</h1>
                    <Button icon='pi pi-download' iconPos="left" @click="screenShotComponent('items-breakdown')" />
                </div>
                <ItemLogs :editable="false" />

            </div>


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
.title-container {
    display: flex;
    flex-direction: row;
    gap: 12px;
    align-items: center;
}

.title-container button {
    height: 36px;
}

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