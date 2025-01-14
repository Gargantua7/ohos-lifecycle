export class NotifyCenter {

    private static instance = new NotifyCenter()

    static getInstance() {
        return NotifyCenter.instance;
    }

    private constructor() {

    }

    private listeners: (() => void)[] = []

    addListener(listener: () => void) {
        this.listeners.push(listener)
    }

    notify() {
        this.listeners.forEach(listener => {
            listener()
        })
    }

}