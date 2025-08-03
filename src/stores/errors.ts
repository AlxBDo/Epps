import { computed } from "vue";
import { isEmpty } from "../utils/validation";
import { defineEppsStore } from "../utils/store";
import { CollectionState, CollectionStoreMethods, DefineEppsStore, EppsStore, SearchCollectionCriteria } from "../types";
import { extendedState } from "../plugins/extendedState";
import { useCollectionStore } from "./collection";
import ParentStore, { getParentStore } from "../plugins/parentStore";
import ParentsStores from "../plugins/parentsStores";
import { Epps } from "../plugins/epps";


export interface IError {
    id: string
    level?: number
    message: string
}

export interface ErrorsState<TError extends IError = IError> {
    errors: TError[]
}

export interface ErrorsStore<TError extends IError = IError> {
    addError: (error: TError) => void
    clearErrors: () => void
    getError: (errorId: string) => TError | undefined
    getErrors: (value?: boolean | number | string, findBy?: string) => TError[]
    hasError: (level?: number) => boolean
    removeError: (criteria: Partial<TError>) => void
}

const epps = new Epps({
    parentsStores: [
        new ParentStore<CollectionStoreMethods, CollectionState<IError>>('errorCollection', useCollectionStore)
    ],
    propertiesToRename: { items: 'errors' }
})

export const useErrorsStore = <TError extends IError = IError>(id: string) =>
    defineEppsStore<ErrorsStore, CollectionState<TError>>(
        `${id}Store`,
        () => {
            function addError(error: TError): void {
                if (!error?.id) {
                    throw new Error(`${id}Store - addError - Error: id is required`)
                }

                if (!error?.level) {
                    error.level = 1
                }

                !getError(error.id) && getCollectionStore()?.addItem(error)
            }

            function clearErrors() {
                getCollectionStore()?.clear()
            }

            function getCollectionStore() {
                return epps.getStore<CollectionStoreMethods, CollectionState<IError>>(0, `${id}Store`)
            }

            function getError(errorId: string): TError | undefined {
                if (!isEmpty(errorId)) {
                    return getCollectionStore()?.getItem({ id: errorId }) as TError | undefined
                }
            }

            function getErrors(value?: boolean | number | string, findBy: string = 'level'): TError[] {
                if (typeof value !== 'number' && findBy === 'level') {
                    throw new Error(`${id}Store - getErrors - level is number but its value is : ${value}`)
                }

                return getCollectionStore()?.getItems({ [findBy]: value } as SearchCollectionCriteria) as TError[]
            }

            function hasError(level: number = 0): boolean {
                const items = getCollectionStore()?.items
                return !!(items && items.find((error: IError) => (error.level ?? 0) >= level))
            }

            function removeError(criteria: Partial<TError>): void {
                getCollectionStore()?.removeItem(criteria)
            }


            return {
                addError,
                clearErrors,
                getError,
                getErrors,
                hasError,
                removeError
            }
        },
        epps
    )()