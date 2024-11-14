import { FDC3_USER_INTERFACE_HANDSHAKE_TYPE, FDC3_USER_INTERFACE_HELLO_TYPE, FDC3_USER_INTERFACE_RESTYLE_TYPE, Fdc3UserInterfaceHello, InitialCSS, UpdatedCSS } from "@kite9/fdc3-schema/generated/api/BrowserTypes";
import { Connectable } from "@kite9/fdc3-standard";

export interface CSSPositioning { [key: string]: string }

export const INITIAL_CONTAINER_CSS = {
    width: "0",
    height: "0",
    position: "fixed"
}


export const ALLOWED_CSS_ELEMENTS = [
    "width",
    "height",
    "position",
    "zIndex",
    "left",
    "right",
    "top",
    "bottom",
    "transition",
    "maxHeight",
    "maxWidth",
    "display"
]

export abstract class AbstractUIComponent implements Connectable {

    private container: HTMLDivElement | undefined = undefined
    private iframe: HTMLIFrameElement | undefined = undefined
    private url: string
    private name: string
    port: MessagePort | null = null

    constructor(url: string, name: string) {
        this.url = url
        this.name = name
    }

    async connect() {
        const portPromise = this.awaitHello()
        this.openFrame()
        this.port = await portPromise
        await this.setupMessagePort(this.port)
        await this.messagePortReady(this.port)

    }

    async disconnect() {
        this.port?.close()
    }

    /**
     * Override and extend this method to provide functionality specific to the UI in question
     */
    async setupMessagePort(port: MessagePort): Promise<void> {
        port.addEventListener("message", (e) => {
            const data = e.data
            if (data.type == FDC3_USER_INTERFACE_RESTYLE_TYPE) {
                // console.log(`Restyling ${JSON.stringify(data.payload)}`)
                const css = data.payload.updatedCSS
                this.themeContainer(css)
            }
        })
    }

    async messagePortReady(port: MessagePort) {
        // tells the iframe it can start posting
        port.postMessage({ type: FDC3_USER_INTERFACE_HANDSHAKE_TYPE })
    }

    private awaitHello(): Promise<MessagePort> {
        return new Promise((resolve, _reject) => {
            const ml = (e: MessageEvent) => {
                // console.log("Received UI Message: " + JSON.stringify(e.data))
                if ((e.source == this.iframe?.contentWindow) && (e.data.type == FDC3_USER_INTERFACE_HELLO_TYPE)) {
                    const helloData = e.data as Fdc3UserInterfaceHello
                    if (helloData.payload.initialCSS) {
                        this.themeContainer(helloData.payload.initialCSS)
                    }
                    const port = e.ports[0]
                    port.start()
                    globalThis.window.removeEventListener("message", ml)
                    resolve(port)
                }
            }

            globalThis.window.addEventListener("message", ml)
        });

    }

    private openFrame(): void {
        this.container = globalThis.document.createElement("div")
        this.iframe = globalThis.document.createElement("iframe")

        this.themeContainer(INITIAL_CONTAINER_CSS)
        this.themeFrame(this.iframe)

        this.iframe.setAttribute("src", this.url)
        this.container.appendChild(this.iframe)
        document.body.appendChild(this.container)
    }

    private toKebabCase(str: String) {
        return str.replace(/[A-Z]/g, (match) => "-" + match.toLowerCase());
    }

    themeContainer(css: UpdatedCSS | InitialCSS) {
        if (css) {
            for (let i = 0; i < ALLOWED_CSS_ELEMENTS.length; i++) {
                const k = ALLOWED_CSS_ELEMENTS[i]
                const value: string | undefined = css[(k as string)]
                if (value != null) {
                    this.container!.style.setProperty(this.toKebabCase(k), value)
                } else {
                    this.container!.style.removeProperty(this.toKebabCase(k))
                }
            }
        }
    }

    themeFrame(ifrm: HTMLIFrameElement) {
        ifrm.setAttribute("name", this.name)
        ifrm.style.width = "100%"
        ifrm.style.height = "100%"
        ifrm.style.border = "0"
    }

}