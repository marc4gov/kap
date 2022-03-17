<script setup lang="ts">
import { defineProps } from 'vue'
import { useMessage } from 'naive-ui'
import { NButton, NDropdown } from 'naive-ui'

const props = defineProps({
    options: Array, 
    title: String
})

const message = useMessage()

function handleSelect (key: string | number) {
  message.info(String(key))
}
</script>


<template>
  <n-dropdown
    trigger="click"
    :options="options"
    :show-arrow="true"
    @select="handleSelect"
  >
    <n-button>{{title}}</n-button>
  </n-dropdown>
</template>