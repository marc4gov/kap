<script setup>

  import {ref, onMounted} from 'vue'

  const data = ref(({ 
    title: "",
    essentialCompetences: []
  }))
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
    getData('https://api.ovrhd.nl/competenties/OP-221')
  })


</script>

<script>
import SkillsItem from './SkillsItem.vue'

export default {
  components: {
    SkillsItem
  }
}
</script>

<template>

{{data.title}}


<Suspense>
  <template #default>
  <SkillsItem
    v-for="item in data.essentialCompetences"
    :key="item.code"
    :code="item.code"
    :description="item.description"
  />
  </template>
  <template #fallback>
    Laden...
  </template>
</Suspense>


  <!-- <p v-if="loading">
   Laden...
  </p>  -->
  <p v-if="error">
  </p>
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

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
