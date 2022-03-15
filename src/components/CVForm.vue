<script setup>
  import {ref, onMounted} from 'vue'
  import { useJobsStore } from '../stores/jobs'
  import { useFetch } from './helpers/fetch'
  import pdfMake from "pdfmake/build/pdfmake";
  import pdfFonts from "pdfmake/build/vfs_fonts";
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  import { NInput, NDatePicker, NButton, NTabPane, NTabs, NCard } from 'naive-ui'

  // const data = ref(null)
  // const error = ref(null)
  const loading = ref(true)
  
  const store = useJobsStore()
  const { data, error } = useFetch('https://api.ovrhd.nl/competenties/')

  function getAlternativeNames(url) {
    let ans = []
    fetch(url)
    .then((res) => res.json())
    .then((json) => (ans = json.alternativeNames))
    .catch((err) => (error.value = err))
    return { ans, error }
  }

  onMounted(() => {
    // getData('https://api.ovrhd.nl/competenties/')

  })
</script>

<script>
import JobSelect from './JobSelect.vue'
import MonthSelect from './MonthSelect.vue'
import YearSelect from './YearSelect.vue'

export default {
  methods: {
    updateJob(val) {
      this.job = val.split('/api/')[1]
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
    arrayRemove(arr, value) { 
        return arr.filter(function(ele){ 
            return ele != value; 
        });
    },
    appendJob() {
      const id = this.job
      const joblink = this.store.allJobs.find((x) => (x.job == id))
      console.log("Joblink: ", joblink)
      this.store.doneJobs.push({
        "id": id, 
        "title": joblink.title,
        "yearStart": this.yearStart, 
        "monthStart": this.monthStart,
        "yearEnd": this.yearEnd, 
        "monthEnd": this.monthEnd,
      })
    },
    removeJob() {
      this.store.doneJobs = this.arrayRemove(this.store.doneJobs, this.store.doneJobs[this.store.doneJobs.length-1])
    },
    getJobs() {
      const body1 = ['Code', 'Functie', 'Start maand', 'Start jaar', 'Einde maand', 'Einde jaar' ]
      const jobsArray = this.store.doneJobs.map((job) => [job.id, job.title, job.monthStart, job.yearStart, job.monthEnd, job.yearEnd])
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
  components: {
    JobSelect,
    MonthSelect,
    YearSelect
  },  
  watch: {
    data() {
      console.log('Data loaded');
      this.data.map((x) => this.store.allJobs.push({'title': x.title, 'job': x.link.split('/api/')[1]}))
      console.log(this.store.allJobs)
    }
  },
  data() { 
    return {
      job: "test",
      yearStart: "1990",
      yearEnd: "2000",
      monthStart: "1",
      monthEnd: "1",
      message: "W",
      months: [
        { title: "Januari", value: 1 },
        { title: "Februari", value: 2 },
        { title: "Maart", value: 3 },
        { title: "April", value: 4 },
        { title: "Mei", value: 5 },
        { title: "Juni", value: 6 },
        { title: "Juli", value: 7 },
        { title: "Augustus", value: 8 },
        { title: "September", value: 9 },
        { title: "Oktober", value: 10 },
        { title: "November", value: 11 },
        { title: "December", value: 12 },
      ],
      years: [...Array(13).keys()].map(x => x + 2010)
    }
  },
  computed: {
    filteredData() {
      if (!this.data) {
        return [];
      } 
      const sortedItems = this.sortedData.filter((job) => (job.title.startsWith(this.message.charAt(0).toUpperCase() + this.message.slice(1))));
      return sortedItems
    },
    sortedData() {
      if (!this.data) {
        return [];
      }
      const sortedData = this.data.sort((a, b) => a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1);
      return sortedData;
    },
  },
}
</script>


<template>
  <n-input v-model:value="message" @update:value="message" placeholder="voer eerste letters beroep in" />

  <n-table :bordered="false" :single-line="false">
    <thead>
      <tr>
        <th>Functie</th>
        <th>Start Maand</th>
        <th>Start Jaar</th>
        <th>Einde Maand</th>
        <th>Einde Jaar</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><job-select class="select" :jobs="filteredData" @update-job-value="updateJob"></job-select></td>
        <td><month-select class="select" :months="months" @update-month-value="updateMonthStart"></month-select></td>
        <td><year-select class="select" :years="years" @update-year-value="updateYearStart"></year-select></td>
        <td><month-select class="select" :months="months" @update-month-value="updateMonthEnd"></month-select></td>
        <td><year-select class="select" :years="years" @update-year-value="updateYearEnd"></year-select></td>
      </tr>
      <tr>
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
      </tr>
    </tbody>
  </n-table>


<n-card title="CV 2.0" content-style="padding: 20;">
      Interactief CV gebaseerd op de CompetentNL standaard

  <n-tabs
    type="line"
    size="medium"
    :tabs-padding="20"
    pane-style="padding: 20px;"
  >
    <n-tab-pane v-for="job in store.doneJobs" :key="job.id" :name="job.title">
      {{job.id}}: {{job.title}} | {{job.monthStart}}-{{job.yearStart}} tot {{job.monthEnd}}-{{job.yearEnd}}
    </n-tab-pane>
  </n-tabs>
  <template #action>
    <n-button strong secondary @click="getJobs">PDF maken</n-button>
  </template>
</n-card>

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
