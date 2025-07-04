import { uiObserver } from '@kit.ArkUI'

const map = new Map<uiObserver.NavDestinationState, uiObserver.RouterPageState>(
    [
        [uiObserver.NavDestinationState.ON_WILL_APPEAR, uiObserver.RouterPageState.ABOUT_TO_APPEAR],
        [uiObserver.NavDestinationState.ON_APPEAR, uiObserver.RouterPageState.ABOUT_TO_APPEAR],
        [uiObserver.NavDestinationState.ON_WILL_DISAPPEAR, uiObserver.RouterPageState.ABOUT_TO_DISAPPEAR],
        [uiObserver.NavDestinationState.ON_DISAPPEAR, uiObserver.RouterPageState.ABOUT_TO_DISAPPEAR],
        [uiObserver.NavDestinationState.ON_WILL_SHOW, uiObserver.RouterPageState.ON_PAGE_SHOW],
        [uiObserver.NavDestinationState.ON_SHOWN, uiObserver.RouterPageState.ON_PAGE_SHOW],
        [uiObserver.NavDestinationState.ON_WILL_HIDE, uiObserver.RouterPageState.ON_PAGE_HIDE],
        [uiObserver.NavDestinationState.ON_HIDDEN, uiObserver.RouterPageState.ON_PAGE_HIDE],

        [8, uiObserver.RouterPageState.ON_PAGE_SHOW], // compat as ON_ACTIVE
        [9, uiObserver.RouterPageState.ON_PAGE_HIDE], // compat as ON_INACTIVE

        [uiObserver.NavDestinationState.ON_BACKPRESS, uiObserver.RouterPageState.ON_BACK_PRESS]
    ]
)

export function mapNavDestinationStateToRouterPageState(
    state: uiObserver.NavDestinationState
): uiObserver.RouterPageState {
    return map.get(state)!
}