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
    }
})
