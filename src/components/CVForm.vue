<script setup>
  import {ref, onMounted} from 'vue'

  const data = ref(null)
  const error = ref(null)
  const loading = ref(true)

  function getData(url) {
    fetch(url)
    .then((res) => res.json())
    .then((json) => (data.value = json))
    .then(() => (loading.value = false))
    .catch((err) => (error.value = err))
    return { data, error, loading }
  }

  onMounted(() => {
    getData('https://api.ovrhd.nl/competenties/')
  })
</script>

<script>
import JobSelect from './JobSelect.vue'

export default {
  methods: {
    update(val) {
      this.selected = val
    }
  },
  components: {
    JobSelect
  },
  data() { 
    return {
      selected: "test",
      items: [
        { title: "test", link: "test" },
        { title: "pest", link: "pest" },
        { title: "lest", link: "lest" }
      ]
    }
  },
  computed: {
    // computed property that auto-updates when the prop changes
    sortedItems(values) {
      return values[0]
    }
  },

}
</script>


<template>

<job-select class="select" :jobs="data" @update-job-value="update"></job-select>

<div>Selected: {{ selected }}</div>

</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

.select{
  text-align: center;
  color: var(--vt-c-text-dark-2);
  background: var(--vt-c-black);
  border:none;
}

.select:active {
    background-color: var(--vt-c-black);
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
