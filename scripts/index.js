const NAMES_KEY = "names";
const ITEMS_KEY = "items";
const BALANCE_KEY = "balance";
const P2P_KEY = "p2p";

/*
schema:

names: ["person 1", "person 2"]

items: [{
    description: "item1",
    cost: "20",
    who_paid: "person 1",
    to_receive_from: ["person 1", "person 2"]
}]

p2p: [{
    payee: "person 1",
    recipient: "person 2",
    cost: "10"
}]

// this one should be calculated
balance: [{
    "person 1" : {
        "person 2": 30,
        "person 2": 20
    }
    to_receive: 50
}]
*/

window.onload = function (e) {
    renderNamesInUi()
    renderLogsInUi()
    renderP2PLogsInUi()
    // render balance in ui??
}

function addName() {
    var name = document.getElementById('name')
    if (name.value.length <= 0) {
        return;
    }
    saveName(name.value)
    renderNamesInUi()
    name.value = ''
}

/*
    NAMES
*/
function saveName(name) {
    let names = getFromLocalStorage(NAMES_KEY)
    if (names === undefined) {
        saveInLocalStorage(NAMES_KEY, [name])
        return
    }
    let namesArray = JSON.parse(names)
    namesArray.push(name)
    let uniqueNames = [...new Set(namesArray)]
    saveInLocalStorage(NAMES_KEY, uniqueNames)
}

function removeName(name) {
    let names = getFromLocalStorage(NAMES_KEY)
    if (names === undefined) {
        return;
    }
    let namesArray = JSON.parse(names)
    let index = namesArray.indexOf(name)
    if (index > -1) {
        namesArray.splice(index, 1)
    }
    saveInLocalStorage(NAMES_KEY, namesArray)
    return namesArray
}

/*
    ITEMS and COSTS
*/
function splitWithAll() {
    if (getFromLocalStorage(NAMES_KEY) === undefined) {
        return
    }
    let names = JSON.parse(getFromLocalStorage(NAMES_KEY))
    renderListOfWhoToSplitWith(names)
}

function addWhoPaidForItemsLog() {
    let whoPaid = document.getElementById('opts-who-paid')
    let description = document.getElementById('item-description')
    let cost = document.getElementById('item-cost')
    let names = getWhoToSplitNamesFromUi()

    let itemsArr = getFromLocalStorage(ITEMS_KEY)
    if (itemsArr === undefined) {
        itemsArr = []
    } else {
        itemsArr = JSON.parse(itemsArr)
    }
    let item = {
        id: itemsArr.length + 1,
        description: description.value,
        cost: cost.value,
        who_paid: whoPaid.value,
        to_receive_from: names
    }
    itemsArr.push(item)

    saveInLocalStorage(ITEMS_KEY, itemsArr)
    saveInLocalStorage(BALANCE_KEY, itemsArr)

    // render logs in UI
    renderLogsInUi()

    // tally balance
    // tallyBalance()

}

function getWhoToSplitNamesFromUi() {
    let container = document.getElementById('inputSplitWith')
    let buttonNames = container.childNodes
    let names = []
    buttonNames.forEach((name) => {
        names.push(name.value)
    })
    return names
}

function removeItemFromStorageById(id, key) {
    let items = getFromLocalStorage(key)
    if (items === undefined) {
        return;
    }
    let itemsArray = JSON.parse(items)
    for (let i = 0; i < itemsArray.length; i++) {
        if (itemsArray[i].id === id) {
            itemsArray.splice(i, 1)
        }
    }
    saveInLocalStorage(key, itemsArray)
    return itemsArray
}

function tallyBalance() {
    // calculationlogic
    if (getFromLocalStorage(BALANCE_KEY) === undefined) {
        return
    }
    let items = JSON.parse(getFromLocalStorage(BALANCE_KEY))
    let dictBalance = {}
    for (let i = 0; i < items.length; i++) {
        if (dictBalance[items.who_paid] === undefined) {
            dictBalance[items.who_paid] = {
                to_receive: items.cost,
                to_receive_from: items.to_receive_from
            }
        } else {
            dictBalance[items.who_paid] += items.cost
        }
    }
    // render in UI
    let balanceDiv = document.getElementById('balance-description')
    dictBalance.forEach((key, value) => {
        console.log(`moneeky: key ${key} value ${value}`)
    })
}


/*
    Who Pay Who Add Log
*/
function whoPayWhoAddLog() {
    let payee = document.getElementById('opts-person-paying')
    let recipient = document.getElementById('opts-person-receiving')
    let cost = document.getElementById('who-pay-who-cost')

    if (payee.value === recipient.value) {
        showErrorForSeconds('error-who-paid-who', 5)
        return
    }

    let p2pData = getFromLocalStorage(P2P_KEY)
    if (p2pData === undefined) {
        p2pData = []
    } else {
        p2pData = JSON.parse(p2pData)
    }
    let item = {
        id: p2pData.length + 1,
        payee: payee.value,
        recipient: recipient.value,
        cost: cost.value
    }
    p2pData.push(item)

    saveInLocalStorage(P2P_KEY, p2pData)

    // render logs in UI
    renderP2PLogsInUi()

    // tally balance
    // tallyBalance()


}
