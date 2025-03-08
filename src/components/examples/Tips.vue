<script setup lang="ts">
import { useSlots } from 'vue'

const slots = useSlots()
</script>

<template>
    <div class="tips-ctn">
        <p class="tips-icon">💡</p>
        <div class="tips-text">
            <p class="tips-title" v-if="slots.title">
                <slot name="title"></slot>
            </p>
            <slot></slot>
        </div>
    </div>
</template>


<style scoped>
div.tips-ctn {
    border: 1px solid;
    color: rgb(54, 171, 54);
    display: flex;
    align-items: center;
    margin: 15px;
    padding: 10px;
    border-radius: 12px;

    p.tips-icon {
        margin: 10px;
        padding: 5px;
        font-size: x-large;
        width: 50px
    }

    p.tips-text {
        font-size: small;
    }

    p.tips-title {
        font-weight: bolder;
        font-size: larger;
        margin: 0;
    }
}
</style>