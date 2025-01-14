import { NotifyCenter } from './NotifyCenter'

@Entry
@ComponentV2
struct Second {

    build() {
        Column() {

            Button("Notify Index page toast")
                .fontSize(12)
                .fontWeight(FontWeight.Bold)
                .onClick(() => {
                    NotifyCenter.getInstance().notify()
                })
        }
        .height('100%')
        .width('100%')
    }

}

