import { CoroutineScope, Job } from "./CoroutineScope"

export abstract class AbstractLifecycleScope extends CoroutineScope {

    private isClear = false
    protected canExecute = false
    protected executing = false

    launch(job: Job): void {
        if (this.isClear) return
        super.launch(job)
        this.execute()
    }

    clear() {
        this.isClear = true
        this.canExecute = false
        this.jobs = []
    }

    protected execute() {

        if (this.executing || !this.canExecute || this.isClear) return

        this.executing = true

        while (this.jobs.length > 0 && this.canExecute) {
            this.jobs.pop()!()
        }

        this.executing = false
    }
}