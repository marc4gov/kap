<script setup>
  import {ref, onMounted} from 'vue'
  import { useJobsStore } from '../stores/jobs'
  import { useFetch } from './helpers/fetch'
  import pdfMake from "pdfmake/build/pdfmake";
  import pdfFonts from "pdfmake/build/vfs_fonts";
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  import { NInput, NDatePicker, NButton, NTabPane, NIcon, NCollapse , NTable, NTh, NTr, NTd} from 'naive-ui'
  import SelectItems from "./SelectItems.vue"
  import { InputFilled } from "@vicons/material";

  const jobsStore = useJobsStore()
  const message = ref("W")
  const job = ref(null)

  onMounted(() => {

  })
</script>

<script>
export default {
  components: {
    InputFilled,
  },
  methods: {
    updateJob(val) {
      this.job = useFetch("https://api.ovrhd.nl/competenties/" + val)
    },
  },
  watch: {
    job() {
      console.log("Data loaded");
      // this.jobsStore.allJobs.find(o => o.title === this.job.data.title).details = this.job
      // console.log(this.job);
    },
  },
  computed: {
    filteredData() {
      if (!this.jobsStore.allJobs) {
        return [];
      }
      const sortedItems = this.sortedData.filter((job) => (job.title.startsWith(this.message.charAt(0).toUpperCase() + this.message.slice(1))));
      return sortedItems.map((x) => ({"label": x.title, "key": x.job}))
    },
    sortedData() {
      if (!this.jobsStore.allJobs) {
        return [];
      }
      const sortedData = this.jobsStore.allJobs.sort((a, b) => a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1);
      return sortedData;
    },
    skills() {
      if (!this.job) {
        return [];
      }
      const comps = this.job.data.essentialCompetences
      return comps;
    },

  },
}

</script>

<template>
  <n-input v-model:value="message" @update:value="message" placeholder="voer eerste letters beroep in" />

  <n-table :bordered="false" :single-line="false">
    <thead>
      <n-tr>
        <n-th>Functie</n-th>
      </n-tr>
    </thead>
    <tbody>
      <tr>
        <td><select-items :options="filteredData" title="Functies" @update-value="updateJob"></select-items></td>
      </tr>
      <tr>
        <td>
          {{job}}
        </td>
      </tr>
    </tbody>
  </n-table>

</template>

