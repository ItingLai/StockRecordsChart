<script setup lang="ts"></script>
<template>
  <el-container>
    <el-container>
      <el-header><LayoutHeader /></el-header>
      <el-main><slot /></el-main>
    </el-container>
  </el-container>
</template>
<style scope lang="scss">
.el-container {
  position: relative;
}
.el-main {
  width: 100%;
  min-height: calc(100vh - 60px);
  padding-top: 0px;
  background-color: #fff;
}
.el-header {
  height: 60px;
  line-height: 60px;
  background-color: #eee;
  color: #333;
  text-align: center;
  padding: 0;
}
</style>
