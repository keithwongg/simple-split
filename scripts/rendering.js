/*
    UI Rendering
*/
function renderNamesInUi() {
    if (getFromLocalStorage(NAMES_KEY) === undefined) {
        return
    }
    let names = JSON.parse(getFromLocalStorage(NAMES_KEY))
    renderListOfNames(names)
    renderDropdownOptions(names)
    renderListOfWhoToSplitWith(names)
}

function renderListOfNames(names) {
    var listOfNames = document.getElementById('names-list-text')
    listOfNames.innerHTML = ''
    for(let i = 0; i < names.length; i++) {
        listOfNames.appendChild(namePillButtonCreate(names[i]))
    }
}

function renderListOfWhoToSplitWith(names) {
    var listOfNames = document.getElementById('inputSplitWith')
    listOfNames.innerHTML = ''
    for(let i = 0; i < names.length; i++) {
        listOfNames.appendChild(whoToSplitWithPillButtonCreate(names[i]))
    }
}

function renderDropdownOptions(names) {
    var whoPaidDropdown = document.getElementById('opts-who-paid')
    var personPayingDropdown = document.getElementById('opts-person-paying')
    var personReceivingDropdown = document.getElementById('opts-person-receiving')
    whoPaidDropdown.innerHTML = ''
    personPayingDropdown.innerHTML = ''
    personReceivingDropdown.innerHTML = ''
    for (let i = 0; i < names.length; i++) {
        var option = document.createElement('option')
        option.value = names[i]
        option.text = names[i]
        whoPaidDropdown.appendChild(option)
        personPayingDropdown.appendChild(option.cloneNode(true))
        personReceivingDropdown.appendChild(option.cloneNode(true))
    }
}

function renderLogsInUi() {
    if (getFromLocalStorage(ITEMS_KEY) === undefined) {
        return
    }
    let items = JSON.parse(getFromLocalStorage(ITEMS_KEY))
    sortItemsById(items)

    let table = document.getElementById('log-items')
    table.innerHTML = ''
    for(let i = 0; i < items.length; i++) {
        let entryRow = document.createElement('tr')
        entryRow.value = i

        let whoPaid = document.createElement('td')
        whoPaid.innerText = items[i].who_paid
        entryRow.appendChild(whoPaid)

        let itemDescription = document.createElement('td')
        itemDescription.innerText = items[i].description
        entryRow.appendChild(itemDescription)

        let cost = document.createElement('td')
        cost.innerText = items[i].cost
        entryRow.appendChild(cost)

        let costPerPax = document.createElement('td')
        costPerPax.innerText = items[i].cost_per_pax
        entryRow.appendChild(costPerPax)

        let splitWith = document.createElement('td')
        splitWith.innerText = items[i].to_receive_from
        entryRow.appendChild(splitWith)

        let delButton = delButtonForItemLogs(items[i].id)
        entryRow.appendChild(delButton)

        table.appendChild(entryRow)
    }
}

function renderWhoOweWhoLogsInUi() {
    if (getFromLocalStorage(ITEMS_KEY) === undefined) {
        return
    }
    let items = JSON.parse(getFromLocalStorage(ITEMS_KEY))
    sortItemsById(items)

    let table = document.getElementById('who-owe-who')
    table.innerHTML = ''
    for(let i = 0; i < items.length; i++) {
        let entryRow = document.createElement('tr')
        entryRow.value = i

        let whoPaid = document.createElement('td')
        whoPaid.innerText = items[i].who_paid
        entryRow.appendChild(whoPaid)

        let itemDescription = document.createElement('td')
        itemDescription.innerText = items[i].description
        entryRow.appendChild(itemDescription)

        let cost = document.createElement('td')
        cost.innerText = items[i].cost
        entryRow.appendChild(cost)

        let splitWith = document.createElement('td')
        splitWith.innerText = items[i].to_receive_from
        entryRow.appendChild(splitWith)

        let delButton = delButtonForItemLogs(items[i].id)
        entryRow.appendChild(delButton)

        table.appendChild(entryRow)
    }

}

function renderP2PLogsInUi() {
    if (getFromLocalStorage(P2P_KEY) === undefined) {
        return
    }
    let items = JSON.parse(getFromLocalStorage(P2P_KEY))
    sortItemsById(items)

    let table = document.getElementById('p2p-trf')
    table.innerHTML = ''
    for(let i = 0; i < items.length; i++) {
        let entryRow = document.createElement('tr')
        entryRow.value = i

        let payee = document.createElement('td')
        payee.innerText = items[i].payee
        entryRow.appendChild(payee)

        let recipient = document.createElement('td')
        recipient.innerText = items[i].recipient
        entryRow.appendChild(recipient)

        let cost = document.createElement('td')
        cost.innerText = items[i].cost
        entryRow.appendChild(cost)

        let delButton = delButtonForP2PLogs(items[i].id)
        entryRow.appendChild(delButton)

        table.appendChild(entryRow)
    }
}

function sortItemsById(items) {
    items.sort(function(a, b) {
        return (a.id < b.id)
    })
}

function sortItemsByWhoPaid(items) {
    items.sort(function(a, b) {
        if (a.who_paid < b.who_paid) {
            return -1
        }
        if (a.who_paid > b.who_paid) {
            return 1
        }
        return 0
    })
}

function showErrorForSeconds(domId, seconds){
    let alert = document.getElementById(domId)
    alert.classList.remove('hidden')
    setTimeout(() => {
        alert.classList.add('hidden')
    }, (seconds * 1000))
}