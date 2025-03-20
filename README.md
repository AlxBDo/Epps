# `Epps!` plugin
## Extends and Persist any Pinia Store

> **Warning**
> The Epps plugin is in beta version. If you encounter any bugs, please report them by contacting me via my GitHub profile: [https://github.com/AlxBDo](https://github.com/AlxBDo).

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
   - [Store Extension](#store-extension)
   - [Store Persistence](#store-persistence)
3. [Usage](#usage)
   - [Installation](#installation)
   - [Example Usage with `useConnectedUserStore`](#example-usage-with-useconnecteduserstore)
   - [Usage in a Component](#usage-in-a-component)
4. [Advantages](#advantages)

## Introduction

Epps! plugin extends Pinia stores with persistence and encryption capabilities, making them more robust and secure. It simplifies state and action management while ensuring sensitive data is protected.

## Advantages

- Extensibility: Facilitates adding new features to existing stores.
- Data Persistence: Retains store state between user sessions.
- Data Security: Encrypts persisted data.

By using the Epps plugin, you can create more powerful and flexible Pinia stores while simplifying state and action management in your Vue.js application, and ensuring the security of your persisted data.

## Features

### Store Extension

The plugin allows you to extend existing stores by adding additional actions and states. This facilitates code reuse and dependency management between stores.

### Store Persistence

The plugin enables persisting the state of stores in Indexed DB, allowing data to be retained between user sessions. It uses encryption techniques to secure sensitive data.

### Encryption des données

The plugin provides encryption for persisted state properties in the browser. This functionality ensures that critical data stored in the browser is secure. However, the data remains readable within the store as it is decrypted when retrieved from LocalStorage or IndexedDB.

## Usage

### Installation

To install the plugin, you can use npm or yarn:

```sh
npm install epps
# or
yarn add epps
```

To use the plugin, simply import it and add it to your Pinia instance:

#### Vue

```javascript
import { createPinia } from 'pinia'
import { createPlugin } from 'epps'

const pinia = createPinia()

const epps = createPlugin(
    'localStorage', 
    import.meta.env.VITE_CRYPT_IV,
    import.meta.env.VITE_CRYPT_KEY
)

pinia.use(epps)
```

#### Nuxt

```javascript
import type { Pinia, PiniaPlugin, PiniaPluginContext } from "pinia"
import { createPlugin } from 'epps'

function eppsPlugin(pinia: PiniaPluginContext) {
    if (window && pinia) {
        const plugin = createPlugin('localStorage', 'jdskdslqjqldjsqidosqjdsoqss', 'duiosudosudsoqdsodqidq')

        plugin(pinia)
    }
}


export default defineNuxtPlugin({
    name: 'eppsPlugin',
    async setup() {
        const { $pinia }: { $pinia: Pinia } = useNuxtApp()
        $pinia.use(eppsPlugin)
    }
})
```

#### Example Usage with useConnectedUserStore

The useConnectedUserStore store uses the plugin to manage connected user information, with persisted and encrypted data. It extends the useUserStore store, adding additional state and persistence capabilities:

```javascript
import { ref } from "vue";
import { defineEppsStore, extendedState } from 'epps'
import { useUserStore, type UserStore, type UserState } from "./user";

export const useConnectedUserStore = defineEppsStore<UserStore, UserState>(
    'connectedUser',
    () => ({
        ...extendedState(
            [useUserStore('connected-user')],
            {
                isOptionApi: false,
                persist: {
                    persistedPropertiesToEncrypt: ref(['email', 'password', 'username']),
                    watchMutation: ref(true)
                }
            }
        )
    })
)
```

For more details on this example, please visit the plugin's GitHub repository: [https://github.com/AlxBDo/Epps/tree/main/src/stores](https://github.com/AlxBDo/Epps/tree/main/src/stores).

#### Usage in a Component

To use the useConnectedUserStore store in a Vue component, you can import and use it as follows:

```javascript
<script setup>
import type { EppsStore } from 'epps'
import type { UserStore, UserState } from "../stores/user"
import { useConnectedUserStore } from '../stores/connectedUser'

const connectedUser = useConnectedUserStore() as EppsStore<UserStore, UserState>

function logout() {
  connectedUserStore.$reset()
}
</script>

<template>
  <div>
    <h1>Connected User</h1>
    <p>Email: {{ connectedUser.email }}</p>
    <p>Username: {{ connectedUser.username }}</p>
    <button @click="logout">Logout</button>
  </div>
</template>
````