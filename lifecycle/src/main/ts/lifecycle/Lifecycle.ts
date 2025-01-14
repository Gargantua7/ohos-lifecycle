import { uiObserver } from "@kit.ArkUI";
import { LifecycleObserver } from "./LifecycleObserver";
import { HashSet } from "@kit.ArkTS";
import { common } from '@kit.AbilityKit';
import { AbilityStore, LifecycleEventDistributor } from "./AbilityStore";
import { LifecycleScope } from "./LifecycleScope";
import { Page } from "../ref/Page";

export class Lifecycle {

    static getOrCreate(page: Page) {
        let abilityContext: common.UIAbilityContext
        let pageInfo: uiObserver.RouterPageInfo

        try {
            abilityContext = page.getUIContext().getHostContext()! as common.UIAbilityContext
            pageInfo = page.queryRouterPageInfo()!
        } catch (e) {
            throw new Error(`${page} is not a page or component`)
        }

        const abilityLifecycle = AbilityStore.get(abilityContext)
        if (!abilityLifecycle) {
            throw new Error(`The ability what ${pageInfo.path} be hosted is not registered`)
        }

        return abilityLifecycle.getOrCreateLifecycle(pageInfo)
    }

    static pageIdOf(pageInfo: uiObserver.RouterPageInfo) {
        return `${pageInfo.path}[${pageInfo.pageId}]`
    }

    private readonly pageId: string
    private _currState: uiObserver.RouterPageState
    private _observers = new HashSet<LifecycleObserver>()
    private _lifecycleScope?: LifecycleScope

    constructor(pageInfo: uiObserver.RouterPageInfo) {

        this.pageId = Lifecycle.pageIdOf(pageInfo)
        this._currState = pageInfo.state

        this._observers.add({
            onStateChanged: (state) => {
                this._currState = state
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