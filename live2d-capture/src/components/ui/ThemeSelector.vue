<template>
  <div class="theme-selector">
    <el-dropdown trigger="click">
      <el-button type="primary" circle>
        <el-icon><Brush /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="setTheme('light')">极简白</el-dropdown-item>
          <el-dropdown-item @click="setTheme('virtual-purple')">虚拟紫</el-dropdown-item>
          <el-dropdown-item @click="setTheme('tech-blue')">科技蓝</el-dropdown-item>
          <el-dropdown-item divided @click="showColorPicker = true">
            自定义颜色
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-dialog v-model="showColorPicker" title="自定义主题" width="30%">
      <el-color-picker v-model="customColors.primary" show-alpha />
      <el-color-picker v-model="customColors.secondary" show-alpha />
      <el-color-picker v-model="customColors.accent" show-alpha />
      <template #footer>
        <el-button @click="applyCustomColors">应用</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useThemeStore } from '@/stores/themeStore'
import { Brush } from '@element-plus/icons-vue'

const themeStore = useThemeStore()
const showColorPicker = ref(false)
const customColors = reactive({
  primary: '#409EFF',
  secondary: '#67C23A',
  accent: '#E6A23C'
})

const setTheme = (themeName) => {
  themeStore.setTheme(themeName)
}

const applyCustomColors = () => {
  themeStore.setCustomColors({ ...customColors })
  showColorPicker.value = false
}
</script>