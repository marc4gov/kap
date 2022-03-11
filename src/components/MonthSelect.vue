<script>
export default {
  props: {
    months: Array, 
    modelValue: String
  },
  emits: ['updateMonthValue'],
}
</script>

<template>

<select :value="modelValue" @input="$emit('updateMonthValue', $event.target.value)">
  <option disabled value="">Kies een maand</option>
  <option v-for="item in months" :value="item.value" :key="item.value">
    {{item.title}}
  </option>
</select>

</template>