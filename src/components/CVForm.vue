<script setup>
  import {ref, onMounted} from 'vue'
  import { useJobsStore } from '../stores/jobs'
  import { useFetch } from './helpers/fetch'
  import pdfMake from "pdfmake/build/pdfmake";
  import pdfFonts from "pdfmake/build/vfs_fonts";
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  import { NInput, NDatePicker, NButton, NTabPane, NTabs, NCard, NPopover } from 'naive-ui'
  import SelectItems from "./SelectItems.vue"
  import VIABLE from '../assets/Kansrijk-Kansrijk.json'
  import NONVIABLE from '../assets/Kansarm-Kansarm.json'

  // const data = ref(null)
  // const error = ref(null)
  const loading = ref(true)
  const message = ref("T")

  const jobsStore = useJobsStore()
  const nonviableJobs = NONVIABLE
  const viableJobs = VIABLE
  const alternativeNames = []
  
  const { data, error } = useFetch('https://api.ovrhd.nl/competenties/')

  onMounted(() => {
    viableJobs.map((x) => jobsStore.viableJobs.push({'title': x.Titel, 'job': null, "details": null}))
    nonviableJobs.map((x) => jobsStore.nonviableJobs.push({'title': x.Titel, 'job': null, "details": null}))
    console.log("Viable: ", jobsStore.viableJobs)
  })
</script>

<script>

export default {
  methods: {
    updateJob(val) {
      this.job = val
    },
    updateYearStart(val) {
      this.yearStart = val
    },
    updateYearEnd(val) {
      this.yearEnd = val
    },
    updateMonthStart(val) {
      this.monthStart = val
    },
    updateMonthEnd(val) {
      this.monthEnd = val
    },
    arrayRemove(arr, key) { 
        return arr.filter(function(ele){ 
            return ele != key; 
        });
    },
    appendJob() {
      const id = this.job
      const joblink = this.jobsStore.allJobs.find((x) => (x.job == id))
      // console.log("Joblink: ", joblink)
      this.jobsStore.doneJobs.push({
        "id": id, 
        "title": joblink.title,
        "yearStart": this.yearStart, 
        "monthStart": this.monthStart,
        "yearEnd": this.yearEnd, 
        "monthEnd": this.monthEnd,
      })
    },
    removeJob() {
      this.jobsStore.doneJobs = this.arrayRemove(this.jobsStore.doneJobs, this.jobsStore.doneJobs[this.jobsStore.doneJobs.length-1])
    },
    getJobs() {
      const body1 = ['Code', 'Functie', 'Start maand', 'Start jaar', 'Einde maand', 'Einde jaar' ]
      const jobsArray = this.jobsStore.doneJobs.map((job) => [job.id, job.title, job.monthStart, job.yearStart, job.monthEnd, job.yearEnd])
      jobsArray.unshift(body1)
      const docDefinition = {
        header: {text: 'CV 2.0: Interactief CV gebaseerd op de CompetentNL standaard', margin: [ 20, 20, 10, 20 ]},
        footer: {
          columns: [
            ' Genereerd op ' + (new Date()).toLocaleDateString('nl-NL'),
            { text: 'Gemeente Leeuwarden  ', alignment: 'right' }
          ],
          margin: [ 20, 20, 10, 20 ] 
        },
        content: [
          {
            layout: 'lightHorizontalLines', // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: [ 'auto', 'auto', 'auto', 'auto', 'auto', 'auto' ],
              body: jobsArray
            },
            margin: [ 0, 20, 10, 20 ] 
          },
          { qr: 'text in QR', foreground: 'darkgreen', background: 'white' },
        ]
      };
      pdfMake.createPdf(docDefinition).open();

    }
  },
  watch: {
    data() {
      console.log('Data loaded');
      this.jobsStore.allJobs = []
      this.data.map((x) => this.jobsStore.allJobs.push({'title': x.title, 'job': x.link.split('/api/')[1], "details": null}))
      console.log(this.jobsStore.allJobs)
    },
  },
  data() { 
    return {
      job: "test",
      yearStart: "1990",
      yearEnd: "2000",
      monthStart: "1",
      monthEnd: "1",
      months: [
        { label: "Januari", key: 1 },
        { label: "Februari", key: 2 },
        { label: "Maart", key: 3 },
        { label: "April", key: 4 },
        { label: "Mei", key: 5 },
        { label: "Juni", key: 6 },
        { label: "Juli", key: 7 },
        { label: "Augustus", key: 8 },
        { label: "September", key: 9 },
        { label: "Oktober", key: 10 },
        { label: "November", key: 11 },
        { label: "December", key: 12 },
      ],
      years: [...Array(13).keys()].map((x )=> ({label: x + 2010, key: x + 2010}))
    }
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
  },
}
</script>


<template>

  <!-- <n-popover trigger="hover">
    <template #trigger>
      <n-input v-model:key="message" @update:key="message" />
    </template>
    <span>voer de eerste letter van de functie in</span>
  </n-popover> -->
    


  <n-table :bordered="false" :single-line="false">
    <thead>
      <tr>
        <th><n-input v-model:value="message" @update:value="message" placeholder="voer eerste letters beroep in" /></th>
        <th><select-items :options="filteredData" title="Functies" @update-value="updateJob"></select-items></th>
        <th><select-items :options="months" title="Start Maand" @update-value="updateMonthStart"></select-items></th>
        <th><select-items :options="years" title="Start Jaar" @update-value="updateYearStart"></select-items></th>
        <th><select-items :options="months" title="Einde Maand" @update-value="updateMonthEnd"></select-items></th>
        <th><select-items :options="years" title="Einde Jaar" @update-value="updateYearEnd"></select-items></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{{ message }}</td>
        <td>{{ job }}</td>
        <td>{{ monthStart }}</td>
        <td>{{ yearStart }}</td>
        <td>{{ monthEnd }}</td>
        <td>{{ yearEnd }}</td>
      </tr>
      <tr>
        <td><n-button strong secondary type="primary" @click="appendJob">Voeg toe</n-button></td>
        <td><n-button strong type="secondary" @click="removeJob">Verwijder</n-button></td>
        <td><n-button strong type= "tertiary" @click="getJobs">CV</n-button></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    </tbody>
  </n-table>


<n-card label="CV 2.0" content-style="padding: 20;">
      Interactief CV gebaseerd op de CompetentNL standaard

  <n-tabs
    type="line"
    size="medium"
    :tabs-padding="20"
    pane-style="padding: 20px;"
  >
    <n-tab-pane v-for="job in jobsStore.doneJobs" :key="job.id" :name="job.title">
      {{job.id}}: {{job.title}} | {{job.monthStart}}-{{job.yearStart}} tot {{job.monthEnd}}-{{job.yearEnd}}
    </n-tab-pane>
  </n-tabs>
  <template #action>
    <n-button strong secondary @click="getJobs">PDF maken</n-button>
  </template>
</n-card>

</template>
