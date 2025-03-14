import { extendedState } from "../plugins/pinia/extendsStore/extendedState";
import { defineExtendedStoreId } from "./defineExtendedStoreId";
import { useUserStore, type IUserStore, type TUserState } from "./user";
import type { PersistedStore, DefineExtendedStore, DefineEppsStore } from "../types/store";
import { defineStore } from "pinia";
import { ref } from "vue";


export const useConnectedUserStore: DefineEppsStore<IUserStore, TUserState> = defineStore('connectedUserTest', () => {
    const { excludedKeys, isExtended, parentsStores, persist, persistedPropertiesToEncrypt, watchMutation } = extendedState(
        [useUserStore(defineExtendedStoreId('connected', 'user'))],
        {
            isOptionApi: false,
            persist: { persistedPropertiesToEncrypt: ref(['email', 'password', 'username']), watchMutation: ref(true) }
        }
    )

    return {
        excludedKeys,
        isExtended,
        parentsStores,
        persist,
        persistedPropertiesToEncrypt,
        watchMutation
    }
})