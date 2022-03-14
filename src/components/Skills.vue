<script setup>

  import {ref, onMounted} from 'vue'

  import { useJobsStore } from '../stores/jobs'
  import { useWishJobsStore } from '../stores/wishjobs'
  import { useSkillsStore } from '../stores/skills'
  

  import { storeToRefs } from 'pinia'

  const data = ref([])
  const jobs = ref([])
  const error = ref(null)
  const loading = ref(true)
  
  const jobsStore = useJobsStore()
  const wishJobsStore = useWishJobsStore()
  const skillsStore = useSkillsStore()
  
  function getSkillsData(url) {
    fetch(url)
    .then((res) => res.json())
    .then((json) => {
      data.value.push(json)
      return Promise.resolve(json.essentialCompetences)
    })
    .then((comps) => {
      // console.log("Comps: ", comps)
      Promise.all(comps.map(x => getJobsData('https://api.ovrhd.nl/competenties/search/CP/' + x.code)))
    })
    .catch((err) => (error.value = err))

    return { data, error }
  }

  function getJobsData(url) {
    fetch(url)
    .then((res) => res.json())
    .then((json) => {
      jobs.value.push(json.map(x => x.link.split("/api/")[1]))
    })
    .catch((err) => (error.value = err))

    return { jobs, error }
  }


  function getOPLinks(jobs) {
    return jobs.map(x => x.id.split("/api/")[1])
  }

  onMounted(() => {
    const links = getOPLinks(jobsStore.jobs)
    links.map(x => getSkillsData('https://api.ovrhd.nl/competenties/' + x))
    loading.value = false
    console.log(jobs)
  })


</script>

<script>
import SkillsItem from './SkillsItem.vue'

export default {
  components: {
    SkillsItem
  },
  methods: {
    removeItemOnce(arr, value) {
      var index = arr.indexOf(value);
            console.log("Value: ", value)

      console.log("Index: ", index)
      if (index > -1) {
        arr.splice(index, 1);
      }
      return arr;
    }
  },
  computed: {
    storeJobs() {
      if (!this.jobs) {
        return 
      }
      console.log("Jobs:", this.jobs)
      const concats = [].concat(...this.jobs)
      console.log("Concats: ", concats)
      const cset = new Set(concats)
      let arr = [...cset]
      const js = this.getOPLinks(this.jobsStore.jobs)
      console.log("Js: ", js)
      for (let i = 0; i < js.length; i++) {
        arr = this.removeItemOnce(arr, js[i])
      }
      console.log("Arr: ", arr)
      arr = arr.map((x) => ({ 
        'job': x, 
        'count': concats.reduce((counter, obj) => obj === x ? counter += 1 : counter, 0)
      }))
      arr = arr.filter((x) => (x.count >= 3))
      console.log("Arr > 3: ", arr)


      return
    },
    filteredData() {
      if (!this.data) {
        return [];
      } 
      const sortedItems = this.sortedData.filter((job) => (job.title.includes(this.message)));
      return sortedItems
    },
    sortedData() {
      if (!this.data) {
        return [];
      }
      const sortedData = this.data.sort((a, b) => a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1);
      return sortedData;
    },
  }
}
</script>

<template>
  <ul>
  <li :v-if="!loading" v-for="dataItem in sortedData" :key="dataItem.title">
    {{ dataItem.title }}
    <SkillsItem
      v-for="item in dataItem.essentialCompetences"
      :key="item.code"
      :code="item.code"
      :description="item.description"
    />
  </li>
  </ul>
  <button @click="storeJobs">Wensberoepen</button>
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
