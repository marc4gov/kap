<script setup lang="ts">
// import { defineProps, defineEmits } from 'vue'
import { useMessage } from 'naive-ui'
import { NButton, NDropdown, NConfigProvider} from 'naive-ui'
import { darkTheme } from 'naive-ui'

const props = defineProps({
    options: [Object], 
    title: String,
})
const emit = defineEmits(['updateValue'])
const message = useMessage()

function handleSelect (key: string | number) {
  let obj = props.options.find((o) => (o.key === key));
  message.info(String(key) + " | " + obj.label)
  emit('updateValue', String(key))
}
</script>


<template>
    <n-config-provider :theme="darkTheme">

  <n-dropdown
    trigger="click"
    :options="options"
    :show-arrow="true"
    placement="bottom-start"
    @select="handleSelect"
  >
    <n-button>{{title}}</n-button>
  </n-dropdown>
      </n-config-provider>
</template>

