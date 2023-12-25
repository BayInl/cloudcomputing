<script setup lang="ts">
import { ElHeader, ElMain, ElContainer, ElAside, ElFooter } from 'element-plus';
import 'element-plus/dist/index.css'
import Menu from '../menu/Menu.vue'
import { useStore } from 'vuex'
const store = useStore()




</script>
<template>
  <div class="common-layout" style="position: absolute;top: 0;left: 0;right: 0;bottom: 0;">
    <el-container style="height: 100vh;">
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="200px">
            <Menu></Menu>
        </el-aside>
        <el-container>
          <el-main>
            <router-view />
          </el-main>
          <el-footer>Footer</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<style>
.el-header {
    background: #00b0e8;
}

.el-aside {
    background: green;
}

.el-main {
    /*background: red;*/
}

.el-footer {
    /*background: yellow;*/
}
</style>