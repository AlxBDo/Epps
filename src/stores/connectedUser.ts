import { ref } from "vue";
import { defineEppsStore } from "../utils/store";
import { extendedState } from "../plugins/pinia/extendsStore/extendedState";
import { useUserStore, type UserStore, type UserState } from "./user";


export const useConnectedUserStore = defineEppsStore<UserStore, UserState>(
    'connectedUser',
    () => ({
        ...extendedState(
            [useUserStore('connected-user')],
            {
                persist: {
                    persistedPropertiesToEncrypt: ref(['email', 'password', 'username']),
                    watchMutation: ref(true)
                }
            }
        )
    })
)

