<script setup>
  import {ref, onMounted} from 'vue'

  const data = ref(null)
  const error = ref(null)
  const loading = ref(true)

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
    updateYear(val) {
      this.year = val
    },
    updateMonth(val) {
      this.month = val
    },
  },
  components: {
    JobSelect
  },  
  watch: {
    data() {
      console.log('Data loaded');
      console.log(this.data)
    }
  },
  data() { 
    return {
      job: "test",
      year: "1990",
      month: "Januari",
      message: "measage",
      months: [
        { title: "Januari", value: "01" },
        { title: "Februari", value: "02" },
        { title: "Maart", value: "03" },
        { title: "April", value: "04" },
        { title: "Mei", value: "05" },
        { title: "Juni", value: "06" },
        { title: "Juli", value: "07" },
        { title: "Augustus", value: "08" },
        { title: "September", value: "09" },
        { title: "Oktober", value: "10" },
        { title: "November", value: "11" },
        { title: "December", value: "12" },
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
    }
  },
}
</script>


<template>
<input v-model="message" placeholder="edit me" />
<p>Year is: {{ year }}</p>
<p>Month is: {{ month }}</p>

<year-select class="select" :years="years" @update-year-value="updateYear"></year-select>

<month-select class="select" :months="months" @update-month-value="updateMonth"></month-select>

<job-select class="select" :jobs="filteredData" @update-job-value="updateJob"></job-select>

<div>Job: {{ job }}</div>

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
