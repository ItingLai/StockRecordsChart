<script setup lang="ts"></script>
<template>
  <el-menu class="el-menu" mode="horizontal" :ellipsis="false" router>
    <div class="site-name">
      <el-icon :size="50">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
          <path
            fill="#000000"
            d="M904 747H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8M165.7 621.8l39.7 39.5c3.1 3.1 8.2 3.1 11.3 0l234.7-233.9l97.6 97.3a32.11 32.11 0 0 0 45.2 0l264.2-263.2c3.1-3.1 3.1-8.2 0-11.3l-39.7-39.6a8.03 8.03 0 0 0-11.3 0l-235.7 235l-97.7-97.3a32.11 32.11 0 0 0-45.2 0L165.7 610.5a7.94 7.94 0 0 0 0 11.3"
          ></path>
        </svg>
      </el-icon>
      <span class="name">強化學習結合深度學習之交易結果</span>
    </div>
    <div class="flex-grow" />
    <el-menu-item index="/" v-if="$route.path != '/'">交易結果</el-menu-item>
    <el-menu-item index="author" v-if="$route.path == '/'">作者介紹</el-menu-item>
  </el-menu>
</template>
<style scoped lang="scss">
.site-name {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 500;
  color: #333;
  & .name {
    font-weight: 700;
  }
}
.el-menu {
  background-color: transparent;
  & .el-menu-item {
    color: #333;
    font-weight: 700;
  }
}
.el-icon {
  margin: 0 10px;
  color: #686868;
}
.flex-grow {
  flex: 1;
}
</style>
