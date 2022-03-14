<script setup>
  import {ref, onMounted} from 'vue'
  import { useJobsStore } from '../stores/jobs'
  import { storeToRefs } from 'pinia'

  const data = ref(null)
  const error = ref(null)
  const loading = ref(true)
  
  const store = useJobsStore()
  function getData(url) {
    fetch(url)
    .then((res) => res.json())
    .then((json) => (data.value = json))
    .then(() => (loading.value = false))
    .catch((err) => (error.value = err))
    return { data, error, loading }
  }

  onMounted(() => {
    getData('https://api.ovrhd.nl/competenties/')
  })
</script>

<script>
import JobSelect from './JobSelect.vue'
import MonthSelect from './MonthSelect.vue'
import YearSelect from './YearSelect.vue'

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
    arrayRemove(arr, value) { 
        return arr.filter(function(ele){ 
            return ele != value; 
        });
    },
    appendJob() {
      this.store.jobs.push({
        "id": this.job, 
        "yearStart": this.yearStart, 
        "monthStart": this.monthStart,
        "yearEnd": this.yearEnd, 
        "monthEnd": this.monthEnd,
      })
    },
    removeJob() {
      this.store.jobs = this.arrayRemove(this.store.jobs, this.store.jobs[this.store.jobs.length-1])
    },
    getJobs() {
      console.log(this.store.jobs)
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
      // console.log(this.data)
    }
  },
  data() { 
    return {
      job: "test",
      yearStart: "1990",
      yearEnd: "2000",
      monthStart: "Januari",
      monthEnd: "Januari",
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
      const sortedItems = this.sortedData.filter((job) => (job.title.includes(this.message)));
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
<input v-model="message" placeholder="edit me" />

<p>Jaar start is: {{ yearStart }}</p>
<year-select class="select" :years="years" @update-year-value="updateYearStart"></year-select>
<p>Maand start is: {{ monthStart }}</p>
<month-select class="select" :months="months" @update-month-value="updateMonthStart"></month-select>
<p>Jaar einde: {{ yearEnd }}</p>
<year-select class="select" :years="years" @update-year-value="updateYearEnd"></year-select>
<p>Maand eind is: {{ monthEnd }}</p>
<month-select class="select" :months="months" @update-month-value="updateMonthEnd"></month-select>

<job-select class="select" :jobs="filteredData" @update-job-value="updateJob"></job-select>

<div>Job: {{ job }}</div>

<button @click="appendJob">Voeg toe</button>
<button @click="removeJob">Verwijder</button>
<button @click="getJobs">CV</button>

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
