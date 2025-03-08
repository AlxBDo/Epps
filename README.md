# ![Epps!](./src/assets/pinia-extends-store-75.png) Plugin `Epps`

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

`Epps!` plugin is designed to extend the functionality of Pinia stores by adding persistence and extension capabilities. It allows you to create more robust and flexible stores while simplifying state and action management.

## Advantages

- Extensibility: Facilitates adding new features to existing stores.
- Data Persistence: Retains store state between user sessions.

By using the Epps plugin, you can create more powerful and flexible Pinia stores while simplifying state and action management in your Vue.js application.

## Features

### Store Extension

The plugin allows you to extend existing stores by adding additional actions and states. This facilitates code reuse and dependency management between stores.

### Store Persistence

The plugin enables persisting the state of stores in Indexed DB, allowing data to be retained between user sessions. It uses encryption techniques to secure sensitive data.

## Usage

### Installation

To use the plugin, simply import it and add it to your Pinia instance:

```javascript
import { createPinia } from 'pinia';
import epps from './plugins/epps';

const pinia = createPinia();
pinia.use(epps);
```

#### Example Usage with useConnectedUserStore

The useConnectedUserStore store uses the plugin to manage connected user information, with persisted and encrypted data:

```javascript
import { extendedState } from "../plugins/pinia/extendsStore/extendedState";
import { defineExtendedStoreId } from "./defineExtendedStoreId";
import { useUserStore, type IUserStore, type TUserState } from "./user";
import type { PersistedStore, DefineExtendedStore } from "../types/store";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useConnectedUserStore: DefineExtendedStore<Partial<IUserStore & PersistedStore>, TUserState> = defineStore('connectedUserTest', () => {
    const { excludedKeys, isExtended, parentsStores, persist, persistedPropertiesToEncrypt } = extendedState(
        [useUserStore(defineExtendedStoreId('connected', 'user'))],
        {
            isOptionApi: false,
            persist: { persistedPropertiesToEncrypt: ref(['email', 'password', 'username']) }
        }
    )

    function init() {
        if (typeof isExtended === 'object') {
            isExtended.value = false
        }
    }

    return {
        excludedKeys,
        isExtended,
        init,
        parentsStores,
        persist,
        persistedPropertiesToEncrypt
    }
})
```

#### Usage in a Component

To use the useConnectedUserStore store in a Vue component, you can import and use it as follows:

```javascript
<template>
  <div>
    <h1>Connected User</h1>
    <p>Email: {{ connectedUser.email }}</p>
    <p>Username: {{ connectedUser.username }}</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script setup>
import { useConnectedUserStore } from '../stores/connectedUser';

const connectedUserStore = useConnectedUserStore();

const connectedUser = connectedUserStore.$state;

function logout() {
  connectedUserStore.$reset();
}
</script>
```