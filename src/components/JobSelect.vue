<script>
export default {
  props: {
    jobs: Array, 
    modelValue: String
  },
  emits: ['updateJobValue'],
  computed: {
    // computed property that auto-updates when the prop changes
    sortedItems() {
      const sorted = this.jobs
      var selected = ['Glaszetter', 'Slotenmaker']
      // const filtered = sorted.filter(({title}) => title != "");
      return sorted
    }
  },
  // methods: {
  //   compareObjects() {
  //     return console.log("test")
  // }
}
</script>

<template>

<select :value="modelValue" @input="$emit('updateJobValue', $event.target.value)">
  <option disabled value="">Kies er een</option>
  <option v-for="item in sortedItems" :value="item.link" :key="item.link">
    {{item.title}}
  </option>
</select>

</template>