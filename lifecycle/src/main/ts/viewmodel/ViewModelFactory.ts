import { ViewModel } from "./ViewModel";

export interface ViewModelFactory {

    create: (modelClass: new (extras?: object) => ViewModel, extras: object) => ViewModel

}

export const DefaultViewModelFactory : ViewModelFactory = {

    create(modelClass: new (extras?: object) => ViewModel, extras: object) {
        return new modelClass(extras)
    }

}