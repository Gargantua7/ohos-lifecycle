import { Lifecycle, LifecycleEventObserver, ViewModel, ViewModelProvider } from 'lifecycle';
import { promptAction, router } from '@kit.ArkUI';
import { NotifyCenter } from './NotifyCenter';

@Entry
@ComponentV2
struct Index {

    private lifecycle!: Lifecycle
    @Local private viewModel!: IndexViewModel

    aboutToAppear(): void {
        this.lifecycle = Lifecycle.getOrCreate(this)
        this.viewModel = ViewModelProvider.of(this).get(IndexViewModel)

        NotifyCenter.getInstance().addListener(() => {
            this.lifecycle.lifecycleScope.launch(() => {
                promptAction.showToast({
                    message: "Received from second page"
                })
            })
        })

        this.lifecycle.addObserver({
            onStateChanged: (state) => {
                promptAction.showToast({
                    message: "onStateChanged " + state
                })
            }
        } as LifecycleEventObserver)
    }

    build() {
        Column() {
            Button("Launch a coroutine at lifecycleScope")
                .fontSize(12)
                .fontWeight(FontWeight.Bold)
                .onClick(() => {
                    this.lifecycle.lifecycleScope.launch(() => {
                        promptAction.showToast({
                            message: "Hello from lifecycleScope"
                        })
                    })
                })

            Button("Launch a coroutine at viewModelScope")
                .fontSize(12)
                .fontWeight(FontWeight.Bold)
                .onClick(() => {

                    new ViewModelProvider(this).get(IndexViewModel).hello()
                })

            Button("Launch second page")
                .fontSize(12)
                .fontWeight(FontWeight.Bold)
                .onClick(() => {
                    router.pushUrl({
                        url: "pages/Second"
                    })
                })

            Component()
        }
        .height('100%')
        .width('100%')
    }
}

@ComponentV2
struct Component {

    private lifecycle!: Lifecycle

    aboutToAppear(): void {
        this.lifecycle = Lifecycle.getOrCreate(this)
        this.lifecycle.addObserver({
            onStateChanged: (state) => {
                promptAction.showToast({
                    message: "onStateChanged " + state
                })
            }
        } as LifecycleEventObserver)
    }

    build() {
    }
}

@ObservedV2
class IndexViewModel extends ViewModel {

    hello() {
        this.viewModelScope.launch(() => {
            promptAction.showToast({
                message: "Hello from viewModelScope"
            })
        })
    }

}