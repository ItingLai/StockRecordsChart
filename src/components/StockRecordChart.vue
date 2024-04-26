<script setup lang="ts">
const props = defineProps({
  CurrentStock: String,
  PriceLine: Object,
  Records: Object
})
import { createChart } from 'lightweight-charts'
const { CurrentStock, PriceLine, Records } = toRefs(props)
const chartContainer = ref()
const ClientHeight = ref<number>(0)
let Chart //chart Variable
let candlestickSeries, volumeSeries //chart Variable
onMounted(() => {
  //set init chart
  InitChart()
  ClientHeight.value = (window.innerHeight - 60) * 0.6 < 500 ? 500 : (window.innerHeight - 60) * 0.6
})

const InitChart = (): void => {
  let chartOptions = {
    autoSize: true,
    grid: {
      vertLines: {
        visible: false
      },
      horzLines: {
        visible: false
      }
    },
    timeScale: {
      timeVisible: true,
      secondsVisible: false
    }
  }
  Chart = createChart(chartContainer.value, chartOptions)
  // areaSeries = chart.addAreaSeries({
  //   lineColor: '#2962FF',
  //   topColor: '#2962FF',
  //   bottomColor: 'rgba(41, 98, 255, 0.28)'
  // })
  candlestickSeries = Chart.addCandlestickSeries({
    upColor: '#ef5350',
    downColor: '#26a69a',
    borderVisible: false,
    wickUpColor: '#ef5350',
    wickDownColor: '#26a69a'
  })
  volumeSeries = Chart.addHistogramSeries({
    priceFormat: {
      type: 'volume'
    },
    priceScaleId: '' // set as an overlay by setting a blank priceScaleId
  })
  volumeSeries.priceScale().applyOptions({
    // set the positioning of the volume series
    scaleMargins: {
      top: 0.7, // highest point of the series will be 70% away from the top
      bottom: 0
    }
  })
  Chart.applyOptions({
    watermark: {
      visible: true,
      fontSize: 24,
      horzAlign: 'center',
      vertAlign: 'center',
      color: 'rgba(150, 150, 150, 0.5)',
      text: '交易結果'
    }
  })
  Chart.timeScale().fitContent()
  Chart.subscribeCrosshairMove(appendChartText)
  Chart.subscribeClick(appendTooltip)
}

