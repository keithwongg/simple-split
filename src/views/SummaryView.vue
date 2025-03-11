<script setup>
import { roundToTwoDp } from '@/helpers/utils.js';
import { NAMES, ITEMS } from './Calculator/calculatorStates.js';
import ItemLogs from './Calculator/ItemLogs.vue';
import { ref } from 'vue';
import { Buffer } from 'buffer';

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


const table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;<=>?@[]^_`{|}~"';
function decode(data, encoding) {
    const raw = '' + (data || '');
    const len = raw.length;
    const ret = [];

    let b = 0;
    let n = 0;
    let v = -1;

    for (let i = 0; i < len; i++) {
        const p = table.indexOf(raw[i]);
        if (p === -1) continue;
        if (v < 0) {
            v = p;
        } else {
            v += p * 91;
            b |= v << n;
            n += (v & 8191) > 88 ? 13 : 14;
            do {
                ret.push(b & 0xff);
                b >>= 8;
                n -= 8;
            } while (n > 7);
            v = -1;
        }
    }

    if (v > -1) {
        ret.push((b | v << n) & 0xff);
    }

    return encoding ?
        Buffer.from(ret).toString(encoding) :
        Buffer.from(ret);
};

function encode(data, encoding = 'utf8') {
    if (data == null) {
        throw new Error('base91: Missing data to encode.');
    }
    const raw = Buffer.isBuffer(data) ? data :
        typeof data === 'number' ? Buffer.from(data.toString(), encoding) :
            Buffer.from(data, encoding);
    const len = raw.length;
    let ret = '';

    let n = 0;
    let b = 0;

    for (let i = 0; i < len; i++) {
        b |= raw[i] << n;
        n += 8;

        if (n > 13) {
            let v = b & 8191;
            if (v > 88) {
                b >>= 13;
                n -= 13;
            } else {
                v = b & 16383;
                b >>= 14;
                n -= 14;
            }
            ret += table[v % 91] + table[v / 91 | 0];
        }
    }

    if (n) {
        ret += table[b % 91];
        if (n > 7 || b > 90) ret += table[b / 91 | 0];
    }

    return ret;
};

function exportCurrentData() {

    let data = JSON.stringify({ items: ITEMS.value, names: NAMES.value })
    // console.log(`checkdata: ${data}`)
    // let bindata = new TextEncoder().encode(data)
    // console.log(`checkbindata: ${btoa(bindata)}`)
    // let decdata = new TextDecoder().decode(bindata)
    // console.log(`checkdecodeddata: ${decdata}`)

    const encodedText = encode(data);
    console.log(`base91: ${encodedText} | length: ${encodedText.length}`);  //=> >OwJh>Io0Tv!8PE
    const deco = decode(encodedText)
    console.log(`specialdecode: ${deco}`);  //=> >OwJh>Io0Tv!8PE
    console.log(`specialdecode-pasre: ${JSON.parse(deco)}`);  //=> >OwJh>Io0Tv!8PE

    let base64Encoded = btoa(data)
    console.log(`btoa: ${base64Encoded} | length: ${base64Encoded.length}`);  //=> >OwJh>Io0Tv!8PE
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