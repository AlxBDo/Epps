import { defineStore } from "pinia";
import { ref, type Ref } from "vue";
import { arrayObjectFindAllBy } from "../utils/object";
import { isEmpty } from "../utils/validation";


export interface IError {
    id: string
    level?: number
    message: string
}

export interface ErrorState<TError extends IError = IError> {
    errors: TError[]
}

export interface ErrorsStore<TError extends IError = IError> {
    addError: (error: TError) => void
    getError: (errorId: string) => TError | undefined
    getErrors: (value: boolean | number | string, findBy?: string) => TError[]
    hasError: (level?: number) => boolean
}

export const useErrorsStore = <TError extends IError = IError>(id: string) => defineStore(
    `${id}Store`,
    () => {

        const errors: Ref<TError[]> = ref([])


        function addError(error: TError): void {
            if (!error?.id) {
                throw new Error(`${id}Store - addError - Error: id is required`)
            }

            if (!error?.level) {
                error.level = 1
            }

            !getError(error.id) && errors.value.push(error)
        }

        function getError(errorId: string): TError | undefined {
            if (!isEmpty(errorId)) {
                return errors.value.find((error: TError) => error.id === errorId)
            }
        }

        function getErrors(value: boolean | number | string, findBy: string = 'level'): TError[] {
            if (typeof value !== 'number' && findBy === 'level') {
                throw new Error(`${id}Store - getErrors - level is number but its value is : ${value}`)
            }

            return arrayObjectFindAllBy(errors.value, { [findBy]: value } as Partial<TError>)
        }

        function hasError(level: number = 0): boolean {
            return !!errors.value.find((error: TError) => (error.level ?? 0) >= level)
        }


        return {
            addError,
            errors,
            getError,
            getErrors,
            hasError
        }
    }
)()