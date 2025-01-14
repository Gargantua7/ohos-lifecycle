import { uiObserver } from "@kit.ArkUI"

export interface LifecycleObserver {}

export interface DefaultLifecycleObserver extends LifecycleObserver {


    readonly aboutToAppear?: () => void,
    readonly aboutToDisappear?: () => void,
    readonly onPageShow?: () => void,
    readonly onPageHide?: () => void,
    readonly onBackPress?: () => void

}

export interface LifecycleEventObserver extends LifecycleObserver {

    readonly onStateChanged: (state: uiObserver.RouterPageState) => void

}