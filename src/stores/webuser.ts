import { ref } from "vue"
import { defineEppsStore } from "../utils/store"
import { ResourceIdStore, useResourceIdStore } from "./resourceId"
import { Item } from "../models/item"
import { Epps } from "../plugins/epps"
import ParentStore from "../plugins/parentStore"


export interface WebUserStore extends ResourceIdStore {
    setData: (data: Partial<WebUserState>) => void
    updatePassword: (newPassword: string, oldPassword: string) => void
}

export interface WebUserState extends Item {
    password?: string
    username?: string
}


const epps = new Epps({
    actionsToExtends: ['setData'],
    parentsStores: [new ParentStore('resourceId', useResourceIdStore)]
})


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
    epps
)()