<script setup lang="ts">
const max_width = ref<number>(400)
onMounted(() => {
  max_width.value = window.innerWidth * 0.5 > 400 ? 400 : window.innerWidth * 0.5
  window.addEventListener('resize', () => {
    max_width.value = window.innerWidth * 0.5 > 400 ? 400 : window.innerWidth * 0.5
  })
})
</script>
<template>
  <div class="author-wrapper">
    <div :style="{ width: max_width + 'px' }">
      <div class="name">作者介紹</div>
      <el-row>
        <el-col :span="12">
          <el-card style="max-width: 300px">
            <img
              src="https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
              style="width: 100%"
            />
            <template #footer>
              <div>黃柏浚</div>
              <p>強化學習程式開發</p>
            </template>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card style="max-width: 300px">
            <img
              src="https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
              style="width: 100%"
            />
            <template #footer>
              <div>賴益廷</div>
              <p>網頁開發、強化學習程式開發</p>
            </template>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card style="max-width: 300px">
            <img
              src="https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
              style="width: 100%"
            />
            <template #footer>
              <div>張楟潁</div>
              <p>強化學習程式開發</p>
            </template>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card style="max-width: 300px">
            <img
              src="https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
              style="width: 100%"
            />
            <template #footer>
              <div>蔡昀真</div>
              <p>強化學習程式開發</p>
            </template>
          </el-card>
        </el-col>
      </el-row>
      <el-link href="https://github.com/ZerolBozi/price_prediction" target="_blank">
        <el-icon size="30">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
            <path
              fill="currentColor"
              d="m249.6 417.088 319.744 43.072 39.168 310.272L845.12 178.88 249.6 417.088zm-129.024 47.168a32 32 0 0 1-7.68-61.44l777.792-311.04a32 32 0 0 1 41.6 41.6l-310.336 775.68a32 32 0 0 1-61.44-7.808L512 516.992l-391.424-52.736z"
            ></path>
          </svg>
        </el-icon>
        專案庫Github連結
      </el-link>
    </div>
  </div>
</template>
<style scoped lang="scss">
.author-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  text-align: center;
  & .name {
    font-size: 24px;
    font-weight: 700;
    color: #333;
  }
  & .el-col {
    padding: 10px;
  }
  & .github-link :deep(.el-link) {
    width: 100%;
  }
}
</style>
