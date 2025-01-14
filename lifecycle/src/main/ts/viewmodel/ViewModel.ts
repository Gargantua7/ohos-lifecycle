import { Lifecycle } from "../lifecycle/Lifecycle";
import { Closeable } from "./Closeable";
import { ViewModelScope } from "./ViewModelScope";

export abstract class ViewModel {

    private _isClear: boolean = false
    private closeables: Closeable[] = []
    private lifecycle?: Lifecycle
    private _viewModelScope?: ViewModelScope

    get isClear() { return this._isClear }

    get viewModelScope() {
        if (!this._viewModelScope) {
            this._viewModelScope = new ViewModelScope(this.lifecycle!, this)
        }
        return this._viewModelScope
    }

    injectLifecycle(lifecycle: Lifecycle) {
        this.lifecycle = lifecycle
    }

    addCloseable(closeable: Closeable) {
        this.closeables.push(closeable)
    }

    clear() {

        this._isClear = true
        this.lifecycle = undefined
        this._viewModelScope?.clear()

        while (this.closeables.length > 0) {
            this.closeables.pop()?.close()
        }

    }
}