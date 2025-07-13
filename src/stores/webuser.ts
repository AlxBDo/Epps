import { ref } from "vue"
import { defineEppsStore } from "../utils/store"
import { ResourceIdStore, useResourceIdStore } from "./resourceId"
import { Item } from "../models/item"
import { extendedState } from "../plugins/extendedState"


export interface WebUserStore extends ResourceIdStore {
    setData: (data: Partial<WebUserState>) => void
    updatePassword: (newPassword: string, oldPassword: string) => void
}

export interface WebUserState extends Item {
    password?: string
    username?: string
}

export const useWebUserStore = (id?: string) => defineEppsStore<WebUserStore, WebUserState>(
    id ?? 'webuserStore',
    () => {
        const password = ref<string>()
        const username = ref<string>()
        const { actionsToExtends, parentsStores } = extendedState(
            [useResourceIdStore('webUserIdStore')],
            { actionsToExtends: ['setData'] }
        )

        function updatePassword(newPassword: string, oldPassword: string): void {
            if (oldPassword.trim() === password.value) {
                password.value = newPassword
            }
        }

        function setData(data: WebUserState) {
            if (data.password) { password.value = data.password; }
            if (data.username) { username.value = data.username }
        }

        return {
            actionsToExtends,
            parentsStores,
            password,
            setData,
            updatePassword,
            username
        }
    }
)()