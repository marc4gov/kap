<script setup>

  import {ref, onMounted} from 'vue'

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
  
  function getSkillsData(url) {
    fetch(url)
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
      // get all job codes with this competence
      Promise.all(comps.map(x => getJobsData('https://api.ovrhd.nl/competenties/search/CP/' + x.code)))
    })
    .catch((err) => (error.value = err))

    return { skills, error }
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
    jobsStore.doneJobs.map(x => getSkillsData('https://api.ovrhd.nl/competenties/' + x.id))
    console.log("JobsStore: ", jobsStore.viableJobs)
    loading.value = false
  })


</script>

<script>

export default {
  methods: {
    isViableJob(jobTitle) {
      for (let i=0; i < this.jobsStore.viableJobs.length; i++) {
        // console.log("Viablejob: ", this.jobsStore.viableJobs[i].title)
        if (this.jobsStore.viableJobs[i].title.includes(jobTitle.substring(0,6))) {
          return true
        }
      }
      return false
    },
    updateAlternative(val) {
      this.alternativeName = val
    },
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
      console.log("Matchjobs: ", this.jobsStore.matchJobs)
      this.jobsStore.matchJobs = arr.map((x) => ({ 
        'job': x, 
        'count': concats.reduce((counter, obj) => obj === x ? counter += 1 : counter, 0),
      }))
      this.jobsStore.matchJobs = this.sortedData
      return
    },
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
    sortedData() {
      if (!this.jobsStore.matchJobs) {
        return [];
      }
      const sortedData = this.jobsStore.matchJobs.sort((a, b) => a.count > b.count? -1 : 1);
      sortedData.length = 10
      sortedData.map((x) => (x.job = this.jobsStore.allJobs.find((y) => (y.job == x.job))))
      sortedData.map((x) => {
        x.job = x.job,
        x.count = x.count,
        x.viable = this.isViableJob(x.job.title)
      })
      console.log("Sorted: ", sortedData)
      return sortedData;
    },
  }
}
</script>

<template>

    <!-- {{skill.title}} -->
        <!-- <SelectItems :options="skill.skills" :title="skill.title"
        v-for="skill in skillsData" :key="skill.title"/> -->

    <SelectItems :options="alternative.alternativeNames" :title="alternative.title"
    v-for="alternative in alternativeNamesData" :key="alternative.title"/>


  <button @click="storeJobs">Matchberoepen</button>


  <n-table :bordered="false" :single-line="false">
    <thead>
      <tr>
        <th>Functie</th>
        <th>Naam</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="alternative in alternativeNamesData" :key="alternative.title">
        <td><select-items :options="alternative.alternativeNames" :title="alternative.title" @update-value="updateAlternative"></select-items></td>
        <td>{{alternativeName}}</td>
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
      <tr v-for="job in jobsStore.matchJobs" :key="job.job">
        <td>{{job.job.title}}</td>
        <td>{{job.count}}</td>
        <td>{{job.viable}}</td>
      </tr>
    </tbody>
  </n-table>

</template>