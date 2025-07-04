import { UIContext, uiObserver } from "@kit.ArkUI";

export interface Component {

    getUIContext(): UIContext,
    getUniqueId(): number,
    queryRouterPageInfo(): uiObserver.RouterPageInfo | undefined

    queryNavigationInfo(): uiObserver.NavigationInfo | undefined
    queryNavDestinationInfo(): uiObserver.NavDestinationInfo | undefined

    aboutToAppear?: () => void
    aboutToDisappear?: () => void
    onPageShow?: () => void
    onPageHide?: () => void
    onBackPress?: () => boolean | void

}

export type Page = Component