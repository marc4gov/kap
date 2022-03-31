<script setup>

  import {ref, onMounted} from 'vue'
  import { reactive, computed } from 'vue'

  import { useJobsStore } from '../stores/jobs'
  import { useSkillsStore } from '../stores/skills'
  import { useFetch } from './helpers/fetch'
  import { storeToRefs } from 'pinia'
  import { NInput, NDatePicker, NButton, NTabPane, NTabs, NCard } from 'naive-ui'
  import SelectItems from './SelectItems.vue'

  const jobs = ref([])
  const skills = ref([])
  const alternativeNames = ref([])
  const alternativeName = ref(null)
  
  const error = ref(null)
  const loading = ref(true)
  
  const jobsStore = useJobsStore()
  const skillsStore = useSkillsStore()
  
  function getSkillsData(url, jobCode) {
    fetch(url + jobCode)
    .then((res) => res.json())
    .then((json) => {
      // data.value.push(json)
      skills.value.push({"title": json.title,
                    "skills" : json.essentialCompetences.map((y) => ({
                              "label": y.description, 
                              "key": y.code
      }))})
      alternativeNames.value.push({"title": json.title,
                    "alternativeNames" : json.alternativeNames.map((y) => ({
                              "label": y.title, 
                              "key": y.code
      }))})
      return Promise.resolve(json.essentialCompetences)
    })
    .then((comps) => {
      // get all job codes with these competences
      Promise.all(comps.map(x => getJobsData('https://api.ovrhd.nl/competenties/search/CP/' + x.code, jobCode)))
    })
    .catch((err) => (error.value = err))

    return { skills, error }
  }

  function getJobsData(url, jobCode) {
    fetch(url)
    .then((res) => res.json())
    .then((json) => {
      jobs.value.push(json.map(x => ({
        "code": x.link.split("/api/")[1],
        "weight": jobsStore.doneJobs.find(o => o.id === jobCode).weight
      })))
    })
    .catch((err) => (error.value = err))
    return { jobs, error }
  }

  function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }


  function isViableJob(jobTitle) {
    for (let i=0; i < jobsStore.viableJobs.length; i++) {
      // console.log("Viablejob: ", this.jobsStore.viableJobs[i].title)
      if (jobsStore.viableJobs[i].title.includes(jobTitle.substring(0,6))) {
        return "Ja"
      }
    }
    for (let i=0; i < jobsStore.nonviableJobs.length; i++) {
      // console.log("Viablejob: ", this.jobsStore.viableJobs[i].title)
      if (jobsStore.nonviableJobs[i].title.includes(jobTitle.substring(0,6))) {
        return "Nee"
      }
    }
    return "Onbekend"
  }

  const sortedData = computed (() => {
    if (!jobsStore.matchJobs) {
      return [];
    }
    const sorted = jobsStore.matchJobs.sort((a, b) => a.count > b.count? -1 : 1);
    sorted.length = 10
    sorted.map((x) => (x.job = jobsStore.allJobs.find((y) => (y.job == x.job))))
    sorted.map((x) => {
      x.job = x.job,
      x.count = x.count,
      x.viable = isViableJob(x.job.title)
    })
    console.log("Sorted: ", sorted)
    return sorted;
  })

  function storeJobs() {
    if (!jobs) {
      return 
    }
    const concats = [].concat(...jobs.value)
    const cset = new Set(concats)
    let arr = [...cset]
    const js = jobsStore.doneJobs.map((x) => x.id)
    for (let i = 0; i < js.length; i++) {
      arr = removeItemOnce(arr, js[i])
    }
    jobsStore.matchJobs.value = arr.map((x) => ({ 
      'job': x, 
      'count': concats.reduce((counter, obj) => obj === x ? counter += 1 : counter, 0),
    }))
    const sorted = jobsStore.matchJobs.value.sort((a, b) => a.count > b.count? -1 : 1);
    sorted.length = 10
    sorted.map((x) => (x.job = jobsStore.allJobs.find((y) => (y.job == x.job))))
    sorted.map((x) => {
      x.job = x.job,
      x.count = x.count,
      x.viable = isViableJob(x.job.title)
    })
    jobsStore.matchJobs.value = sorted
    return
  }

  onMounted(() => {
    jobsStore.doneJobs.map(x => getSkillsData('https://api.ovrhd.nl/competenties/', x.id))
    console.log("JobsStore: ", jobsStore.viableJobs)
    loading.value = false
  })


</script>

<script>

export default {
  methods: {
    updateAlternative(val) {
      this.alternativeName = val
    },
    // removeItemOnce(arr, value) {
    //   var index = arr.indexOf(value);
    //   if (index > -1) {
    //     arr.splice(index, 1);
    //   }
    //   return arr;
    // }
  },
  computed: {
    skillsData() {
      if (!this.skills) {
        return null;
      }
      return this.skills;
    },
    alternativeNamesData() {
      if (!this.alternativeNames) {
        return null;
      }
      return this.alternativeNames;
    },
  }
}
</script>

<template>

  <n-table :bordered="false" :single-line="false">
    <thead>
      <tr>
        <th>Functie</th>
        <th>Alternatieve Naam Code</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="alternative in alternativeNamesData" :key="alternative.title">
        <td><select-items :options="alternative.alternativeNames" :title="alternative.title" @update-value="updateAlternative"></select-items></td>
        <td>{{alternativeName}}</td>
      </tr>
      <tr>
        <td><n-button type="primary" @click="storeJobs">Matchberoeper</n-button></td>
        <td></td>
      </tr>
    </tbody>
  </n-table>

  <n-table :bordered="false" :single-line="false">
    <thead>
      <tr>
        <th>Match</th>
        <th>Aantal overeenkomstige competenties</th>
        <th>Kansrijk?</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="job in jobsStore.matchJobs.value" :key="job.job">
        <td>{{job.job.title}}</td>
        <td>{{job.count}}</td>
        <td>{{job.viable}}</td>
      </tr>
    </tbody>
  </n-table>

</template>