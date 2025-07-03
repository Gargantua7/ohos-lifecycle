import { uiObserver } from "@kit.ArkUI";
import { Lifecycle } from "../lifecycle/Lifecycle";
import { ViewModel } from "./ViewModel";
import { AbstractLifecycleScope } from "../coroutines/AbstractLifecycleScope";

export class ViewModelScope extends AbstractLifecycleScope {


    constructor(lifecycle: Lifecycle, owner: ViewModel) {
        super()
        lifecycle.addObserver({
            onStateChanged: (state: uiObserver.RouterPageState) => {

                this.canExecute = !owner.isClear && (state === uiObserver.RouterPageState.ON_PAGE_SHOW || state === uiObserver.RouterPageState.ON_BACK_PRESS)

                if (state === uiObserver.RouterPageState.ON_PAGE_SHOW || state === uiObserver.RouterPageState.ON_BACK_PRESS) {
                    this.execute()
                }
            }
        })
    }
}