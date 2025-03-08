<script setup lang="ts">
import CodeExplanation from '../../../shared/CodeExplanation.vue'
import Tips from '../../Tips.vue'

defineProps({
    isOptionApi: { type: Boolean, required: true }
})
</script>

<template>
    <h3>Lists Store creation</h3>
    <CodeExplanation>
        <template #explanation>
            <small>
                We create an instance of the lists store using <code>useListsStore</code> and type it
                with the appropriate methods and state.
            </small>
        </template>

        <template #code>
            <pre>
                {{isOptionApi ? `
export const useListsStore: DefineExtendedStore<Partial<CollectionStoreMethods>, Partial<CollectionState<List>>> = (
    id?: string
) => defineStore(id ?? defaultStoreId, {
        state: (): ExtendedState => ({
        parentsStores: [useCollectionStore('listsCollection')]
    })
})()` : `
export const useListsStore: DefineExtendedStore<Partial<CollectionStoreMethods>, Partial<CollectionState<List>>> = (
    id?: string
) => defineStore(id ?? defaultStoreId, () => {
        const parentsStores = ref([useCollectionStore('listsCollection')])

        return { parentsStores }
})()`}}
            </pre>
        </template>

        <template #tips>
            <div>
                <Tips>
                    <template #title>
                        Uses the <code>extendedState</code> function to obtain the state properties required
                        for the plugin.
                    </template>
                    <a>See <code>extendedState</code> function documentation</a>
                </Tips>
                <Tips>
                    <template #title>
                        To easily type a store, you can use <code>DefineExtendedStore</code> type.
                    </template>
                    This takes 2 parameters. First corresponds to methods of parent store(s) and second to
                    state.
                </Tips>
            </div>
        </template>
    </CodeExplanation>
</template>