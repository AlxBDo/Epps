<script setup lang="ts">
import { pluginName } from '../../utils/constantes'
</script>

<template>
    <div class="header">
        <div>
            <a href="/">
                <img src="../../assets/pinia-extends-store-150.png" class="logo" alt="Extend store plugin logo" />
            </a>
            <div>
                <h1>{{ pluginName }}</h1>
                <h2>
                    <span>E</span>xtends and <span>P</span>ersist any <span>P</span>inia <span>S</span>tore
                </h2>
            </div>
        </div>
    </div>
</template>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;

    &>div {
        display: flex;
        align-items: center;

        div {
            text-align: left;
        }
    }

    h1 {
        margin-bottom: 0;
    }

    h1,
    h2 span {
        color: var(--primary-color);
    }

    h2 {
        margin-top: 0;
        font-size: large;

        span {
            font-weight: bolder;
            font-size: larger;
        }
    }

    .logo {
        margin-right: 25px;
        margin-top: 10px;
        width: 75px;

        &:hover {
            filter: drop-shadow(0 0 2em #d4d250aa);
        }
    }
}
</style>