import { ref } from "vue"
import { defineEppsStore } from "../utils/store"
import { ResourceIdStore, useResourceIdStore } from "./resourceId"
import ParentStore from "../plugins/parentStore"
import type { ResourceId } from "../types/resourceId"


export interface WebUserStore extends ResourceIdStore {
    setData: (data: Partial<WebUserState>) => void
    updatePassword: (newPassword: string, oldPassword: string) => void
}

export interface WebUserState extends ResourceId {
    password?: string
    username?: string
}


export const useWebUserStore = (id?: string) => defineEppsStore<WebUserStore, WebUserState>(
    id ?? 'webuserStore',
    () => {
        const password = ref<string>()
        const username = ref<string>()

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
            password,
            setData,
            updatePassword,
            username
        }
    },
    {
        actionsToExtends: ['setData'],
        parentsStores: [new ParentStore('resourceId', useResourceIdStore)]
    }
)()