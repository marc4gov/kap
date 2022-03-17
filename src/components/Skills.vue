<script setup>

  import {ref, onMounted} from 'vue'

  import { useJobsStore } from '../stores/jobs'
  import { useWishJobsStore } from '../stores/wishjobs'
  import { useSkillsStore } from '../stores/skills'
  import { useFetch } from './helpers/fetch'
  import { storeToRefs } from 'pinia'
  import { NInput, NDatePicker, NButton, NTabPane, NTabs, NCard } from 'naive-ui'
  import SelectItems from './SelectItems.vue'

  const data = ref([])
  const jobs = ref([])
  const skills = ref([])
  const error = ref(null)
  const loading = ref(true)
  
  const jobsStore = useJobsStore()
  const skillsStore = useSkillsStore()
  
  function getSkillsData(url) {
    fetch(url)
    .then((res) => res.json())
    .then((json) => {
      data.value.push(json)
      skills.value.push({"title": json.title,
                    "skills" : json.essentialCompetences.map((y) => ({
                              "label": y.description, 
                              "key": y.code
      }))})
      return Promise.resolve(json.essentialCompetences)
    })
    .then((comps) => {
      console.log("Comps: ", comps)
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

  onMounted(() => {
    console.log(jobsStore.doneJobs)
    jobsStore.doneJobs.map(x => getSkillsData('https://api.ovrhd.nl/competenties/' + x.id))
    loading.value = false
    console.log(jobs)
  })


</script>

<script>

export default {
  methods: {
    removeItemOnce(arr, value) {
      var index = arr.indexOf(value);
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
      const concats = [].concat(...this.jobs)
      const cset = new Set(concats)
      let arr = [...cset]
      const js = this.jobsStore.doneJobs.map((x) => x.id)
      for (let i = 0; i < js.length; i++) {
        arr = this.removeItemOnce(arr, js[i])
      }
      this.jobsStore.wishJobs = arr.map((x) => ({ 
        'job': x, 
        'count': concats.reduce((counter, obj) => obj === x ? counter += 1 : counter, 0)
      }))
      this.jobsStore.wishJobs = this.sortedData
      return
    },
    skillsData() {
      if (!this.skills) {
        return null;
      }
      return this.skills;
    },
    sortedData() {
      if (!this.jobsStore.wishJobs) {
        return [];
      }
      const sortedData = this.jobsStore.wishJobs.sort((a, b) => a.count > b.count? -1 : 1);
      sortedData.length = 10
      sortedData.map((x) => (x.job = this.jobsStore.allJobs.find((y) => (y.job == x.job))))
      console.log(sortedData)
      return sortedData;
    },
  }
}
</script>

<template>

    <!-- {{skill.title}} -->
        <SelectItems :options="skill.skills" :title="skill.title"
        v-for="skill in skillsData" :key="skill.title"/>


  <button @click="storeJobs">Wensberoepen</button>

<ul>
  <li v-for="job in jobsStore.wishJobs" :key="job.job">
    {{job.job.title}} : {{job.count}}

  </li>
</ul>

<!-- <data-table></data-table> -->

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
