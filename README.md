
# `epps` - Extends and Persist Pinia Store

## Introduction

`epps` is a plugin for the Pinia state management library in Vue.js. It extends Pinia stores with advanced features such as persistence, encryption, and store extension. It simplifies state and action management while ensuring sensitive data is protected and enabling seamless integration of parent-child store relationships.

## Advantages

- **Extensibility**: Facilitates adding new features to existing stores and supports parent-child store relationships.
- **Data Persistence**: Retains store state between user sessions using IndexedDB or LocalStorage.
- **Data Security**: Encrypts persisted data to protect sensitive information.

By using the `epps` plugin, you can create more powerful and flexible Pinia stores while ensuring data security and simplifying state management in your Vue.js or Nuxt application.

## Features

### Store Extension

The plugin allows you to extend existing stores by adding additional actions and states. It also supports parent-child store relationships, enabling stores to inherit and share state and actions seamlessly.

### Store Persistence

The plugin enables persisting the state of stores in IndexedDB or LocalStorage. It ensures that data is retained between user sessions and provides options to exclude specific keys from persistence.

### Data Encryption

The plugin provides encryption for persisted state properties in the browser. This ensures that critical data stored in the browser is secure. However, the data remains readable within the store as it is decrypted when retrieved from LocalStorage or IndexedDB.

## Getting Started

Follow these steps to quickly get started with the `epps` plugin:

### Step 1: Install the Plugin

Install the plugin using npm or yarn:

```sh
npm install epps
# or
yarn add epps
```

### Step 2: Configure the Plugin

To use the plugin, simply import it and add it to your Pinia instance.

In the examples below, the environment variables `CRYPT_IV` and `CRYPT_KEY` must be replaced with strings. These variables are used for encrypting data persisted in the browser.

#### Vue

```javascript
// ./main.js
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

```typeScript
// ./plugins/epps-plugin.client.ts
import type { Pinia, PiniaPlugin, PiniaPluginContext } from "pinia"
import { createPlugin } from 'epps'

export default defineNuxtPlugin({
    name: 'eppsPlugin',
    async setup({ $pinia }) {
        ($pinia as Pinia).use(
            createPlugin(
                'localStorage', // define another database name to use IndexedDB
                useRuntimeConfig().public.cryptIv,
                useRuntimeConfig().public.cryptKey
            )
        )
    }
})
```

## Usage

### Define Epps Store: Example Usage with `useListsStore`

The `useListsStore` store demonstrates how to create a collection-based store using the `useCollectionStore` store, which is integrated into the Epps plugin. This allows you to manage collections of items in your project seamlessly.

```typeScript
import { ref } from "vue";
import { defineEppsStore, extendedState, useCollectionStore } from 'epps';
import type { CollectionState, CollectionStoreMethods } from "epps";
import type { List } from "../models/list";

const defaultStoreId: string = 'lists';

export const useListsStore = (id?: string) => defineEppsStore<CollectionStoreMethods, CollectionState<List>>(
    id ?? defaultStoreId,
    () => ({
        ...extendedState(
            [useCollectionStore('listsCollection')],
            { persist: { persist: ref(true) } } // Store persisted manually. Use “watchMutation” to persist each time the State is modified.
        )
    })
)();
```

In this example:
- `useCollectionStore` is a utility provided by the Epps plugin to manage collections of items.
- The `useListsStore` store extends `useCollectionStore` to manage a collection of lists with persistence enabled.

For more details on `useCollectionStore` and its integration, refer to the plugin's GitHub repository: [https://github.com/AlxBDo/Epps/tree/main/src/stores](https://github.com/AlxBDo/Epps/tree/main/src/stores).

### Usage in a Component

To use the `useListsStore` store in a Vue component, you can import and use it as follows:

```vue
<script setup>
import { useListsStore } from '../stores/lists'
import type { CollectionStoreMethods, CollectionState } from 'epps'
import type { List } from "../models/liste"

const listsStore = useListsStore() as EppsStore<CollectionStoreMethods, CollectionState<List>>

/**
 * ⚠️ In Nuxt application ⚠️
 * 
 * calling a method from a parent Store causes an error if the page is refreshed or if it is 
 * the application's entry point To solve this problem, check that the method exists before 
 * calling it.
 * 
 * Example : 
 *  listsStore.remember & listsStore.remember()
 * 
 */
listsStore.remember()

</script>

<template>
  <div>
    <h1>Lists</h1>
    <ul>
      <li v-for="list in listsStore.items" :key="list.id">
        {{ list.name }} (Type: {{ list.type }})
      </li>
    </ul>
  </div>
</template>
```

This example shows how to add a new list and retrieve all lists from the `useListsStore` store. The `useCollectionStore` integration simplifies collection management in your project.

## For more details

- Read [Documentation](https://github.com/AlxBDo/Epps/blob/main/DOCUMENTATION.md) 
- Refer to the plugin's GitHub repository: [https://github.com/AlxBDo/Epps](https://github.com/AlxBDo/Epps).
