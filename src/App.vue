<script setup lang="ts">
import appLayout from './layouts/appLayout.vue'
</script>
<template>
  <appLayout>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" v-if="$route.meta?.keepAlive" />
      </keep-alive>
      <component :is="Component" v-if="!$route.meta?.keepAlive" />
    </router-view>
  </appLayout>
</template>
<style scope lang="scss"></style>
