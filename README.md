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

All createPlugin function parameters are optional.

In the examples below, the environment variable `CRYPT_KEY` must be replaced with string. It's used for encrypting data persisted in the browser.

#### Vue

```javascript
// ./main.js
import { createPinia } from 'pinia'
import { createPlugin } from 'epps'

const pinia = createPinia()

const epps = createPlugin(
    'localStorage', // define another database name to use IndexedDB
    import.meta.env.CRYPT_KEY
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
                useRuntimeConfig().public.cryptKey
            )
        )
    }
})
```

## Usage

### Define Epps Store: Example Usage with `useListsStore`

The `useListsStore` store demonstrates how to create a collection-based store using the `useCollectionStore` store, which is integrated into the Epps plugin. This allows you to manage collections of items in your project seamlessly.

#### Version >= 0.4.0

```typeScript
import { ref } from "vue";
import { defineEppsStore, getExtendedStore, useCollectionStore } from 'epps';
import type { CollectionState, CollectionStoreMethods } from "epps";
import type { List, ListsState, ListsStoreMethods } from "../types/list";

export const useListsStore = (id?: string) => defineEppsStore<ListsStoreMethods, ListsState>(
    id ?? 'listsStore',
    () => ({
      newList: (list: List) => {
        const store = getExtendedStore<ListsStoreMethods, ListsState>()
        store.addItem({ ...list, id: store.lists.length + 1})
      }
    }),
    {
        actionsToRename: { getItems: 'getLists' },
        parentsStores: [new ParentStore('listsCollection', useCollectionStore)],
        persist: { watchMutation: true },
        propertiesToRename: { items: 'lists' }
    }
)()
```

#### Version 0.3.X

```typeScript
...

const epps = new Epps({
    parentsStores: [ new ParentStore('listsCollection', useCollectionStore) ], 
    persist: { persist: true } // Store persisted manually. Use “watchMutation” to persist each time the State is modified.
})

export const useListsStore = (id?: string) => defineEppsStore<CollectionStoreMethods, CollectionState<List>>(
    id ?? 'listsStore',
    () => ({
        getLists: () => {
          const collectionStore = epps.getStore<CollectionStoreMethods, CollectionState<List>>(0, id ?? defaultStoreId)
          return collectionStore()?.getItems()
        }
    }), 
    epps
)();
```

In this example:
- `useCollectionStore` is a utility provided by the Epps plugin to manage collections of items.
- The `useListsStore` store extends `useCollectionStore` to manage a collection of lists with persistence enabled.

### Usage in a Component

To use the `useListsStore` store in a Vue component, you can import and use it as follows:

```vue
<script setup>
import { useListsStore } from '../stores/lists'
import type { List } from "../models/liste"

const listsStore = useListsStore()
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

## Tested and testable

To ensure functional stability, the Epps plugin is tested with vitest. Its coverage rate is over 90%. 
To test Pinia stores using epps, you need to use the createPluginMock function. This function provides a mock implementation of epps plugin, allowing you to simulate its behavior during testing.

## For more details

- Read [Documentation](https://main.d1f2uye6dxmhh3.amplifyapp.com/) 
- Refer to the plugin's GitHub repository: [https://github.com/AlxBDo/Epps](https://github.com/AlxBDo/Epps).
