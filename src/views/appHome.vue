<script setup lang="ts">
import { VNodeRef } from 'vue'
import { StockDataKey, StockPriceRecordData, StockRecordsData } from '@/types/StockData'
import CSVToJSON from '@/composables/convert_csv_to_json'
import type { UploadProps, UploadInstance, UploadRawFile } from 'element-plus'
const StockPriceRecord = ref<StockPriceRecordData[]>([]) //當前股票交易紀錄
const AllStockCode = ref<StockDataKey<string[]>>({
  tw: [],
  us: [],
  crypto: []
})
const CurrentStock = ref<{ Market: string; StockCode: string }>({
  Market: null,
  StockCode: null
}) //當前股票代號
const PriceRecordsuploadRef = ref<UploadInstance | null>(null)
const StockRecordChatref = ref<VNodeRef | null>(null)
//const Strategy = ref<string>('趨勢策略(做多)')
let loading: any

const openFullScreen = () => {
  loading = ElLoading.service({
    lock: true,
    text: '資料加載中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}
const closeFullScreen = () => {
  loading.close()
}
//取得資料
function ChangeStockCode() {
  //執行順序:first->圖表先載入->表格載入 second->第一個if不執行表格先載入->圖表載入
  //先載入圖表資料後載入表格資料
  openFullScreen()
  fetch(`datas/${CurrentStock.value.StockCode}/trading_records.csv`, {
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
      StockPriceRecord.value = CSVToJSON(res)
    })
    .catch(() => {
      ElNotification({
        title: '獲取資料失敗',
        message: '找不到對應資源',
        type: 'error'
      })
    })
    .finally(() => {
      closeFullScreen()
    })
}
const handleMarketChange = (): void => {
  CurrentStock.value.StockCode = null
  StockPriceRecord.value = []
}
const handleFileUpload: UploadProps['onChange'] = (uploadFile) => {
  if (uploadFile.raw.type !== 'text/csv') {
    ElNotification({
      title: '檔案類型錯誤',
      message: '請上傳csv檔案',
      type: 'error'
    })
    PriceRecordsuploadRef.value.clearFiles()
    return false
  } else {
    CurrentStock.value.StockCode = null
    CurrentStock.value.Market = null
    let fileReader = new FileReader()
    fileReader.onload = (e) => {
      let data = e.target.result
      StockPriceRecord.value = CSVToJSON(data)
    }
    fileReader.readAsText(uploadFile.raw)
  }
}
const handleExceed: UploadProps['onExceed'] = (uploadFile) => {
  PriceRecordsuploadRef.value!.clearFiles()
  const file = uploadFile[0] as UploadRawFile
  PriceRecordsuploadRef.value!.handleStart(file)
}
const ScrollToPoint = (datetime: string) => {
  StockRecordChatref.value?.scrollToPoint(datetime)
}
const FilterPrice = computed(() => {
  if (StockPriceRecord.value.length > 0) {
    return StockPriceRecord.value.map((item) => {
      return {
        datetime: item.datetime,
        open: Number(item.open),
        high: Number(item.high),
        low: Number(item.low),
        close: Number(item.close),
        volume: Number(item.volume)
      }
    })
  } else {
    return []
  }
})
const FilterRecords = computed(() => {
  if (StockPriceRecord.value.length > 0) {
    return StockPriceRecord.value.reduce((acc, cur) => {
      if (cur.order_type !== '') {
        acc.push({
          datetime: cur.datetime,
          order_type: cur.order_type,
          side: cur.side,
          price: Number(cur.open_price),
          cost: Number(cur.cost),
          from_position: cur.from_position,
          profit: Number(cur.profit),
          return_rate: Number(cur.return_rate),
          size: Number(cur.size)
        })
      }
      return acc
    }, [] as StockRecordsData[])
  } else {
    return []
  }
})
onMounted(() => {
  openFullScreen()
  fetch(`datas/stocks.json`)
    .then((res) => res.json())
    .then((res) => {
      AllStockCode.value = res
    })
    .finally(() => {
      closeFullScreen()
    })
})
</script>

<template>
  <el-row class="home-row">
    <el-col :span="24">
      <div v-if="CurrentStock.StockCode" class="stockname">
        {{ CurrentStock.StockCode }}
      </div>
    </el-col>
    <el-col :span="20">
      <StockRecordChart
        ref="StockRecordChatref"
        :CurrentStock="CurrentStock.StockCode"
        :PriceLine="FilterPrice"
        :Records="FilterRecords"
      />
    </el-col>
    <el-col :span="4">
      <div style="display: flex; flex-direction: column">
        <div class="seperate">
          <div style="margin-top: -11px">
            <span class="seperate-text">選擇現有交易紀錄</span>
          </div>
        </div>
        <!-- 策略選擇 -->
        <el-form>
          <el-form-item label="市場類型:">
            <el-select
              v-model="CurrentStock.Market"
              placeholder="市場類型"
              class="select_input"
              @change="handleMarketChange"
            >
              <el-option v-for="(_, idx) in AllStockCode" :key="idx" :label="idx" :value="idx" />
            </el-select>
          </el-form-item>
          <el-form-item label="商品代號:">
            <el-select
              v-model="CurrentStock.StockCode"
              placeholder="商品代號"
              class="select_input"
              @change="ChangeStockCode"
            >
              <el-option
                v-for="name in AllStockCode[CurrentStock.Market]"
                :key="name"
                :label="name"
                :value="name"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="seperate">
          <div style="margin-top: -11px">
            <span class="seperate-text">上傳自訂檔案</span>
          </div>
        </div>
        <el-upload
          ref="PriceRecordsuploadRef"
          class="upload"
          accept="text/csv"
          :auto-upload="false"
          :limit="1"
          :on-exceed="handleExceed"
          :on-change="handleFileUpload"
        >
          <template #trigger>
            <el-button type="primary">交易紀錄/價格走勢</el-button>
          </template>
          <template #tip>
            <div class="el-upload__tip">僅限上傳csv檔案，datetime需排序</div>
          </template>
        </el-upload>
        <div class="seperate">
          <div style="margin-top: -11px">
            <span class="seperate-text">交易結果</span>
          </div>
        </div>
        <StockRecordResult :CurrentStock="CurrentStock.StockCode" />
      </div>
    </el-col>
    <el-col :span="24">
      <StockRecordTable
        :CurrentStock="CurrentStock.StockCode"
        :Records="FilterRecords"
        @ScrollToPoint="ScrollToPoint"
      />
    </el-col>
  </el-row>
  <!-- 多項目比較圖表 -->
</template>

<style lang="scss" scoped>
.home-row {
  margin-top: 20px;
}
.seperate {
  height: 20px;
  margin: 5px 0;
  border-top: 1px solid #333;
  text-align: center;
  & .seperate-text {
    background-color: #fff;
    color: #333;
    font-size: 16px;
    padding: 0 10px;
  }
}
.select_input {
  margin-right: 5px;
}
.upload {
  text-align: center;
}
.stockname {
  font-size: 20px;
  font-weight: 500;
}
</style>
