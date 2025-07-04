import { Lifecycle, registerComponentIntoLifecycle } from '@gargantua7/lifecycle'
import { hilog } from '@kit.PerformanceAnalysisKit'

@Builder
export function NavSecondBuilder() {
    NavDestination() {
        NavSecond()
    }.hideBackButton(true)

}

@Component
struct NavSecond {

    @State state: string = ""
    @State count: number = 0

    aboutToAppear(): void {
        this.state = "aboutToAppear"
        hilog.info(0x0000, 'testTag', '%{public}s', 'NavSecond aboutToAppear')
        registerComponentIntoLifecycle(this)
    }

    onPageShow(): void {
        this.state = "onPageShow"
        hilog.info(0x0000, 'testTag', '%{public}s', 'NavSecond onPageShow')
    }

    onPageHide(): void {
        this.state = "onPageHide"
        hilog.info(0x0000, 'testTag', '%{public}s', 'NavSecond onPageHide')
    }

    aboutToDisappear(): void {
        this.state = "aboutToDisappear"
        hilog.info(0x0000, 'testTag', '%{public}s', 'NavSecond aboutToDisappear')
    }

    build() {
        Column() {

            Text(this.state)
            Text(this.count.toString())

        }.width("100%")
        .height("100%")
        .onClick(() => this.count++)
    }

}