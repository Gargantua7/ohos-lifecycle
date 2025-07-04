import { Lifecycle } from "./Lifecycle"
import { HashMap } from "@kit.ArkTS"
import { uiObserver } from "@kit.ArkUI"
import { LifecycleObserver, DefaultLifecycleObserver, LifecycleEventObserver } from "./LifecycleObserver"
import { common } from '@kit.AbilityKit';
import { mapNavDestinationStateToRouterPageState } from "../utils/StateMapper";
import { select } from "../utils/InfoSelector";

export class AbilityStore {

    private static abilities = new HashMap<common.UIAbilityContext, AbilityStore>()

    static register(context: common.UIAbilityContext) {
        if (this.isRegistered(context)) return
        AbilityStore.abilities.set(context, new AbilityStore(context))
    }

    static unregister(context: common.UIAbilityContext) {
        if (!this.isRegistered(context)) return
        AbilityStore.abilities.remove(context)
        uiObserver.off("routerPageUpdate", context)
    }

    static isRegistered(context: common.UIAbilityContext): boolean {
        return AbilityStore.abilities.hasKey(context)
    }

    static get(context: common.UIAbilityContext): AbilityStore | undefined {
        return AbilityStore.abilities.get(context)
    }

    private lifecycles = new HashMap<string, Lifecycle>()

    constructor(context: common.UIAbilityContext) {

        uiObserver.on("routerPageUpdate", context, (it) => {
            this.distribution(it)
        })


        uiObserver.on("navDestinationUpdate", (it) => {
            this.distribution(it)
        })
    }

    getOrCreateLifecycle(info: uiObserver.RouterPageInfo | uiObserver.NavDestinationInfo) {

        const id = this.idOf(info)

        if (!this.lifecycles.hasKey(id)) {
            const lifecycle = select(
                info,
                info => Lifecycle.fromRouter(info),
                info => Lifecycle.fromNavigation(info)
            )
            this.lifecycles.set(id, lifecycle)
        }

        return this.lifecycles.get(id)
    }

    distribution(info: uiObserver.RouterPageInfo | uiObserver.NavDestinationInfo) {
        const id = this.idOf(info)
        if (this.lifecycles.hasKey(id)) {
            const lifecycle = this.lifecycles.get(id)!
            const state = select(
                info,
                info => info.state,
                info => mapNavDestinationStateToRouterPageState(info.state)
            )
            if (state === lifecycle.currState) return
            lifecycle.observers.forEach((observer) => {
                LifecycleEventDistributor.distribution(observer, state)
            })
        }
    }

    private idOf(info: uiObserver.RouterPageInfo | uiObserver.NavDestinationInfo) {
        return select(
            info,
            info => `${info.path}[${info.pageId}]`,
            info => `${info.name}[${info.navDestinationId}]`
        )
    }
}

export class LifecycleEventDistributor {

    static distribution(observer: LifecycleObserver, state: uiObserver.RouterPageState) {

        (observer as LifecycleEventObserver).onStateChanged?.call(observer, state)

        switch (state) {
            case uiObserver.RouterPageState.ABOUT_TO_APPEAR:
                (observer as DefaultLifecycleObserver).aboutToAppear?.call(observer)
                break
            case uiObserver.RouterPageState.ABOUT_TO_DISAPPEAR:
                (observer as DefaultLifecycleObserver).aboutToDisappear?.call(observer)
                break
            case uiObserver.RouterPageState.ON_PAGE_SHOW:
                (observer as DefaultLifecycleObserver).onPageShow?.call(observer)
                break
            case uiObserver.RouterPageState.ON_PAGE_HIDE:
                (observer as DefaultLifecycleObserver).onPageHide?.call(observer)
                break
            case uiObserver.RouterPageState.ON_BACK_PRESS:
                (observer as DefaultLifecycleObserver).onBackPress?.call(observer)
                break
        }
    }

}