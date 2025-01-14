import { UIContext, uiObserver } from "@kit.ArkUI";

export interface Page {

    getUIContext: () => UIContext,
    getUniqueId: () => number,
    queryRouterPageInfo: () => uiObserver.RouterPageInfo | undefined

}