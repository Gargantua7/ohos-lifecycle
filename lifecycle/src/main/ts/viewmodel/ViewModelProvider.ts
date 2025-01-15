import { Lifecycle } from "../lifecycle/Lifecycle";
import { Page } from "../ref/Page";
import { ViewModel } from "./ViewModel";
import { DefaultViewModelFactory, ViewModelFactory } from "./ViewModelFactory";
import { GlobalViewModelOwnerStore } from "./ViewModelStoreOwner";

export class ViewModelProvider {

    private page: Page
    private factory: ViewModelFactory

    static of(page: Page, factory: ViewModelFactory = DefaultViewModelFactory) {
        return new ViewModelProvider(page, factory)
    }

    constructor(page: Page, factory: ViewModelFactory = DefaultViewModelFactory) {
        this.page = page
        this.factory = factory
    }

    get<VM extends ViewModel>(modelClass: new (extras?: object) => VM, name: string = "default", extras: object = {}): VM {
        const saveName = modelClass.name + "/" + name
        const lifecycle = Lifecycle.getOrCreate(this.page)
        const owner = GlobalViewModelOwnerStore.getOrCreate(lifecycle)
        const store = owner.viewModelStore

        let viewModel = store.get(saveName)
        if (!viewModel || viewModel.isClear) {
            viewModel = this.factory.create(modelClass, extras)
            viewModel.injectLifecycle(lifecycle)
            store.put(saveName, viewModel)
        }

        if (viewModel.constructor !== modelClass) {
            throw new Error("ViewModelProvider: ViewModelFactory returned a different ViewModel class, name: " + saveName)
        }

        return viewModel as VM
    }
}