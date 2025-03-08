import { StateTree } from "pinia"
import { getStatePropertyValue } from "../augmentPinia/augmentState"
import Crypt from "../../../services/Crypt"

export function cryptState(Crypt: Crypt, state: StateTree, decrypt: boolean = false): StateTree {
    const persistedPropertiesToEncrypt = getStatePropertyValue(state.persistedPropertiesToEncrypt)
    const isEncrypted = getStatePropertyValue(state.isEncrypted)

    if (
        Array.isArray(persistedPropertiesToEncrypt) && state.persistedPropertiesToEncrypt.length > 0
        && isEncrypted === decrypt && Crypt
    ) {
        const encryptedState = {} as StateTree

        persistedPropertiesToEncrypt.forEach((property: string) => {
            if (state[property]) {
                encryptedState[property] = decrypt ? Crypt.decrypt(state[property]) : Crypt.encrypt(state[property])
            }
        })

        state = { ...state, ...encryptedState, isEncrypted: !decrypt }
    }

    return state
}