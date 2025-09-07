import { isEmpty } from "../utils/validation";
import { defineEppsStore } from "../utils/store";
import { useCollectionStore } from "./collection";
import ParentStore from "../plugins/parentStore";
import { getEppsStore } from "../plugins/eppsStores";

import type { CollectionStoreMethods } from "../types";
import type { Comparison, ComparisonNumber } from "../types/comparison";


export interface IError {
    id: string
    level?: number
    message: string
}

export interface ErrorsState<TError extends IError = IError> {
    errors: TError[]
}

type omitActions = 'clear' | 'getItem' | 'getItems' | 'removeItem' | 'setItems'

export interface ErrorsStore<TError extends IError = IError> extends Omit<CollectionStoreMethods, omitActions> {
    addError: (error: TError) => void
    clearErrors: () => void
    getError: (errorId: { id: string }) => TError | undefined
    getErrors: (findBy?: Partial<TError>, comparisonMode?: Comparison) => TError[] | undefined
    getErrorById: (id: string) => TError | undefined
    getErrorsByLevel: (value: number, comparisonMode?: Comparison) => TError[] | undefined
    hasError: (level?: number) => boolean
    removeError: (criteria: Partial<TError>) => void
    setErrors: (errors: TError[]) => void
}

export const useErrorsStore = <TError extends IError = IError>(id: string) =>
    defineEppsStore<ErrorsStore, ErrorsState<TError>>(
        id,
        () => {
            function addError(error: TError): void {
                if (!error?.id) {
                    throw new Error(`${id}Store - addError - Error: id is required`)
                }

                if (!error?.level) {
                    error.level = 1
                }

                !getErrorById(error.id) && getStore().addItem(error)
            }

            function getErrorById(errorId: string): TError | undefined {
                if (!isEmpty(errorId)) {
                    return getStore().getError({ id: errorId }) as TError | undefined
                }
            }

            function getErrorsByLevel(value: number, comparison: ComparisonNumber = '>='): TError[] | undefined {
                return getStore().getErrors({ level: value }, comparison) as TError[] | undefined;
            }

            function getStore() {
                return getEppsStore<ErrorsStore, ErrorsState>(id)
            }

            function hasError(level: number = 0): boolean {
                return !isEmpty(getErrorsByLevel(level))
            }


            return {
                addError,
                getErrorById,
                getErrorsByLevel,
                hasError
            }
        },
        {
            actionsToRename: {
                clear: 'clearErrors', getItem: 'getError', getItems: 'getErrors',
                removeItem: 'removeError', setItems: 'setErrors'
            },
            parentsStores: [new ParentStore('errorCollection', useCollectionStore)],
            propertiesToRename: { items: 'errors' }
        }
    )()