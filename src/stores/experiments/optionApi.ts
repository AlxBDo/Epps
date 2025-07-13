import { extendedState } from "../../plugins/extendedState";
import { defineEppsStore } from "../../utils/store";

import { useItemStore, type IItemStore, type IItemStoreState } from "./item";

export interface OptionApiState extends IItemStoreState {
    test?: string
}

export interface OptionApiStore extends IItemStore {
    logTest: () => void
    setTest: (testData: OptionApiState) => void
}

export const useOptionApiStore = defineEppsStore<Partial<OptionApiStore>, OptionApiState>('optionApiStore', {
    state: () => ({
        test: undefined,
        ...extendedState([useItemStore('optionApi')])
    }),
    actions: {
        setTest(testData: OptionApiState) {
            if (testData.test) { this.test = testData.test }

            this.setData && this.setData(testData)
        }
    }
})