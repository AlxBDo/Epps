import { computed, toRef } from "vue";
import { Epps } from "../plugins/epps";
import { EppsStoreOptions } from "../types/store";
import Store from "./Store";

import type { AnyObject } from "../types";
import type { Store as PiniaStore } from "pinia";
import ActionsStoreFlow from "./ActionsStoreFlow";


export default class StoreExtension extends Store {
    private _extendedActions: string[] = ['removePersistedState', 'watch', '$reset']


    constructor(store: PiniaStore, options: EppsStoreOptions, debug: boolean = false) {
        super(store, options, debug)

        this.extendsStore()
    }


    get extendedActions(): string[] {
        return [...this._extendedActions, ...(this.options?.actionsToExtends ?? this.getStatePropertyValue('actionsToExtends') ?? [])]
    }

    get actionsToRename(): Record<string, string> | undefined {
        return (this.options as Epps).actionsToRename
    }

    get propertiesToRename(): Record<string, string> | undefined {
        return (this.options as Epps).propertiesToRename
    }

    private addToCustomProperties(propertyName: string): void {
        if (!import.meta.env.PROD) {
            this.store._customProperties.add(propertyName)
        }
    }


    private createComputed(store: AnyObject, key: string) {
        const isObject = typeof store[key] === 'object'

        return computed({
            get: () => {
                return this.getValue(store[key])
            },
            set: (value: any) => {
                if (isObject && store[key]?.value) {
                    store[key].value = value
                } else { store[key] = value }
            }
        })
    }

    /**
     * Duplicates storeToExtend to extendedStore
     * @param {AnyObject} storeToExtend 
     */
    private duplicateStore(storeToExtend: AnyObject): void {
        const deniedFirstChars = ['$', '_']

        Object.keys(storeToExtend).forEach((key: string) => {
            if (deniedFirstChars.includes(key[0]) && key !== '$reset') { return }

            const typeOfProperty = typeof storeToExtend[key]

            if (typeOfProperty === 'function') {
                if (this.storeHas(key)) {
                    if (this.extendedActions.includes(key)) { this.extendsAction(storeToExtend, key) }
                } else {
                    const childStoreActionName = this.getActionNameForChildStore(key)
                    this.store[childStoreActionName] = storeToExtend[key]
                    this.addToCustomProperties(childStoreActionName)
                }
            } else if (!this.storeHas(key) && (typeOfProperty === 'undefined' || typeOfProperty === 'object')) {
                this.store[key] = this.createComputed(storeToExtend, key)
                this.addToCustomProperties(key)
            }
        })
    }

    /**
     * Extends storeToExtend's action to extendedStore
     * @param {AnyObject} storeToExtend 
     * @param {string} key 
     */
    private extendsAction(storeToExtend: AnyObject, key: string): void {
        const originalFunction = this.store[key];

        if (this.isOptionApi()) {
            this.store[key] = function (...args: any[]) {
                storeToExtend[key].apply(this, args);
                originalFunction.apply(this, args);
            }
        } else {
            this.store[key] = (...args: any[]) => {
                storeToExtend[key](...args);
                originalFunction(...args);
            }
        }
    }

    private extendsState(storeToExtend: AnyObject) {
        Object.keys(storeToExtend.$state).forEach((key: string) => {
            if (!this.stateHas(key)) {
                const childStoreKey = this.getPropertyNameForChildState(key)
                this.store[childStoreKey] = this.state[childStoreKey] = toRef(storeToExtend.$state, key)
                this.addToCustomProperties(childStoreKey)
            }
        })
    }

    /**
     * Extends to store stores list in parentsStores property
     */
    private extendsStore(): void {
        const flows = (this.options as Epps)?.actionFlows;
        (new ActionsStoreFlow(this.store, flows)).onAction();

        if (this.parentsStores) {
            const storeToExtend = this.parentsStores

            if (!storeToExtend || !storeToExtend.length) { return }

            (storeToExtend as PiniaStore[]).forEach((ste: PiniaStore) => {
                if (ste?.$state) {
                    this.duplicateStore(ste)
                    this.extendsState(ste);
                    (new ActionsStoreFlow(ste, flows, this.store)).onAction();
                }
            })
        }
    }

    private getActionNameForChildStore(parentStoreActionName: string): string {
        return (this.actionsToRename && this.actionsToRename[parentStoreActionName]) ?? parentStoreActionName
    }

    private getPropertyNameForChildState(property: string): string {
        return (this.propertiesToRename && this.propertiesToRename[property]) ?? property
    }
}