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
  const skill = ref(null)
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
      Promise.all(comps.map(x => getJobsData('https://api.ovrhd.nl/competenties/search/CP/' + x.code, jobCode, x.code, x.description)))
    })
    .catch((err) => (error.value = err))

    return { skills, error }
  }

  function getJobsData(url, jobCode, skillsCode, skillsDescription) {
    fetch(url)
    .then((res) => res.json())
    .then((json) => {
      jobs.value.push(json.map(x => ({
        "code": x.link.split("/api/")[1],
        "weight": jobsStore.doneJobs.find(o => o.id === jobCode).weight,
        "skillsCode": skillsCode,
        "skillsDescription": skillsDescription
      })))
    })
    .catch((err) => (error.value = err))
    return { jobs, error }
  }

  function isViableJob(jobTitle) {
    for (let i=0; i < jobsStore.viableJobs.length; i++) {
      // console.log("Viablejob: ", this.jobsStore.viableJobs[i].title)
      if (jobsStore.viableJobs[i].title.includes(jobTitle.substring(0,10))) {
        return "Ja"
      }
    }
    for (let i=0; i < jobsStore.nonviableJobs.length; i++) {
      // console.log("Viablejob: ", this.jobsStore.viableJobs[i].title)
      if (jobsStore.nonviableJobs[i].title.includes(jobTitle.substring(0,10))) {
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
    console.log("Jobs: ", jobs.value)

    let concats = [].concat(...jobs.value)
    console.log("Concats before filter: ", concats)

    const js = jobsStore.doneJobs.map((x) => x.id)
    for (let i = 0; i < js.length; i++) {
      concats = concats.filter( el => el.code !== js[i] )
    }

    console.log("Concats: ", concats)
    let codeSet = new Set(concats.map(item => item.code));
    codeSet = [...codeSet]

    jobsStore.matchJobs.value = codeSet.map((x) => {
      const results = concats.filter(el => el.code == x)
      const sks = results.map((x) => ({"key": x.skillsCode, "label": x.skillsDescription}))
      return { 
        'job': x, 
        'count': results.length,
        'weight': results.reduce( ( sum, { weight } ) => sum + weight , 0),
        'skills': sks
      }
    })
    console.log("Match JobsStore: ", jobsStore.matchJobs.value)
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
    loading.value = false
  })


</script>

<script>

export default {
  methods: {
    updateAlternative(val) {
      this.alternativeName = val
    },
    updateSkill(val) {
      this.skill = val
    },
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
        <!-- <th>Alternatieve Naam Code</th> -->
      </tr>
    </thead>
    <tbody>
      <tr v-for="alternative in alternativeNamesData" :key="alternative.title">
        <td><select-items :options="alternative.alternativeNames" :title="alternative.title" @update-value="updateAlternative"></select-items></td>
        <!-- <td>{{alternativeName}}</td> -->
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
        <th>Gewicht</th>
        <th>Kansrijk?</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="job in jobsStore.matchJobs.value" :key="job.job">
        <td>{{job.job.title}}</td>
        <td><select-items :options="job.skills" :title="job.count" @update-value="updateSkill"></select-items></td>
        <td>{{job.weight}}</td>
        <td>{{job.viable}}</td>
      </tr>
    </tbody>
  </n-table>

</template>