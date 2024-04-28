<script setup lang="ts">
import { StockResultData } from '@/types/StockData'
import CSVToJSON from '@/composables/convert_csv_to_json'
const props = defineProps({
  CurrentStock: String
})
const { CurrentStock } = toRefs(props)
const StockResult = ref<StockResultData | null>(null)
const clientHeight = ref<number>(0)
const isImagePreview = ref<boolean>(false)
onMounted(() => {
  clientHeight.value = (window.innerHeight - 60) * 0.4 < 300 ? 300 : (window.innerHeight - 60) * 0.4
})
watch(CurrentStock, () => {
  if (!CurrentStock.value) {
    StockResult.value = null
    return
  }
  fetch(`datas/${CurrentStock.value}/results.csv`, {
    headers: {
      'Content-Type': 'text/csv;charset=utf-8'
    }
  })
    .then((res) => {
      if (res.ok) {
        return res.text()
      } else {
        throw new Error('resourse not found')
      }
    })
    .then((res) => {
      StockResult.value = CSVToJSON(res)
      StockResult.value = StockResult.value[0]
    })
    .catch(() => {
      ElNotification({
        title: '獲取資料失敗',
        message: '找不到對應資源',
        type: 'error'
      })
    })
})
const ImagePreview = () => {
  isImagePreview.value = !isImagePreview.value
}
const numberFormat = (value: number) => {
  return Number(Number(value).toFixed(2))
}
const FilterStockResult = computed(() => {
  if (!StockResult.value) return
  return {
    ticker: StockResult.value.ticker,
    initial_balance: numberFormat(StockResult.value.initial_balance),
    total_profits: Math.floor(StockResult.value.total_profits),
    total_return_rate: numberFormat(StockResult.value.total_return_rate * 100),
    win_rate: numberFormat(StockResult.value.win_rate * 100),
    total_trading: StockResult.value.total_trading,
    avg_positive: Math.floor(StockResult.value.avg_positive),
    avg_negative: Math.floor(StockResult.value.avg_negative),
    odds: numberFormat(StockResult.value.odds),
    expected_value: numberFormat(StockResult.value.expected_value),
    max_loss: Math.floor(StockResult.value.max_loss),
    mdd: Math.floor(StockResult.value.mdd),
    mdd_percentage: numberFormat(StockResult.value.mdd_percentage),
    mar: numberFormat(StockResult.value.mar),
    sqn: numberFormat(StockResult.value.sqn)
  }
})
const FormatPicList = computed(() => {
  if (!StockResult.value) return
  let ticker = StockResult.value.ticker.replace('趨勢策略(做多)', '')
  let path = `datas/${CurrentStock.value}/chart`
  return [
    `${path}/BiGRU_${ticker}_loss.png`,
    `${path}/BiGRU_${ticker}_predicted_2lines.png`,
    `${path}/BiGRU_${ticker}_predicted_4lines.png`,
    `${path}/DQN_${ticker}.png`,
    `${path}/DQN_${ticker}_mdd_area.png`,
    `${path}/DQN_${ticker}_profits.png`,
    `${path}/DQN_${ticker}_record.png`
  ]
})
</script>
<template>
  <el-row v-if="StockResult">
    <el-col :span="12" class="result-col">
      <p>商品代號</p>
      <span>{{ FilterStockResult.ticker }}</span>
    </el-col>
    <el-col :span="12" class="result-col">
      <p>初始資金</p>
      <span>{{ FilterStockResult.initial_balance.toLocaleString() }}</span>
    </el-col>
    <el-col :span="12" class="result-col">
      <p>總收益</p>
      <span>{{ FilterStockResult.total_profits.toLocaleString() }}</span>
    </el-col>
    <el-col :span="12" class="result-col">
      <p>總報酬率</p>
      <span>{{ FilterStockResult.total_return_rate }}%</span>
    </el-col>
    <el-col :span="12" class="result-col">
      <p>總交易次數</p>
      <span>{{ FilterStockResult.total_trading }}</span>
    </el-col>
    <el-col :span="12" class="result-col">
      <p>勝率</p>
      <span>{{ FilterStockResult.win_rate }}%</span>
    </el-col>
    <el-col :span="12" class="result-col">
      <p>平均正收益</p>
      <span>{{ FilterStockResult.avg_positive.toLocaleString() }}</span>
    </el-col>
    <el-col :span="12" class="result-col">
      <p>平均負收益</p>
      <span>{{ FilterStockResult.avg_negative.toLocaleString() }}</span>
    </el-col>
    <el-col :span="12" class="result-col">
      <p>賠率</p>
      <span>{{ FilterStockResult.odds }}</span>
    </el-col>
    <el-col :span="12" class="result-col">
      <p>期望值</p>
      <span>{{ FilterStockResult.expected_value }}</span>
    </el-col>
    <el-col :span="12" class="result-col">
      <p>最大損失</p>
      <span>{{ FilterStockResult.max_loss.toLocaleString() }}</span>
    </el-col>
    <el-col :span="12" class="result-col">
      <p>最大回撤</p>
      <span>{{ FilterStockResult.mdd.toLocaleString() }}</span>
    </el-col>
    <el-col :span="12" class="result-col">
      <p>最大回撤比率</p>
      <span>{{ FilterStockResult.mdd_percentage }}</span>
    </el-col>
    <el-col :span="12" class="result-col">
      <p>管理資金比率</p>
      <span>{{ FilterStockResult.mar }}</span>
    </el-col>
    <el-col :span="12" class="result-col">
      <p>系統品質數</p>
      <span>{{ FilterStockResult.sqn }}</span>
    </el-col>
    <el-col :span="12" class="result-col">
      <el-button type="primary" @click="ImagePreview" style="margin: 5px 0">
        模型結果圖片
      </el-button>
    </el-col>
    <el-image-viewer @close="ImagePreview" :url-list="FormatPicList" v-if="isImagePreview" />
  </el-row>
</template>
<style scoped lang="scss">
.result-col {
  text-align: center;
  font-size: 12px;
  & > p {
    font-size: 16px;
    font-weight: bold;
    margin: 5px 0;
  }
}
</style>
