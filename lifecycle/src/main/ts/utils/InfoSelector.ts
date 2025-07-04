import { uiObserver } from "@kit.ArkUI";

export function select<R>(
    info: uiObserver.RouterPageInfo | uiObserver.NavDestinationInfo,
    isRouter: (info: uiObserver.RouterPageInfo) => R,
    isNav: (info: uiObserver.NavDestinationInfo) => R,
) {

    if (info.hasOwnProperty("context")) {
        return isRouter(info as uiObserver.RouterPageInfo)
    } else {
        return isNav(info as uiObserver.NavDestinationInfo)
    }
    
}