const FilterKlineData = computed(() => {
  if (PriceLine.value.length > 0) {
    let Data = PriceLine.value.map((item) => {
      let time = new Date(item.datetime).getTime() / 1000
      return {
        time: time,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume
      }
    })
    return Data
  } else {
    return []
  }
})
const FilterVolumeData = computed(() => {
  if (PriceLine.value.length > 0) {
    let Data = PriceLine.value.map((item) => {
      let time = new Date(item.datetime).getTime() / 1000
      return {
        time: time,
        value: Number(item.volume),
        color: item.open > item.close ? '#92D2CC' : '#F6A8A6'
      }
    })
    return Data
  } else {
    return []
  }
})
const FilterMarkers = computed(() => {
  if (Records.value.length > 0) {
    let Data = []
    Records.value.map((item) => {
      let time = new Date(item.datetime).getTime() / 1000
      if (item.side === 'long') {
        Data.push({
          time: time,
          position: 'aboveBar',
          color: '#ef5350',
          shape: 'arrowUp',
          text: `buy @ ${FormatNumber(item.price)} @ ${item.order_type}${
            item.order_type === 'close' ? ' @ ' + FormatNumber(item.profit) : ''
          }`
        })
      } else if (item.side === 'short') {
        Data.push({
          time: time,
          position: 'belowBar',
          color: '#26a69a',
          shape: 'arrowDown',
          text: `sell @ ${FormatNumber(item.price)} @ ${item.order_type}${
            item.order_type === 'close' ? ' @ ' + FormatNumber(item.profit) : ''
          }`
        })
      }
    })
    return Data
  } else {
    return []
  }
})
const FormatNumber = (value: number): number => {
  return Math.round(value * 100) / 100
}
const appendChartText = (param = null): void => {
  let container = document.getElementById('Chart')
  document.getElementById('symbolName')?.remove()
  let legend = document.createElement('div')
  legend.id = 'symbolName'
  legend.style.position = 'absolute'
  legend.style.left = '12px'
  legend.style.top = '12px'
  legend.style.zIndex = '1'
  legend.style.fontSize = '20px'
  legend.style.fontFamily = 'sans-serif'
  legend.style.lineHeight = '18px'
  legend.style.fontWeight = '500'
  container.appendChild(legend)
  const validCrosshairPoint = !(
    param === undefined ||
    param?.time === undefined ||
    param?.point.x < 0 ||
    param?.point.y < 0
  )
  const getLastPrice = (series) => {
    const lastIndex = series.data().length - 1
    return series.dataByIndex(lastIndex)
  }
  const formatPrice = (price) => (Math.round(price * 100) / 100).toFixed(2)
  const Currentprice = validCrosshairPoint
    ? param.seriesData.get(candlestickSeries)
    : getLastPrice(candlestickSeries)
  const CurrentVolume = validCrosshairPoint
    ? PriceLine.value[param.logical]
    : PriceLine.value[PriceLine.value.length - 1]
  // time is in the same format that you supplied to the setData method,
  // which in this case is YYYY-MM-DD
  let time =
    Currentprice.time !== undefined ? new Date(Currentprice.time * 1000).toLocaleString() : ''
  let open = Currentprice.open !== undefined ? formatPrice(Currentprice.open) : ''
  let high = Currentprice.high !== undefined ? formatPrice(Currentprice.high) : ''
  let low = Currentprice.low !== undefined ? formatPrice(Currentprice.low) : ''
  let close = Currentprice.close !== undefined ? formatPrice(Currentprice.close) : ''
  let volume = CurrentVolume.volume !== undefined ? CurrentVolume.volume / 1000 : ''
  let color = Currentprice.open > Currentprice.close ? '#26a69a' : '#ef5350'
  legend.innerHTML = `<div style="font-size: 14px">${time} 開=<span style="color:${color};">${open}</span>高=<span style="color:${color};">${high}</span>低=<span style="color:${color};">${low}</span>收=<span style="color:${color};">${close}</span>成交量:<span style="color:${color};">${volume}K</span></div>`
}

// update tooltip
const appendTooltip = (param) => {
  let toolTipWidth = 80
  let toolTipHeight = 80
  let toolTipMargin = 15
  document.getElementById('tooltip')?.remove()
  // Create and style the tooltip html element
  let toolTip = document.createElement('div')
  toolTip.id = 'tooltip'
  toolTip.style.width = '150px'
  toolTip.style.height = '120px'
  toolTip.style.position = 'absolute'
  toolTip.style.display = 'none'
  toolTip.style.padding = '8px'
  toolTip.style.boxSizing = 'border-box'
  toolTip.style.fontSize = '12px'
  toolTip.style.textAlign = 'left'
  toolTip.style.zIndex = '1000'
  toolTip.style.top = '12px'
  toolTip.style.left = '12px'
  toolTip.style.pointerEvents = 'none'
  toolTip.style.border = '1px solid'
  toolTip.style.borderRadius = '2px'
  toolTip.style.fontFamily =
    "-apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif"
  toolTip.style.background = 'white'
  toolTip.style.color = 'black'
  toolTip.style.borderColor = 'rgba( 38, 166, 154, 1)'
  let container = document.getElementById('Chart')
  container.appendChild(toolTip)
  if (
    param.point === undefined ||
    !param.time ||
    param.point.x < 0 ||
    param.point.x > container.clientWidth ||
    param.point.y < 0 ||
    param.point.y > container.clientHeight
  ) {
    toolTip.style.display = 'none'
  } else {
    let item = Records.value.find((item) => new Date(item.datetime).getTime() / 1000 === param.time)
    if (item === undefined) {
      toolTip.style.display = 'none'
      return
    }
    toolTip.style.display = 'block'
    if (item.order_type === 'open') {
      toolTip.style.height = '120px'
      toolTip.innerHTML = `
        <div style="color: ${'black'}">
          日期:${item.datetime}
        </div>
        <div style="font-size: 15px;color: black">
          訂單類型:開單
        </div>
        <div style="font-size: 15px;color: black">
          價格:${Math.round(item.price * 100) / 100}
        </div>
        <div style="font-size: 15px;color: black">
          股數:${item.size}
        </div>
      `
    } else {
      toolTip.style.height = '160px'
      toolTip.innerHTML = `
        <div style="color: ${'black'}">
          日期:${item.datetime}
        </div>
        <div style="font-size: 15px;color: black">
          訂單類型:關單
        </div>
        <div style="font-size: 15px;color: black">
          價格:${Math.round(item.price * 100) / 100}
        </div>
        <div style="font-size: 15px;color: black">
          股數:${item.size}
        </div>
        <div style="font-size: 15px;color: black">
          成本:${(Math.round(item.cost * 100) / 100).toLocaleString()}
        </div>
        <div style="font-size: 15px;color: black">
          收益:${Math.round(item.profit * 100) / 100}
        </div>
        <div style="font-size: 15px;color: black">
          報酬率:${Math.round(item.return_rate * 10000) / 100}%
        </div>
      `
    }
    let y = param.point.y
    let left = param.point.x + toolTipMargin
    if (left > container.clientWidth - toolTipWidth) {
      left = param.point.x - toolTipMargin - toolTipWidth
    }

    let top = y + toolTipMargin
    if (top > container.clientHeight - toolTipHeight) {
      top = y - toolTipHeight - toolTipMargin
    }
    toolTip.style.left = left + 'px'
    toolTip.style.top = top + 'px'
  }
}

