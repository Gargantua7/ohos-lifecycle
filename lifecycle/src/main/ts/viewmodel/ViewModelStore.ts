import { ViewModel } from "./ViewModel"

export class ViewModelStore {

    private store = new Map<string, ViewModel>()

    put(key: string, value: ViewModel) {
        this.store.set(key, value)
    }

    get(key: string) {
        return this.store.get(key)
    }

    clear() {
        this.store.forEach((value) => {
            value.clear()
        })
        this.store.clear()
    }

}