<script lang="ts">
import { defineComponent } from 'vue'
import { useMessage } from 'naive-ui'
import { NButton, NDropdown } from 'naive-ui'

export default defineComponent({
  props: {
    opts: Array, 
    title: String
  },
  setup (props) {
    const message = useMessage()
          console.log("Props options: ", props.opts)
    return {
      options: props.opts,
      handleSelect (key: string | number) {
        message.info(String(key))
      }
    }
  },
})
</script>


<template>

  <n-dropdown trigger="hover" :options="options" @select="handleSelect">
    <n-button>Test</n-button>
  </n-dropdown>

</template>