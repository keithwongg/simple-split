/*
    UTILS
*/
export function getFromLocalStorage(key) {
    return localStorage.getItem(key) ?? undefined
}

export function getFromLocalStorageAsArray(key) {
    let itemsArr = getFromLocalStorage(key)
    if (itemsArr === undefined) {
        itemsArr = []
    } else {
        itemsArr = JSON.parse(itemsArr)
    }
    return itemsArr
}

export function getIndexOfPersonByName(name) {
    let namesArr = getFromLocalStorageAsArray(NAMES_KEY)
    return namesArr.indexOf(name)
}

export function saveInLocalStorage(key, content) {
    localStorage.setItem(key, JSON.stringify(content))
}

export function removeItemFromStorageById(id, key) {
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

export function clearAll() {
    localStorage.removeItem(NAMES_KEY)
    localStorage.removeItem(ITEMS_KEY)
    localStorage.removeItem(P2P_KEY)
    localStorage.removeItem(ADJMATRIX_KEY)
    location.reload()
}

export function roundToTwoDp(num) {
    return +(Math.round(num + "e+2") + "e-2");
}

export function formatToShow2dpInUi(num) {
    return roundToTwoDp(num).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })
}

export function sortItemsById(items) {
    items.sort(function (a, b) {
        return (a.id < b.id)
    })
}

export function sortItemsByWhoPaid(items) {
    items.sort(function (a, b) {
        if (a.who_paid < b.who_paid) {
            return -1
        }
        if (a.who_paid > b.who_paid) {
            return 1
        }
        return 0
    })
}
