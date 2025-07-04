import { uiObserver } from "@kit.ArkUI";
import { LifecycleObserver } from "./LifecycleObserver";
import { HashSet } from "@kit.ArkTS";
import { common } from '@kit.AbilityKit';
import { AbilityStore, LifecycleEventDistributor } from "./AbilityStore";
import { LifecycleScope } from "./LifecycleScope";
import { Component } from "../ref/Component";
import { mapNavDestinationStateToRouterPageState } from "../utils/StateMapper";

export class Lifecycle {

    static getOrCreate(component: Component) {
        let abilityContext: common.UIAbilityContext
        let info: uiObserver.RouterPageInfo | uiObserver.NavDestinationInfo

        try {
            abilityContext = component.getUIContext().getHostContext()! as common.UIAbilityContext
            info = component.queryNavDestinationInfo() ?? component.queryRouterPageInfo()!
        } catch (e) {
            throw new Error(`${component} is not a page or component`)
        }

        const abilityLifecycle = AbilityStore.get(abilityContext)
        if (!abilityLifecycle) {
            throw new Error(`The ability what ${info.name} be hosted is not registered`)
        }

        return abilityLifecycle.getOrCreateLifecycle(info)
    }

    static fromRouter(info: uiObserver.RouterPageInfo): Lifecycle {
        return new Lifecycle(info.state)
    }

    static fromNavigation(info: uiObserver.NavDestinationInfo): Lifecycle {
        return new Lifecycle(mapNavDestinationStateToRouterPageState(info.state))
    }

    private _currState: uiObserver.RouterPageState
    private _observers = new HashSet<LifecycleObserver>()
    private _lifecycleScope?: LifecycleScope

    private constructor(initState: uiObserver.RouterPageState) {

        this._currState = initState

        this._observers.add({
            onStateChanged: (state) => {
                if (state !== uiObserver.RouterPageState.ON_BACK_PRESS) {
                    this._currState = state
                }
            }
        })
    }

    get currState() { return this._currState }
    get observers() { return this._observers }
    get lifecycleScope() {
        if (!this._lifecycleScope) {
            this._lifecycleScope = new LifecycleScope(this)
        }
        return this._lifecycleScope
    }

    addObserver(observer: LifecycleObserver, receiveSticky: boolean = true) {
        if (receiveSticky) {
            LifecycleEventDistributor.distribution(observer, this.currState)
        }
        this._observers.add(observer)
    }

    removeObserver(observer: LifecycleObserver) {
        this._observers.remove(observer)
    }
}