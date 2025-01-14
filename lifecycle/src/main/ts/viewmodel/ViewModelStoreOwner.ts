import { Lifecycle } from "../lifecycle/Lifecycle";
import { ViewModelStore } from "./ViewModelStore";
import { HashMap } from "@kit.ArkTS";

export interface ViewModelStoreOwner {

    viewModelStore: ViewModelStore

}

export class GlobalViewModelOwnerStore {

    private static owners = new HashMap<Lifecycle, ViewModelStoreOwner>()

    static getOrCreate(lifecycle: Lifecycle): ViewModelStoreOwner {

        if (!this.owners.hasKey(lifecycle)) {
            this.owners.set(lifecycle, {
                viewModelStore: new ViewModelStore()
            })

            lifecycle.addObserver({
                aboutToDisappear: () => {
                    this.owners.get(lifecycle)?.viewModelStore.clear()
                    this.owners.remove(lifecycle)
                }
            })
        }

        return this.owners.get(lifecycle)
    }

}