import { Store } from "pinia";
import { AnyObject } from "../types";
import { ActionFlows } from "../types/epps";
import { isEmpty } from "../utils/validation";

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


    private addFlowOnAction(name: string, args: any[] | object): void {
        const actionName = this.getOnActionFlowName(name, args)
        this._flowsOnAction[actionName] = true
        setTimeout(() => { this._flowsOnAction[actionName] = false }, 250)
    }

    private getOnActionFlowName(name: string, args: any[] | object): string {
        return name + JSON.stringify(args)
    }

    private invokeFlow(args: any[] | object, name: string, flow?: Function | string, result?: any): boolean {
        if (!flow) { return false }

        if (!isEmpty(result)) {
            args = { args, result }
        }

        if (typeof flow === 'function') {
            flow(args)
        } else if (typeof flow === 'string') {
            if (this._childStore && typeof this._childStore[flow] === 'function') {
                this._childStore[flow](args)
            } else if (typeof this._store[flow] === 'function') {
                this._store[flow](args)
            }
        }

        this.addFlowOnAction(name, args)

        return true
    }

    onAction(): void {
        if (!this._flows) return

        (this._store as Store).$onAction(({ after, args, name }) => {
            if (!(this._flows as AnyObject)[name] || this._flowsOnAction[this.getOnActionFlowName(name, args)]) { return }

            const { after: afterAction, before } = (this._flows as AnyObject)[name]

            this.invokeFlow(args, name, before)

            after((result) => this.invokeFlow(args, name, afterAction, result))
        })
    }
}