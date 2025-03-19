import { StateTree } from "pinia"
import { getStatePropertyValue } from "../augmentPinia/augmentState"
import Crypt from "../../../services/Crypt"
import { log } from "../../../utils/log"

export function cryptState(Crypt: Crypt, state: StateTree, decrypt: boolean = false): StateTree {
    const persistedPropertiesToEncrypt = getStatePropertyValue(state.persistedPropertiesToEncrypt)
    const isEncrypted = getStatePropertyValue(state.isEncrypted)

    if (
        Array.isArray(persistedPropertiesToEncrypt) && persistedPropertiesToEncrypt.length > 0
        && isEncrypted === decrypt && Crypt
    ) {
        const encryptedState = {} as StateTree

        persistedPropertiesToEncrypt.forEach((property: string) => {
            if (state[property]) {
                const value = getStatePropertyValue(state[property])
                encryptedState[property] = decrypt ? Crypt.decrypt(value) : Crypt.encrypt(value)
            }
        })

        state = { ...state, ...encryptedState, isEncrypted: !decrypt }
    }

    return state
}