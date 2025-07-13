import { defineStoreId } from "../../utils/defineStoreId"
import { extendedState } from "../../plugins/extendedState"
import { getParentStorePropertyValue } from "../../plugins/parentStore"
import { ContactState, ContactStore, useContactStore } from "./contact"

import type { User } from "../../models/user"
import { defineEppsStore } from "../../utils/store"
import { computed, ref } from "vue"
import { List } from "../../models/liste"


export interface UserStore extends ContactStore {
    isPassword: (password: string) => boolean
    modifyPassword: (oldPassword: string, newPassword: string) => void
    setData: (data: Partial<UserState>) => void
    user: User
}

export interface UserState extends ContactState, User {
    lists?: List[]
    password: string
}

export const useUserStore = (id?: string) => defineEppsStore<UserStore, UserState>(
    id ?? 'contact',
    () => {
        const lists = ref<List[]>()
        const password = ref<string>()

        const {
            excludedKeys,
            actionsToExtends,
            parentsStores,
            persist,
            persistedPropertiesToEncrypt
        } = extendedState(
            [useContactStore(defineStoreId(id ?? 'user', 'contact'))],
            { actionsToExtends: ['setData'] }
        )

        const user = computed(() => ({
            ...(parentsStores ? getParentStorePropertyValue('contact', 0, parentsStores()) : {}),
            password: password.value
        }))


        function setData(data: UserState) {
            if (data.lists) { lists.value = data.lists; }
            if (data.password) { password.value = data.password; }
        }

        return {
            actionsToExtends,
            excludedKeys,
            lists,
            parentsStores,
            password,
            persist,
            persistedPropertiesToEncrypt,
            setData,
            user
        }
    }
)()