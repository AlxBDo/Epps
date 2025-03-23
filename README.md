# `Epps!` - Pinia plugin
## Extends and Persist Pinia Store


## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
   - [Store Extension](#store-extension)
   - [Store Persistence](#store-persistence)
3. [Usage](#usage)
   - [Installation](#installation)
   - [Example Usage with `useConnectedUserStore`](#example-usage-with-useconnecteduserstore)
   - [Example Usage with `useListsStore`](#example-usage-with-uselistsstore)
   - [Usage in a Component](#usage-in-a-component)
   - [Usage in a Component with `useListsStore`](#usage-in-a-component-with-uselistsstore)
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

#### Example Usage with useListsStore

The `useListsStore` store demonstrates how to create a collection-based store using the `useCollectionStore` store, which is integrated into the Epps plugin. This allows you to manage collections of items in your project seamlessly.

```javascript
import { ref } from "vue";
import { defineEppsStore, extendedState, useCollectionStore } from 'epps';
import type { CollectionState, CollectionStoreMethods } from "epps";
import type { List } from "../models/liste";

const defaultStoreId: string = 'lists';

export const useListsStore = (id?: string) => defineEppsStore<CollectionStoreMethods, CollectionState<List>>(
    id ?? defaultStoreId,
    () => ({
        ...extendedState(
            [useCollectionStore('listsCollection')],
            { isOptionApi: false, persist: { persist: ref(true) } }
        )
    })
)();
```

In this example:
- `useCollectionStore` is a utility provided by the Epps plugin to manage collections of items.
- The `useListsStore` store extends `useCollectionStore` to manage a collection of lists with persistence enabled.

For more details on `useCollectionStore` and its integration, refer to the plugin's GitHub repository: [https://github.com/AlxBDo/Epps/tree/main/src/stores](https://github.com/AlxBDo/Epps/tree/main/src/stores).

#### Usage in a Component

To use the `useListsStore` store in a Vue component, you can import and use it as follows:

```javascript
<script setup>
import { useListsStore } from '../stores/lists';
import type { CollectionStoreMethods, CollectionState } from 'epps';
import type { List } from "../models/liste";

const listsStore = useListsStore() as as EppsStore<CollectionStoreMethods, CollectionState<List>>;

// Example: Retrieve all lists
const allLists = listsStore.getItems();
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