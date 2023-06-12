<template>
  <div>
    <n-space vertical size="large">
      <n-layout>
        <n-layout-header position="absolute">header</n-layout-header>
        <n-layout-content embedded content-style="padding: 24px;">
          <NuxtPage />
        </n-layout-content>
        <n-layout-footer>footer</n-layout-footer>
      </n-layout>
    </n-space>
  </div>
</template>
<script setup lang="ts">
import {
  NLayout,
  NLayoutContent,
  NLayoutFooter,
  NLayoutHeader,
  NSpace,
} from "naive-ui";
</script>
<style>
html body {
  height: 100%;
}
</style>
