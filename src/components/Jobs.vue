<script setup>
  import {ref, onMounted} from 'vue'
  import { useJobsStore } from '../stores/jobs'
  import { useFetch } from './helpers/fetch'
  import pdfMake from "pdfmake/build/pdfmake";
  import pdfFonts from "pdfmake/build/vfs_fonts";
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  import { NInput, NDatePicker, NButton, NTabPane, NTabs, NCard } from 'naive-ui'
  import SelectItems from "./SelectItems.vue"

  const jobsStore = useJobsStore()
  const message = ref("T")
  const job = ref("")

  onMounted(() => {

  })
</script>

<script>
export default {
  methods: {
    updateJob(val) {
      console.log("Update Job: ", val)
      this.job = val
    },
    getJob() {
    },
  },
  computed: {
    filteredData() {
      if (!this.jobsStore.allJobs) {
        return [];
      }
      const sortedItems = this.sortedData.filter((job) => (job.title.startsWith(this.message.charAt(0).toUpperCase() + this.message.slice(1))));
      console.log("Sorted Items: ", sortedItems)
      return sortedItems.map((x) => ({"label": x.title, "key": x.job}))
    },
    sortedData() {
      if (!this.jobsStore.allJobs) {
        return [];
      }
      const sortedData = this.jobsStore.allJobs.sort((a, b) => a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1);
      return sortedData;
    },
  },
}

</script>

<template>
  <n-input v-model:value="message" @update:value="message" placeholder="voer eerste letters beroep in" />

  {{ message }}

  <n-table :bordered="false" :single-line="false">
    <thead>
      <tr>
        <th>Functie</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><select-items :options="filteredData" :title="Functies" @update-value="updateJob"></select-items></td>
      </tr>
      <tr>
        <td>{{job}}</td>
      </tr>
      <tr>
        <td><n-button strong secondary type="primary" @click="getJob">Functie Details</n-button></td>
      </tr>
    </tbody>
  </n-table>
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
