import type { Contact } from "../../models/contact"
import { useErrorsStore } from "../errors";
import { IItemStoreState, useItemStore } from "./item"
import { defineStoreId } from "../../utils/defineStoreId"
import { getParentStoreMethod, getParentStorePropertyValue } from "../../plugins/parentStore"
import { extendedState } from "../../plugins/extendedState";
import { defineEppsStore } from "../../utils/store";
import { computed, ref } from "vue";
import { Store } from "pinia";
import type { ErrorState, ErrorsStore, IError } from "../errors";
import { isEmpty } from "../../utils/validation";


export interface ContactStore extends ErrorsStore {
    setData: (data: ContactState) => void
    contact: Contact
}

export interface ContactState extends Contact, ErrorState, IItemStoreState {
}


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
            [useItemStore(defineStoreId(id ?? 'contact', 'item')), useErrorsStore('contact')],
            { actionsToExtends: ['setData'] }
        )


        const contact = computed(() => ({
            '@id': parentsStores && getParentStorePropertyValue('@id', 0, parentsStores() ?? ([] as Store[])),
            id: parentsStores && getParentStorePropertyValue('id', 0, parentsStores()),
            email: email.value,
            firstname: firstname.value,
            lastname: lastname.value
        }))


        function setData(data: ContactState, strictValidation: boolean = true) {
            if (!isEmpty(data.email)) {
                email.value = data.email;
            } else if (strictValidation) {
                parentsStores && getParentStoreMethod('addError', 1, parentsStores())({
                    id: 'contact-email',
                    message: 'Email is required'
                })
            }

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