<script>
export default {
  props: {
    jobs: Array, 
    modelValue: String
  },
  emits: ['updateJobValue'],
}
</script>

<template>

<select :value="modelValue" @input="$emit('updateJobValue', $event.target.value)">
  <option disabled value="">Kies er een</option>
  <option v-for="item in jobs" :value="item.link" :key="item.link">
    {{item.title}}
  </option>
</select>

</template>