<template>
  <div>
    <NuxtLayout>
      <n-notification-provider>
        <n-dialog-provider>
          <n-space vertical size="large">
              <n-layout-header>
                <AppNavbar></AppNavbar>
              </n-layout-header>
              <n-layout has-sider>
              <n-layout-sider content-style="padding: 24px;">
                <nav-menu></nav-menu>
              </n-layout-sider>
              <n-layout-content content-style="padding: 24px;">
                <NuxtPage />
              </n-layout-content>
              </n-layout>
              <!-- <n-layout-footer>footer</n-layout-footer> -->
          </n-space>
        </n-dialog-provider>
      </n-notification-provider>
    </NuxtLayout>
  </div>
</template>
<script setup lang="ts">
import {
  NLayout,
  NLayoutContent,
  NLayoutFooter,
  NLayoutSider,
  NLayoutHeader,
  NSpace,
  NNotificationProvider,
  NDialogProvider,
} from "naive-ui";
</script>
<style>
html body {
  height: 100%;
}
</style>
