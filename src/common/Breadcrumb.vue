<template>
  <div class="breadcrumd">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">{{insertuser.name}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{insertuser.name1}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{insertuser.name2}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumb',
  props:{
     insertuser:{
       type:Object,
       default:{}
     }
  }
}
</script>

<style lang="less" scoped></style>
