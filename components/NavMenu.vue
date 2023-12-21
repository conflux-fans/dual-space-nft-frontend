<template>
  <n-menu :options="menuOptions" :value="routerPath"/>
</template>
<script setup lang="ts">
import { NMenu, NIcon } from "naive-ui";
import type { MenuOption } from 'naive-ui'
import { RouterLink } from 'vue-router'
import FluentIcon from "./FluentIcon.vue";
import MetaMaskIcon from "./MetaMaskIcon.vue";

function renderIcon (icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const route = useRoute()

const routerPath = computed(() => { return route.path.replace("/", '') })

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'mint',
            // params: {
            //   lang: 'zh-CN'
            // }
          }
        },
        { default: () => 'Mint' }
      ),
    key: 'mint',
    icon: renderIcon(FluentIcon)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'manage',
            // params: {
            //   lang: 'zh-CN'
            // }
          }
        },
        { default: () => 'Manage' }
      ),
    key: 'manage',
    icon: renderIcon(MetaMaskIcon)
  },
]
</script>
