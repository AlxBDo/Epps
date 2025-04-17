# Documentation: Using the `epps` Plugin

The `epps` plugin provides advanced features for managing Pinia stores, such as persistence, encryption, and store extension. Below, we detail its usage and provide examples of defining stores using the `defineEppsStore` function.


## Table des matières
- [Overview of `defineEppsStore`](#overview-of-defineeppsstore)
- [Type Requirements](#type-requirements)
- [Prototype of `extendedState`](#prototype-of-extendedstate)
- [Interface: `ExtendedState`](#interface-extendedstate)
- [Interface: `ExtendedStateOptions`](#interface-extendedstateoptions)
- [`useCollectionStore`](#usecollectionstore)
  - [Prototype](#prototype)
  - [Features](#features)
  - [Interfaces](#interfaces)
    - [`CollectionState`](#collectionstate)
    - [`CollectionStoreMethods`](#collectionstoremethods)
  - [Example: Basic Usage of `useCollectionStore`](#example-basic-usage-of-usecollectionstore)
- [Epps Stores examples](#epps-stores-examples)
  - [Extending `useCollectionStore`](#example-extending-usecollectionstore)
  - [Persisted Store Definition](#example-persisted-store-definition)
  - [Store Definition extending several parent Stores](#example-store-definition-extending-several-parent-stores)
  - [Store deep inheritance and Store parent method extension](#example-Store-deep-inheritance-and-Store-parent-method-extension)
- [Testing Pinia Stores with `epps`](#testing-pinia-stores-with-epps)
- [Dependencies](#dependencies)

## Overview of `defineEppsStore`

The `defineEppsStore` function is a utility provided by the `epps` plugin to define stores with extended capabilities. It allows you to:
- Extend existing stores.
- Add persistence with encryption.
- Define parent-child relationships between stores.

## Type Requirements

When using `defineEppsStore`, you must provide two generic types:
1. **Store Methods (`TStore`)**: Defines the methods available in the store.
2. **Store State (`TState`)**: Defines the state properties of the store.

This ensures that the store is strongly typed, providing better type safety and developer experience.

## Prototype of `extendedState`

The `extendedState` function is used to extend the state of a store by integrating parent stores and adding persistence options.

```typescript
function extendedState<TStore, TState>(
    parentsStores: Store[] | EppsStore<TStore, TState>[],
    options?: ExtendedStateOptions
): ExtendedState;
```

## Interface: `ExtendedState`

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

## Interface: `ExtendedStateOptions`

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

## `useCollectionStore`

The `useCollectionStore` is a utility provided by the `epps` plugin to manage collections of items. It simplifies the management of collections by providing predefined methods for adding, retrieving, updating, and removing items.

### Prototype

```typescript
function useCollectionStore<T>(id: string): Store & CollectionState<T> & CollectionStoreMethods;
```

### Features

- **Dynamic Collection Management**: Easily manage collections of items with predefined methods.
- **Customizable**: Extend the store to add custom logic or integrate it with other stores.
- **Persistence**: Combine with `defineEppsStore` to enable persistence for collections.

### Interfaces

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
const allItems = collectionStore.items;
console.log(allItems);

// Search items
const itemsFound = collectionStore.getItems({ type: '1' })

// Update an item
collectionStore.updateItem({ id: 1, name: "Updated Item 1" });

// Remove an item
collectionStore.removeItem({ id: 1 });
```

## Epps Stores examples

### Example: Extending `useCollectionStore`

You can extend `useCollectionStore` to add custom logic or integrate it with other stores.

```typescript
import { defineEppsStore, extendedState, useCollectionStore } from "epps";
import type { CollectionState, CollectionStore } from "epps";

import { List, SearchCollectionCriteria } from "../types"

export type ListsStoreMethods = CollectionStoreMethods & { getLists: (criteria?: SearchCollectionCriteria) => List[] }

export const useCustomCollectionStore = defineEppsStore<ListsStoreMethods, CollectionState<List>>(
    "lists",
    () => {
        const {
            excludedKeys,
            actionsToExtends,
            parentsStores,
            persist,
            persistedPropertiesToEncrypt
        } = extendedState(
            [useCollectionStore('listsCollection')],
            { persist: { watchMutation: ref(true) } } // Automatically persist on state changes
        )

        function getLists(criteria?: SearchCollectionCriteria) {
            return parentsStores && getParentStoreMethod('getItems', 0, parentsStores())(criteria)
        }

        return {
            actionsToExtends,
            getLists,
            excludedKeys,
            parentsStores,
            persist,
            persistedPropertiesToEncrypt
        }
    }
);
```

The `useCollectionStore` utility is a powerful tool for managing collections in your application. By combining it with `defineEppsStore`, you can enable persistence and extend its functionality to meet your specific needs.

### Example: Persisted Store Definition

This example demonstrates a simple store definition with persistence enabled and data encryption.

```typescript
import { ref, type Ref } from "vue";
import { defineEppsStore } from "epps";

interface PersistedStoreMethods {
    setSensitiveData: (sensitiveData: string) => void;
}

interface PersistedStoreState {
    sensitiveData: Ref<string|undefined>;
}

export const usePersistedStore = defineEppsStore<PersistedStoreMethods, PersistedStoreState>(
    "basicStore",
    () => {
        const persist = ref(true)
        const persistedPropertiesToEncrypt = ref(["sensitiveData"]) // Encrypt this property
        const sensitiveData = ref("secret")
        const watchMutation = ref(true) // Automatically persist on state changes

        function setSensitiveData(newData: string) { 
            if(newData) {
                sensitiveData.value = newData
            }
        }

        return {
            persist, 
            persistedPropertiesToEncrypt, 
            sensitiveData, 
            watchMutation
        }
    }
);
```

### Example: Store Definition extending several parent Stores

This example shows the definition of a non-persisted Store, extending several parent Stores whose id is defined dynamically.

```typescript
import { defineEppsStore, extendedState,  getParentStoreMethod, useCollectionStore } from "epps";
import { Ref, ref } from "vue";

import { ItemStore, useItemStore, type ItemStoreState } from "./item";
import { User } from "../models/user";
import { ListTypes } from "../types/list";
import { Item } from "../models/item";

import type { CollectionState, CollectionStoreMethods, ExtendedState } from "epps";
import type { List } from "../models/liste";


export interface ListStoreState extends ItemStoreState, ExtendedState, CollectionState<Item>, Omit<List, 'items'> {
    guest?: Ref<User[]> | User[]
    owner?: Ref<User> | User
}
export type ListStoreMethods = CollectionStoreMethods & ItemStore & { setData: (data: ListStoreState) => void }


export const useListStore = (id: string | number) => defineEppsStore<CollectionStoreMethods, ListStoreState>(
    `list-${id}`,
    () => {
        const extendedStates = extendedState(
            [useItemStore(`list-item-${id}`), useCollectionStore(`list-${id}-items`)]
        )
        const guest = ref<User[]>([])
        const owner = ref<User>()
        const type = ref<ListTypes>()

        function setData(data: ListStoreState) {
            if (data.guest) { guest.value = Array.isArray(data.guest) ? data.guest : data.guest?.value; }

            if (data.items) {
                const setItems = extendedStates.parentsStores && getParentStoreMethod(
                    'setItems',
                    `list-${id}-items`,
                    extendedStates.parentsStores()
                )

                setItems && setItems(data.items)
            }

            if (data.owner) { owner.value = (data.owner as Ref)?.value ?? data.owner; }

            if (data.type) { type.value = data.type }
        }

        return {
            ...extendedStates,
            guest,
            owner,
            type,
            setData
        }
    }
)()
```

### Example: Store deep inheritance and Store parent method extension


This example presents the useUserStore. This store inherits from the useContactStore, which in turn inherits from the useItemStore. 
In addition, the Store extends the setData method also declared in the parent Store useItemStore. For the setData method to be extended, it must be declared in the extendedState.options.actionsToExtends parameter (see [`ExtendedStateOptions`](#interface-extendedstateoptions)).

```typescript
// ./stores/item.ts
import { defineStore } from "pinia";
import type { Item } from "../models/item";

export interface IItemStore {
    setData: (data: Item) => void
}

export const useItemStore = (id?: string) => defineStore(id ?? 'item', {
    state: (): Item => ({
        "@id": undefined,
        id: undefined
    }),

    actions: {
        setData(data: Partial<Item>) {
            if (data['@id']) { this['@id'] = data['@id'] }
            if (data.id) { this.id = data.id }
        }
    }
})()
```

```typescript
// ./stores/contact.ts
import { computed, ref } from "vue";
import { defineEppsStore, defineStoreId, extendedState, getParentStorePropertyValue } from "epps"
import { Store } from "pinia";

import { useItemStore } from "./item"

import type { Contact } from "../models/contact"
import type { ExtendState } from "../types/store";
import type { Item } from "../models/item"


export interface ContactStore {
    setData: (data: ContactState) => void
    contact: Contact
}

export type ContactState = ExtendState<Item, Contact>

export const useContactStore = (id?: string) => defineEppsStore<ContactStore, ContactState>(
    id ?? 'contact',
    () => {
        const email = ref<string>()
        const firstname = ref<string>()
        const lastname = ref<string>()

        const {
            excludedKeys,
            actionsToExtends,
            parentsStores,
            persist,
            persistedPropertiesToEncrypt
        } = extendedState(
            [useItemStore(defineStoreId(id ?? 'contact', 'item'))],
            { actionsToExtends: ['setData'] }
        )


        const contact = computed(() => ({
            '@id': parentsStores && getParentStorePropertyValue('@id', 0, parentsStores() ?? ([] as Store[])),
            id: parentsStores && getParentStorePropertyValue('id', 0, parentsStores()),
            email: email.value,
            firstname: firstname.value,
            lastname: lastname.value
        }))


        function setData(data: ContactState) {
            if (data.email) { email.value = data.email; }
            if (data.firstname) { firstname.value = data.firstname; }
            if (data.lastname) { lastname.value = data.lastname; }
            // When this method is called, the parent Store method is also executed.
            //This is possible because the “setData” method is defined in the ‘actionsToExtends’ parameter of the “extendedState” function.
        }

        return {
            actionsToExtends,
            contact,
            email,
            firstname,
            excludedKeys,
            lastname,
            parentsStores,
            persist,
            persistedPropertiesToEncrypt,
            setData
        }
    }
)()
```

```typescript
// ./stores/user.ts

import { computed, ref } from "vue";
import { defineEppsStore, defineStoreId, extendedState, getParentStorePropertyValue } from "epps"

import { useContactStore } from "./contact"

import type { ExtendState } from "epps"

import type { Contact } from "../models/contact"
import type { List } from "../models/list"
import type { User } from "../models/user"


export interface UserStore {
    setData: (data: UserState) => void
    user: User
}

export type UserState = ExtendState<Contact, User>

export const useUserStore = (id?: string) => defineEppsStore<UserStore, UserState>(
    id ?? 'contact',
    () => {
        const lists = ref<List[]>()
        const password = ref<string>()

        const {
            excludedKeys,
            actionsToExtends,
            parentsStores,
            persist,
            persistedPropertiesToEncrypt
        } = extendedState(
            [useContactStore(defineStoreId(id ?? 'user', 'contact'))],
            { actionsToExtends: ['setData'] }
        )

        const user = computed(() => ({
            ...(parentsStores ? getParentStorePropertyValue('contact', 0, parentsStores()) : {}),
            password: password.value
        }))


        function setData(data: UserState) {
            if (data.lists) { lists.value = data.lists; }
            if (data.password) { password.value = data.password; }
            // When this method is called, the parent Store method is also executed.
            // This is possible because the “setData” method is defined in the ‘actionsToExtends’ parameter of the “extendedState” function.
        }

        return {
            actionsToExtends,
            excludedKeys,
            lists,
            parentsStores,
            password,
            persist,
            persistedPropertiesToEncrypt,
            setData,
            user
        }
    }
)()
```


## Testing Pinia Stores with `epps`

To test Pinia stores created with the `epps` package, you need to use the `createPluginMock` function. This function provides a mock implementation of the `epps` plugin, allowing you to simulate its behavior during testing. It creates a mock persistence layer and optionally supports encryption using the provided initialization vector (IV) and encryption key. By integrating this mock plugin into your Pinia instance, you can test your stores without relying on actual browser storage or encryption mechanisms.

### Example: Using `createPluginMock` in a `beforeEach` Setup

Here is an example of how to use `createPluginMock` in a `beforeEach` setup function:

```typescript
import { beforeEach } from "vitest";
import { createApp } from "vue";
import { createPinia, setActivePinia } from "pinia";
import { createPluginMock } from "epps";

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

- **Pinia**: A state management library for Vue.js. [Official Documentation](https://pinia.vuejs.org/)
- **CryptoJS**: A library used for encrypting persisted data. [Official Documentation](https://cryptojs.gitbook.io/docs/)

These dependencies are automatically installed with the `epps` package. Ensure your project uses compatible versions of Vue and Pinia for optimal functionality.