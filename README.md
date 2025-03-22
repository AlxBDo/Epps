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

Epps! is a plugin for the Pinia state management library in Vue.js. It extends Pinia stores with advanced features such as persistence, encryption, and store extension. It simplifies state and action management while ensuring sensitive data is protected and enabling seamless integration of parent-child store relationships.

## Advantages

- **Extensibility**: Facilitates adding new features to existing stores and supports parent-child store relationships.
- **Data Persistence**: Retains store state between user sessions using IndexedDB or LocalStorage.
- **Data Security**: Encrypts persisted data to protect sensitive information.
- **Flexibility**: Supports both Option API and Composition API syntax for defining stores.

By using the Epps plugin, you can create more powerful and flexible Pinia stores while ensuring data security and simplifying state management in your Vue.js or Nuxt application.

## Features

### Store Extension

The plugin allows you to extend existing stores by adding additional actions and states. It also supports parent-child store relationships, enabling stores to inherit and share state and actions seamlessly.

### Store Persistence

The plugin enables persisting the state of stores in IndexedDB or LocalStorage. It ensures that data is retained between user sessions and provides options to exclude specific keys from persistence.

### Data Encryption

The plugin provides encryption for persisted state properties in the browser. This ensures that critical data stored in the browser is secure. However, the data remains readable within the store as it is decrypted when retrieved from LocalStorage or IndexedDB.

### Parent-Child Store Relationships

Epps supports defining parent-child relationships between stores. This allows child stores to inherit state and actions from parent stores, promoting code reuse and modularity.

### Flexible Configuration

The plugin offers flexible configuration options, including:
- Customizable persistence strategies (IndexedDB or LocalStorage).
- Encryption settings using `CRYPT_IV` and `CRYPT_KEY`.
- Watchers for automatic persistence on state changes.

## Usage

### Installation

To install the plugin, you can use npm or yarn:

```sh
npm install epps
# or
yarn add epps
```

To use the plugin, simply import it and add it to your Pinia instance.

In the examples below, the environment variables `CRYPT_IV` and `CRYPT_KEY` must be replaced with strings. These variables are used for encrypting data persisted in the browser.

#### Vue

```javascript
// ./App.vue
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
// ./plugins/epps-plugin.ts
import type { Pinia, PiniaPlugin, PiniaPluginContext } from "pinia"
import { createPlugin } from 'epps'

export default defineNuxtPlugin({
    name: 'eppsPlugin',
    async setup({ $pinia }) {
        ($pinia as Pinia).use(
            createPlugin(
                'localStorage', 
                useRuntimeConfig().public.cryptIv, 
                useRuntimeConfig().public.cryptKey
            )
        )
    }
})
```

#### Example Usage with useConnectedUserStore

The `useConnectedUserStore` store uses the plugin to manage connected user information, with persisted and encrypted data. It extends the `useUserStore` store, adding additional state and persistence capabilities. Additionally, it demonstrates the use of parent-child store relationships:

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
                    persistedPropertiesToEncrypt: ref(['email', 'password', 'username'])
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