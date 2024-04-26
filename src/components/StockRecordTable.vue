<script setup lang="ts">
import { StockRecordsData } from '@/types/StockData'
const props = defineProps({
  CurrentStock: String,
  Records: Object
})
const emit = defineEmits(['ScrollToPoint'])
const { CurrentStock, Records } = toRefs(props)
const clientHeight = ref<number>(0)
const filterSide = (value: string, row: StockRecordsData) => {
  return row.side === value
}
const filterOrderType = (value: string, row: StockRecordsData) => {
  return row.order_type === value
}
const handleCurrentChange = (val: StockRecordsData | undefined) => {
  //圖表標示選中位置
  emit('ScrollToPoint', val?.datetime)
  console.log(val)
}
onMounted(() => {
  clientHeight.value = (window.innerHeight - 60) * 0.4 < 300 ? 300 : (window.innerHeight - 60) * 0.4
})
</script>
<template>
  <div :style="{ height: clientHeight + 'px' }" class="record-table">
    <el-auto-resizer>
      <template #default="{ height, width }">
        <el-table
          :data="Records as StockRecordsData[]"
          stripe
          :height="height"
          :width="width"
          @row-click="handleCurrentChange"
          highlight-current-row
        >
          <el-table-column prop="datetime" label="datetime" />
          <el-table-column prop="from_position" label="from_position" />
          <el-table-column
            prop="order_type"
            label="order_type"
            width="150"
            :filters="[
              { text: 'Open', value: 'open' },
              { text: 'Close', value: 'close' }
            ]"
            :filter-method="filterOrderType"
          />
          <el-table-column prop="price" label="price" />
          <el-table-column prop="profit" label="profit" sortable />
          <el-table-column prop="return_rate" label="return_rate" />
          <el-table-column
            prop="side"
            label="side"
            :filters="[
              { text: 'Shrot', value: 'short' },
              { text: 'Long', value: 'long' }
            ]"
            :filter-method="filterSide"
          />
          <el-table-column prop="cost" label="cost" />
          <el-table-column prop="size" label="size" />
        </el-table>
      </template>
    </el-auto-resizer>
  </div>
</template>
<style scoped lang="scss">
.record-table :deep(.el-table tr.el-table__row.current-row > td.el-table__cell) {
  background-color: var(--current-row-bg-color);
}
</style>
