import { DesktopAgent } from "@kite9/fdc3-core";
import { GetAgentParams } from "@kite9/fdc3-common";
import { Loader } from "./Loader";



/**
 * This loader handles timing out.
 */
export class TimeoutLoader implements Loader {

    done = false

    poll(endTime: number, resolve: (value: DesktopAgent | void) => void, reject: (reason?: any) => void) {
        const timeRemaining = endTime - Date.now()

        if ((timeRemaining > 0) && (this.done == false)) {
            setTimeout(() => this.poll(endTime, resolve, reject), 100);
        } else if (this.done == false) {
            reject(new Error('timeout'));
        } else {
            resolve();
        }
    }

    cancel(): void {
        this.done = true;
    }

    get(params: GetAgentParams): Promise<DesktopAgent | void> {
        return new Promise<DesktopAgent | void>((resolve, reject) => {
            const endPollTime = Date.now() + params.timeout
            this.poll(endPollTime, resolve, reject)
        });
    }
}
