<script setup>
  import {ref, onMounted} from 'vue'
  import { useJobsStore } from '../stores/jobs'
  import { useFetch } from './helpers/fetch'
  import pdfMake from "pdfmake/build/pdfmake";
  import pdfFonts from "pdfmake/build/vfs_fonts";
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  import { NInput, NDatePicker, NButton, NTabPane, NTabs, NCard } from 'naive-ui'


  const props = defineProps({
      jobcode: String, 
  })
  
  const jobsStore = useJobsStore()

  onMounted(() => {

  })
</script>


<template>

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
