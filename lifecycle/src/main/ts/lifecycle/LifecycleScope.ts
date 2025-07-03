import { Lifecycle } from "./Lifecycle";
import { uiObserver } from "@kit.ArkUI";
import { AbstractLifecycleScope } from "../coroutines/AbstractLifecycleScope";

export class LifecycleScope extends AbstractLifecycleScope {


    constructor(lifecycle: Lifecycle) {
        super()
        lifecycle.addObserver({
            onStateChanged: (state: uiObserver.RouterPageState) => {

                this.canExecute = state === uiObserver.RouterPageState.ON_PAGE_SHOW || state === uiObserver.RouterPageState.ON_BACK_PRESS

                if (state === uiObserver.RouterPageState.ON_PAGE_SHOW || state === uiObserver.RouterPageState.ON_BACK_PRESS) {
                    this.execute()
                } else if (state === uiObserver.RouterPageState.ABOUT_TO_DISAPPEAR) {
                    this.clear()
                }
            }
        })
    }
}