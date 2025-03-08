<script setup lang="ts">
defineProps({
    isOptionApi: { type: Boolean, required: true }
})
</script>

<template>
    <div id="is-option-api-syntax" @click="$emit('isOptionApiToggle')">
        <form>
            Store syntax :
            <label for="is-option-api-btn">
                <input name="is-option-api-radio" id="is-option-api-btn" type="radio" value="1" :checked="isOptionApi">
                OptionApi
            </label>
            <label for="not-option-api-btn">
                <input name="is-option-api-radio" id="not-option-api-btn" type="radio" value="0"
                    :checked="!isOptionApi">
                Setup
            </label>
        </form>
    </div>
</template>

<style scoped>
.is-option-api-syntax {
    position: fixed;
    right: 25px;

    label {
        margin-left: 5px;

        &:first-of-type {
            margin-right: 10px;
        }
    }
}
</style>