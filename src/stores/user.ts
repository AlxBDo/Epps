import { defineStore } from "pinia"
import { defineExtendedStoreId } from "./defineExtendedStoreId"
import { extendedState } from "../plugins/pinia/extendsStore/extendedState"
import { getParentStorePropertyValue } from "../plugins/pinia/extendsStore/parentStore"
import { useContactStore } from "./contact"

import type { Contact } from "../models/contact"
import type { ExtendState } from "../types/store"
import type { User } from "../models/user"


export interface IUserStore {
    isPassword: (password: string) => boolean
    modifyPassword: (oldPassword: string, newPassword: string) => void
    setData: (data: TUserState) => void
    user: User
}

export type TUserState = ExtendState<Contact, User>

export const useUserStore = (id?: string) => defineStore(id ?? 'user', {
    state: (): TUserState => ({
        ...extendedState(
            [useContactStore(defineExtendedStoreId(id ?? 'user', 'contact'))],
            { actionsToExtends: ['setData'] }
        ),
        lists: undefined,
        password: undefined
    }),

    getters: {
        user: (state) => ({
            ...getParentStorePropertyValue('contact', 0, state.parentsStores),
            password: state.password
        })
    },

    actions: {
        isPassword(password: string) {
            return this.password === password
        },

        modifyPassword(oldPassword: string, newPassword: string) {
            if (this.isPassword(oldPassword)) {
                this.password = newPassword
            }
        },

        setData(data: TUserState) {
            if (data.email) { this.email = data.email; }
            if (data.firstname) { this.firstname = data.firstname; }
            if (data.lists) { this.lists = data.lists; }
            if (data.password) { this.password = data.password; }
        }
    }
})()