
# `Epps!` - Pinia plugin

## Extends and Persist Pinia Store

## Table of Contents

1. [Introduction](#introduction)
2. [Advantages](#advantages)
3. [Features](#features)
   - [Store Extension](#store-extension)
   - [Store Persistence](#store-persistence)
   - [Data Encryption](#data-encryption)
4. [Getting Started](#getting-started)
5. [Usage](#usage)
   - [Installation](#installation)
   - [Example Usage with `useConnectedUserStore`](#example-usage-with-useconnecteduserstore)
   - [Example Usage with `useListsStore`](#example-usage-with-uselistsstore)
   - [Usage in a Component](#usage-in-a-component)
   - [Usage in a Component with `useListsStore`](#usage-in-a-component-with-uselistsstore)
6. [Technical Documentation: Using the `epps` Plugin](#technical-documentation-using-the-epps-plugin)
   - [Overview of `defineEppsStore`](#overview-of-defineeppstore)
   - [Prototype of `extendedState`](#prototype-of-extendedstate)
   - [Interface: `ExtendedState`](#interface-extendedstate)
   - [Interface: `ExtendedStateOptions`](#interface-extendedstateoptions)
   - [`useCollectionStore`](#usecollectionstore)
7. [Examples](#examples)
   - [Basic Store Definition](#example-1-basic-store-definition)
   - [Store with Parent-Child Relationship](#example-2-store-with-parent-child-relationship)
   - [Store with Encrypted Persistence](#example-3-store-with-encrypted-persistence)
   - [Store with Custom Actions and State](#example-4-store-with-custom-actions-and-state)
   - [Store with Multiple Parent Stores](#example-5-store-with-multiple-parent-stores)
8. [Testing Pinia Stores with `epps`](#Testing-Pinia-Stores-with-epps)
8. [Dependencies](#dependencies)
9. [Summary](#summary)

## Introduction

Epps! is a plugin for the Pinia state management library in Vue.js. It extends Pinia stores with advanced features such as persistence, encryption, and store extension. It simplifies state and action management while ensuring sensitive data is protected and enabling seamless integration of parent-child store relationships.

## Advantages

- **Extensibility**: Facilitates adding new features to existing stores and supports parent-child store relationships.
- **Data Persistence**: Retains store state between user sessions using IndexedDB or LocalStorage.
- **Data Security**: Encrypts persisted data to protect sensitive information.

By using the Epps plugin, you can create more powerful and flexible Pinia stores while ensuring data security and simplifying state management in your Vue.js or Nuxt application.

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

```typeScript
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

## Usage

### Define Epps Store: Example Usage with `useListsStore`

The `useListsStore` store demonstrates how to create a collection-based store using the `useCollectionStore` store, which is integrated into the Epps plugin. This allows you to manage collections of items in your project seamlessly.

```typeScript
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

### Usage in a Component

To use the `useListsStore` store in a Vue component, you can import and use it as follows:

```vue
<script setup>
import { useListsStore } from '../stores/lists'
import type { CollectionStoreMethods, CollectionState } from 'epps'
import type { List } from "../models/liste"

const listsStore = useListsStore() as EppsStore<CollectionStoreMethods, CollectionState<List>>

/**
 * ⚠️ NUXT 
 * 
 * In nuxt application, calling a method from a parent Store causes an error if the page is refreshed or if it is 
 * the application's entry point To solve this problem, check that the method exists before 
 * calling it.
 * 
 * Example : 
 *  listsStore.remember & listsStore.remember().then...
 * 
 */
listsStore.remember().then(() => {
    if (!listsStore.items.length) {
        listsStore.setItems([
            { id: 1, name: 'My first list', type: '0' },
            { id: 2, name: 'My second list', type: '1' },
            { id: 3, name: 'My third list', type: '2' }
        ])
    }
})

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

## Technical Documentation: Using the `epps` Plugin

The `epps` plugin provides advanced features for managing Pinia stores, such as persistence, encryption, and store extension. Below, we detail its usage and provide examples of defining stores using the `defineEppsStore` function.

### Overview of `defineEppsStore`

The `defineEppsStore` function is a utility provided by the `epps` plugin to define stores with extended capabilities. It allows you to:
- Extend existing stores.
- Add persistence with encryption.
- Define parent-child relationships between stores.

#### Type Requirements

When using `defineEppsStore`, you must provide two generic types:
1. **Store Methods (`TStore`)**: Defines the methods available in the store.
2. **Store State (`TState`)**: Defines the state properties of the store.

This ensures that the store is strongly typed, providing better type safety and developer experience.

### Prototype of `extendedState`

The `extendedState` function is used to extend the state of a store by integrating parent stores and adding persistence options.

```typescript
function extendedState<TStore, TState>(
    parentsStores: Store[] | EppsStore<TStore, TState>[],
    options?: ExtendedStateOptions
): ExtendedState;
```

### Interface: `ExtendedState`

The `ExtendedState` interface defines the structure of the extended state returned by the `extendedState` function.

```typescript
interface ExtendedState {
    actionsToExtends?: string[] | Ref<string[] | undefined>;
    isExtended?: boolean | Ref<boolean | undefined>;
    isOptionApi?: boolean | Ref<boolean | undefined>;
    parentsStores?: () => Store[] | EppsStore<AnyObject, AnyObject>[];
    excludedKeys?: string[] | Ref<string[]>;
    isEncrypted?: boolean | Ref<boolean>;
    persist?: boolean | Ref<boolean>;
    persistedPropertiesToEncrypt?: string[] | Ref<string[]>;
    watchMutation?: boolean | Ref<boolean>;
}
```

### Interface: `ExtendedStateOptions`

The `ExtendedStateOptions` interface defines the optional configuration for the `extendedState` function.

```typescript
interface ExtendedStateOptions {
    actionsToExtends?: string[];
    isExtended?: boolean;
    isOptionApi?: boolean;
    persist?: {
        excludedKeys?: string[] | Ref<string[]>;
        isEncrypted?: boolean | Ref<boolean>;
        persist?: boolean | Ref<boolean>;
        persistedPropertiesToEncrypt?: string[] | Ref<string[]>;
        watchMutation?: boolean | Ref<boolean>;
    };
}
```

### `useCollectionStore`

The `useCollectionStore` is a utility provided by the `epps` plugin to manage collections of items. It simplifies the management of collections by providing predefined methods for adding, retrieving, updating, and removing items.

#### Prototype

```typescript
function useCollectionStore<T>(id: string): Store & CollectionState<T> & CollectionStoreMethods;
```

#### Features

- **Dynamic Collection Management**: Easily manage collections of items with predefined methods.
- **Customizable**: Extend the store to add custom logic or integrate it with other stores.
- **Persistence**: Combine with `defineEppsStore` to enable persistence for collections.

#### Interfaces

##### `CollectionState`

Defines the state structure for a collection store.

```typescript
interface CollectionState<T> {
    items: T[];
}
```

##### `CollectionStoreMethods`

Defines the methods available in a collection store.

```typescript
interface CollectionStoreMethods {
    addItem: (item: AnyObject) => void;
    getItem: (criteria: SearchCollectionCriteria) => AnyObject | undefined;
    getItems: (criteria?: SearchCollectionCriteria) => AnyObject[];
    removeItem: (item: AnyObject) => void;
    setItems: <T>(items: T[]) => void;
    updateItem: (updatedItem: AnyObject, oldItem?: AnyObject) => void;
}
```

#### Example: Basic Usage of `useCollectionStore`

```typescript
import { useCollectionStore } from "epps";

const collectionStore = useCollectionStore("exampleCollection");

// Add an item to the collection
collectionStore.addItem({ id: 1, name: "Item 1" });

// Retrieve an item by criteria
const item = collectionStore.getItem({ id: 1 });
console.log(item);

// Retrieve all items
const allItems = collectionStore.getItems();
console.log(allItems);

// Update an item
collectionStore.updateItem({ id: 1, name: "Updated Item 1" });

// Remove an item
collectionStore.removeItem({ id: 1 });
```

#### Example: Extending `useCollectionStore`

You can extend `useCollectionStore` to add custom logic or integrate it with other stores.

```typescript
import { defineEppsStore, extendedState, useCollectionStore } from "epps";

export const useCustomCollectionStore = defineEppsStore(
    "customCollection",
    () => ({
        ...extendedState(
            [useCollectionStore("exampleCollection")],
            { persist: { persist: true } }
        ),
        customMethod() {
            console.log("Custom method executed");
        }
    })
);
```

The `useCollectionStore` utility is a powerful tool for managing collections in your application. By combining it with `defineEppsStore`, you can enable persistence and extend its functionality to meet your specific needs.

### Example 1: Basic Store Definition

This example demonstrates a simple store definition with persistence enabled.

```typescript
import { ref } from "vue";
import { defineEppsStore } from "epps";

interface BasicStoreMethods {
    increment: () => void;
}

interface BasicStoreState {
    count: number;
}

export const useBasicStore = defineEppsStore<BasicStoreMethods, BasicStoreState>(
    "basicStore",
    () => ({
        count: ref(0),
        persist: {
            persist: ref(true), // Enable persistence
            watchMutation: ref(true) // Automatically persist on state changes
        },
        increment() {
            this.count++;
        }
    })
);
```

### Example 2: Store with Parent-Child Relationship

This example shows how to define a store that extends a parent store.

```typescript
import { ref } from "vue";
import { defineEppsStore, extendedState } from "epps";
import { useCollectionStore } from "./collection";

export const useChildStore = defineEppsStore(
    "childStore",
    () => ({
        ...extendedState(
            [useCollectionStore("parentCollection")], // Extend the parent store
            { persist: { persist: ref(true) } }
        ),
        childProperty: ref("childValue"),
        childMethod() {
            console.log("Child method called");
        }
    })
);
```

### Example 3: Store with Encrypted Persistence

This example demonstrates how to define a store with encrypted persistence for sensitive data.

```typescript
import { ref } from "vue";
import { defineEppsStore } from "epps";

export const useSecureStore = defineEppsStore(
    "secureStore",
    () => ({
        sensitiveData: ref("secret"),
        persist: {
            persistedPropertiesToEncrypt: ref(["sensitiveData"]), // Encrypt this property
            watchMutation: ref(true)
        }
    })
);
```

### Example 4: Store with Custom Actions and State

This example shows how to define a store with custom actions and state, while extending another store.

```typescript
import { ref } from "vue";
import { defineEppsStore, extendedState } from "epps";
import { useCollectionStore } from "./collection";

export const useCustomStore = defineEppsStore(
    "customStore",
    () => ({
        ...extendedState(
            [useCollectionStore("customCollection")],
            { persist: { persist: ref(true) } }
        ),
        customState: ref("customValue"),
        customAction() {
            console.log("Custom action executed");
        }
    })
);
```

### Example 5: Store with Multiple Parent Stores

This example demonstrates how to define a store that extends multiple parent stores.

```typescript
import { ref } from "vue";
import { defineEppsStore, extendedState } from "epps";
import { useCollectionStore } from "./collection";
import { useItemStore } from "./item";

export const useMultiParentStore = defineEppsStore(
    "multiParentStore",
    () => ({
        ...extendedState(
            [useCollectionStore("collectionParent"), useItemStore("itemParent")],
            { persist: { persist: ref(true) } }
        ),
        additionalState: ref("additionalValue"),
        additionalAction() {
            console.log("Additional action executed");
        }
    })
);
```

## Testing Pinia Stores with `epps`

To test Pinia stores created with the `epps` package, you need to use the `createPluginMock` function. This function provides a mock implementation of the `epps` plugin, allowing you to simulate its behavior during testing. It creates a mock persistence layer and optionally supports encryption using the provided initialization vector (IV) and encryption key. By integrating this mock plugin into your Pinia instance, you can test your stores without relying on actual browser storage or encryption mechanisms.

### Example: Using `createPluginMock` in a `beforeEach` Setup

Here is an example of how to use `createPluginMock` in a `beforeEach` setup function:

```typescript
import { beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { createPluginMock } from "../../testing/mocks/epps";
import { createApp } from "vue";

export function beforeEachPiniaPlugin() {
    beforeEach(() => {
        const app = createApp({});

        // Create a Pinia instance with the mocked epps plugin
        const pinia = createPinia().use(
            createPluginMock(
                'localStorage', // Mock database name
                'Replace_with_your_IV_string', // Mock encryption IV
                'Replace_with_your_KEY_string' // Mock encryption key
            )
        );

        app.use(pinia);
        setActivePinia(pinia); // Set the active Pinia instance for testing
    });
}
```

This setup ensures that all tests using Pinia stores with the epps plugin will have a consistent and isolated environment, making it easier to validate store behavior. 

## Dependencies

The `epps` package relies on the following dependencies to provide its features:

- **Vue**: The progressive JavaScript framework for building user interfaces. [Official Documentation](https://vuejs.org/)
- **Pinia**: A state management library for Vue.js. [Official Documentation](https://pinia.vuejs.org/)
- **CryptoJS**: A library used for encrypting persisted data. [Official Documentation](https://cryptojs.gitbook.io/docs/)

These dependencies are automatically installed with the `epps` package. Ensure your project uses compatible versions of Vue and Pinia for optimal functionality.

### Summary

The `defineEppsStore` function provides a flexible way to define stores with advanced features such as persistence, encryption, and parent-child relationships. By leveraging the `epps` plugin, you can simplify state management and enhance the capabilities of your Pinia stores.

For more details, refer to the plugin's GitHub repository: [https://github.com/AlxBDo/Epps](https://github.com/AlxBDo/Epps).