const scrollToPoint = (datetime: string): void => {
  let idx = PriceLine.value.findIndex((item) => item.datetime === datetime) as number
  let from, end
  if (idx - 25 < 0) {
    from = 0
  } else {
    from = idx - 25
  }
  if (idx + 25 > PriceLine.value.length) {
    end = PriceLine.value.length
  } else {
    end = idx + 25
  }
  Chart.timeScale().setVisibleRange({
    from: new Date(PriceLine.value[from].datetime).getTime() / 1000,
    to: new Date(PriceLine.value[end].datetime).getTime() / 1000
  })
  Chart.priceScale('right').applyOptions({ autoScale: true })
}

watch(PriceLine, () => {
  if (PriceLine.value.length > 0) {
    Chart.priceScale('right').applyOptions({ autoScale: true })
    candlestickSeries.setData(FilterKlineData.value) //Close Price
    volumeSeries.setData(FilterVolumeData.value)
    Chart.timeScale().setVisibleRange({
      // 1 day = 5hours 10days = 50hours
      from: new Date(PriceLine.value[PriceLine.value.length - 50].datetime).getTime() / 1000,
      to: new Date(PriceLine.value[PriceLine.value.length - 1].datetime).getTime() / 1000
    })
    Chart.applyOptions({
      watermark: {
        visible: true,
        fontSize: 24,
        horzAlign: 'center',
        vertAlign: 'center',
        color: 'rgba(150, 150, 150, 0.5)',
        text: CurrentStock.value
      }
    })
    appendChartText()
  }
})
watch(Records, () => {
  if (Records.value.length > 0) {
    candlestickSeries.setMarkers(FilterMarkers.value)
  }
})
watch(CurrentStock, () => {
  candlestickSeries.setData([]) //remove Close Price
  volumeSeries.setData([]) //remove Volume
  document.getElementById('symbolName')?.remove() //remove symbolName
  if (CurrentStock.value === null) {
    Chart.applyOptions({
      watermark: {
        visible: true,
        fontSize: 24,
        horzAlign: 'center',
        vertAlign: 'center',
        color: 'rgba(150, 150, 150, 0.5)',
        text: '自訂檔案交易結果'
      }
    })
    return
  }
})

// 匯出function
defineExpose({
  scrollToPoint
})
</script>

<template>
  <div>
    <div
      id="Chart"
      ref="chartContainer"
      :style="{ height: ClientHeight + 'px', position: 'relative' }"
    ></div>
  </div>
</template>

<style lang="scss" scoped></style>
