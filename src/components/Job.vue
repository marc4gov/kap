<script setup>
  import {ref, onMounted} from 'vue'
  import { useJobsStore } from '../stores/jobs'
  import { useFetch } from './helpers/fetch'
  import pdfMake from "pdfmake/build/pdfmake";
  import pdfFonts from "pdfmake/build/vfs_fonts";
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  import { NInput, NDatePicker, NButton, NTabPane, NTabs, NCard } from 'naive-ui'
  import SelectItems from "./SelectItems.vue"

  const props = defineProps({
      jobcode: String, 
  })
  
  const jobsStore = useJobsStore()
  const { data, error } = useFetch('https://api.ovrhd.nl/competenties/' + props.jobcode)

  const skills = ref([])
  let title = ref("")

  function getSkills() {
    if (data) {
      const pos = jobsStore.allJobs.map((e) => (e.job)).indexOf(props.jobcode);
      console.log("Index job: ", pos)
      jobsStore.allJobs[pos].details = data.value
      title.value = jobsStore.allJobs[pos].title
      skills.value = data.value.essentialCompetences.map((x) => ({
        "label": x.description,
        "key": x.code
      }))
      
    }
  }

  onMounted(() => {

  })
</script>


<template>
      <button @click="getSkills">Skills</button>
        <SelectItems :options="skills" :title="title" />
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
