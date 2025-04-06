# Documentation: Using the `epps` Plugin

The `epps` plugin provides advanced features for managing Pinia stores, such as persistence, encryption, and store extension. Below, we detail its usage and provide examples of defining stores using the `defineEppsStore` function.

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
const allItems = collectionStore.getItems();
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

export const useCustomCollectionStore = defineEppsStore(
    "customCollection",
    () => ({
        ...extendedState(
            [useCollectionStore("exampleCollection")],
            persist: {
                watchMutation: ref(true) // Automatically persist on state changes
            }
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

- **Pinia**: A state management library for Vue.js. [Official Documentation](https://pinia.vuejs.org/)
- **CryptoJS**: A library used for encrypting persisted data. [Official Documentation](https://cryptojs.gitbook.io/docs/)

These dependencies are automatically installed with the `epps` package. Ensure your project uses compatible versions of Vue and Pinia for optimal functionality.