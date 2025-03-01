import { reactive } from "vue";
import { getFromLocalStorageAsArray, saveInLocalStorage, removeItemFromStorageById } from "@/helpers/utils";
import { NAMES_KEY, ITEMS_KEY } from "@/constants/constants";

export const NAMES = reactive({
    value: getFromLocalStorageAsArray(NAMES_KEY),
    add(name) {
        this.value.push(name)
        saveInLocalStorage(NAMES_KEY, this.value)
    },
    remove(name) {
        let indexOf = this.value.indexOf(name)
        if (indexOf === -1) {
            return
        }
        this.value.splice(indexOf, 1)
        saveInLocalStorage(NAMES_KEY, this.value)
        // remove name in all items
        // then need to refresh component
    },
});


export const ITEMS = reactive({
    value: getFromLocalStorageAsArray(ITEMS_KEY),
    add(item) {
        this.value.push(item)
        saveInLocalStorage(ITEMS_KEY, this.value)
    },
    remove(id) {
        this.value = removeItemFromStorageById(id, ITEMS_KEY)
    },
    removeName(id, name) {
        let indexOfObj = ITEMS.value.map(e => e.id).indexOf(id)
        let currentItem = ITEMS.value[indexOfObj]
        let nameExist = currentItem.to_receive_from.some(n => n === name)
        if (!nameExist) {
            console.log('no name to be deleted')
            return
        }
        let index = currentItem.to_receive_from.indexOf(name)
        currentItem.to_receive_from.splice(index, 1)
        if (currentItem.to_receive_from === undefined || currentItem.to_receive_from.length <= 0) {
            ITEMS.value.splice(indexOfObj, 1)
            saveInLocalStorage(ITEMS_KEY, this.value)
        }
    }
})
