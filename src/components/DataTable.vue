<script lang="ts">
import { h, defineComponent } from 'vue'
import { NButton, useMessage, DataTableColumns } from 'naive-ui'

type WishJob = {
  job: string
  title: string
  count: string
}

const createColumns = ({
  play
}: {
  play: (row: WishJob) => void
}): DataTableColumns<WishJob> => {
  return [
    {
      title: 'Code',
      key: 'code'
    },
    {
      title: 'Titel',
      key: 'title'
    },
    {
      title: 'Aantal overlappende competenties',
      key: 'count'
    },
    {
      title: 'Action',
      key: 'actions',
      render (row) {
        return h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            onClick: () => play(row)
          },
          { default: () => 'Play' }
        )
      }
    }
  ]
}

const data: WishJob[] = []

export default defineComponent({
  setup () {
    const message = useMessage()
    return {
      data,
      columns: createColumns({
        play (row: WishJob) {
          message.info(`Play ${row.title}`)
        }
      }),
      pagination: false as const
    }
  }
})
</script>

<template>
  <n-data-table
    :columns="columns"
    :data="data"
    :pagination="pagination"
    :bordered="false"
  />
</template>
