import { Store } from "pinia";
import { AnyObject } from "../types";
import { ActionFlows } from "../types/epps";

export default class ActionsStoreFlow {
    private _childStore?: AnyObject
    private _store: AnyObject
    private _flowsOnAction: Record<string, boolean> = {}
    private _flows?: ActionFlows

    constructor(store: AnyObject, flows?: ActionFlows, childStore?: AnyObject) {
        this._childStore = childStore
        this._flows = flows
        this._store = store
    }


    private addFlowOnAction(name: string): void {
        this._flowsOnAction[name] = true
        setTimeout(() => { this._flowsOnAction[name] = false }, 500)
    }

    private invokeFlow(args: any[] | object, name: string, flow?: Function | string, result?: any): boolean {
        if (!flow) { return false }

        if (result) {
            args = { args, result }
        }

        if (typeof flow === 'function') {
            flow(args)
        } else if (typeof flow === 'string') {
            if (this._childStore && typeof this._childStore[flow] === 'function') {
                this._childStore[flow](args)
            } else if (typeof this._store[flow]) {
                this._store[flow](args)
            }
        }

        return true
    }

    onAction(): void {
        if (!this._flows) return

        (this._store as Store).$onAction(({ after, args, name }) => {
            if (!(this._flows as AnyObject)[name] || this._flowsOnAction[name]) { return }

            this.addFlowOnAction(name)

            const { after: afterAction, before } = (this._flows as AnyObject)[name]

            if (this.invokeFlow(args, name, before)) {
                this._store[name](...args)
            }

            after((result) => this.invokeFlow(args, name, afterAction, result))
        })
    }
}