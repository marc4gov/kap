<script>
export default {
  props: ['items', 'modelValue'],
  emits: ['updateValue']
}
</script>

<template>

<select :value="modelValue" @input="$emit('updateValue', $event.target.value)">
  <option disabled value="">Kies er een</option>
  <option v-for="item in items" :value="item.code" :key="item.code">
    {{item.description}}
  </option>
</select>

</template>