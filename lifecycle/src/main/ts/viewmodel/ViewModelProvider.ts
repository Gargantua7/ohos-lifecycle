import { Lifecycle } from "../lifecycle/Lifecycle";
import { Component } from "../ref/Component";
import { ViewModel } from "./ViewModel";
import { DefaultViewModelFactory, ViewModelFactory } from "./ViewModelFactory";
import { GlobalViewModelOwnerStore } from "./ViewModelStoreOwner";

export class ViewModelProvider {

    private page: Component
    private factory: ViewModelFactory

    static of(page: Component, factory: ViewModelFactory = DefaultViewModelFactory) {
        return new ViewModelProvider(page, factory)
    }

    constructor(page: Component, factory: ViewModelFactory = DefaultViewModelFactory) {
        this.page = page
        this.factory = factory
    }

    get<VM extends ViewModel>(modelClass: new (extras?: object) => VM, extras: object = {}): VM {
        const lifecycle = Lifecycle.getOrCreate(this.page)
        const owner = GlobalViewModelOwnerStore.getOrCreate(lifecycle)
        const store = owner.viewModelStore

        let viewModel = store.get(modelClass.name)
        if (!viewModel || viewModel.isClear) {
            viewModel = this.factory.create(modelClass, extras)
            viewModel.injectLifecycle(lifecycle)
            store.put(modelClass.name, viewModel)
        }

        if (viewModel.constructor !== modelClass) {
            throw new Error("ViewModelProvider: ViewModelFactory returned a different ViewModel class, name: " + modelClass.name)
        }

        return viewModel as VM
    }
}