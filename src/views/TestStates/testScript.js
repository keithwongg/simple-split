import { reactive } from "vue"
import { getFromLocalStorageAsArray, saveInLocalStorage } from "@/helpers/utils"

export const FRUITS = reactive({
    value: getFromLocalStorageAsArray("fruits"),
    add(fruit) {
        console.log(`got click???`)
        this.value.push(fruit)
        saveInLocalStorage("fruits", this.value)
    },
    remove(fruit) {
        let indexOf = this.value.indexOf(fruit)
        console.log(`indexof fruit: ${indexOf}`)
        if (indexOf === -1) {
            return
        }
        this.value.splice(indexOf, 1)
        saveInLocalStorage("fruits", this.value)
    }
})