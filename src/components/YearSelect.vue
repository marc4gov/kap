<script>
export default {
  props: {
    years: Array, 
    modelValue: String
  },
  emits: ['updateYearValue'],
}
</script>

<template>

<select :value="modelValue" @input="$emit('updateYearValue', $event.target.value)">
  <option disabled value="">Kies er een</option>
  <option v-for="year in years" :value="year" :key="year">
    {{year}}
  </option>
</select>

</template>