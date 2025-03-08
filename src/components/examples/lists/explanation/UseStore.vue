<script setup lang="ts">
import CodeExplanation from '../../../shared/CodeExplanation.vue'
</script>

<template>
    <h3>Use Lists Store</h3>
    <CodeExplanation>
        <template #explanation>
            <small>We create an instance of the lists store using <code>useListsStore</code> and type it
                with the appropriate methods and state.</small>
        </template>

        <template #code>
            {{ `const listsStore = useListsStore() as ExtendedStore<CollectionStoreMethods, CollectionState<List>>` }}
        </template>
    </CodeExplanation>

    <CodeExplanation>
        <template #explanation>
            <h4>Add a list</h4>
            <small>We add a new list to <code>listsStore</code> using the <code>addItem</code> method.</small>
        </template>

        <template #code>
            {{ `listsStore.addItem({ id: 1, name: 'My list', type: '0' })` }}
        </template>
    </CodeExplanation>

    <CodeExplanation>
        <template #explanation>
            <h4>Remove a list</h4>
            <small>We remove a list to <code>listsStore</code> using the <code>removeItem</code> method.</small>
        </template>

        <template #code>
            {{ `listsStore.removeItem({ id: 5 })` }}
        </template>
    </CodeExplanation>

    <CodeExplanation>
        <template #explanation>
            <h4>Set lists</h4>
            <small>We initialize the store with some list items using the <code>setItems</code>
                method.</small>
        </template>

        <template #code>
            <pre>{{ `listsStore.setItems([
    { id: 1, name: 'My first list', type: '0' },
    { id: 2, name: 'My second list', type: '1' },
    { id: 3, name: 'My third list', type: '2' }
])`
            }}</pre>
        </template>
    </CodeExplanation>
</template>