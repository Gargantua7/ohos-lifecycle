export type Job = () => void

export abstract class CoroutineScope {

    protected jobs: Job[] = []

    launch(job: Job) {
        this.jobs.push(job)
    }

    protected execute() {
        while (this.jobs.length > 0) {
            this.jobs.pop()!()
        }
    }
}