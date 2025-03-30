import type { Contact } from "../models/contact"
import { useItemStore } from "./item"
import type { ExtendState } from "../types/store";
import type { Item } from "../models/item"
import { defineStoreId } from "../utils/defineStoreId"
import { getParentStorePropertyValue } from "../plugins/parentStore"
import { extendedState } from "../plugins/extendedState";
import { defineEppsStore } from "../utils/store";
import { computed, ref } from "vue";
import { Store } from "pinia";


export interface ContactStore {
    isPassword: (password: string) => boolean
    modifyPassword: (oldPassword: string, newPassword: string) => void
    setData: (data: ContactState) => void
    contact: Contact
}

export type ContactState = ExtendState<Item, Contact>

export const useContactStore = (id?: string) => defineEppsStore<ContactStore, ContactState>(
    id ?? 'contact',
    () => {
        const email = ref<string>()
        const firstname = ref<string>()
        const lastname = ref<string>()

        const {
            excludedKeys,
            actionsToExtends,
            parentsStores,
            persist,
            persistedPropertiesToEncrypt
        } = extendedState(
            [useItemStore(defineStoreId(id ?? 'contact', 'item'))],
            { actionsToExtends: ['setData'] }
        )


        const contact = computed(() => ({
            '@id': parentsStores && getParentStorePropertyValue('@id', 0, parentsStores() ?? ([] as Store[])),
            id: parentsStores && getParentStorePropertyValue('id', 0, parentsStores()),
            email: email.value,
            firstname: firstname.value,
            lastname: lastname.value
        }))


        function setData(data: ContactState) {
            if (data.email) { email.value = data.email; }
            if (data.firstname) { firstname.value = data.firstname; }
            if (data.lastname) { lastname.value = data.lastname; }
        }

        return {
            actionsToExtends,
            contact,
            email,
            firstname,
            excludedKeys,
            lastname,
            parentsStores,
            persist,
            persistedPropertiesToEncrypt,
            setData
        }
    }
)()