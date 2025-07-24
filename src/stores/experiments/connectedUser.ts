import { ref } from "vue";
import { defineEppsStore } from "../../utils/store";
import { extendedState } from "../../plugins/extendedState";
import { useUserStore, type UserStore, type UserState } from "./user";
import { SubscriptionCallbackMutationPatchObject } from "pinia";


export const useConnectedUserStore = defineEppsStore<UserStore, UserState>(
    'connectedUser',
    () => ({
        ...extendedState(
            [useUserStore('connected-user')],
            {
                persist: {
                    excludedKeys: ref(['@id', 'errors']),
                    persistedPropertiesToEncrypt: ref(['email', 'password', 'username']),
                    watchMutation: ref(true)
                }
            }
        ),
        mutationCallback: (mutation: SubscriptionCallbackMutationPatchObject<UserState>) => {
            console.log('connectedUserStore - mutationCallback', mutation)
        }
    })
)

