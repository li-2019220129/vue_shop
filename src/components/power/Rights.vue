<template>
  <div class="rights">
    <breadcrumb :insertuser="breadobj" />
    <el-card>
      <el-table :data="rightsList" style="width: 100%" border stripe>
        <el-table-column align="center" type="index" label="#">
        </el-table-column>
        <el-table-column align="center" prop="authName" label="权限名称">
        </el-table-column>
        <el-table-column align="center" prop="path" label="路径">
        </el-table-column>
        <el-table-column align="center" prop="level" label="权限等级">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level==0">一级</el-tag>
            <el-tag v-else-if="scope.row.level==1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from 'common/Breadcrumb.vue'
export default {
  name: 'Rights',
  data() {
    return {
      breadobj: {
        name: '首页',
        name1: '权限管理',
        name2: '权限列表'
      },
      rightsList: []
    }
  },
  components: {
    Breadcrumb
  },
  created() {
    //获取所有的权限
    this.getRightsList()
  },
  methods: {
    //获取权限列表
    async getRightsList() {
      let { data: res } = await this.$http.get('rights/list')
      if (res.meta.status != 200) {
        this.$message.error('获取用户列表失败')
      }
      this.rightsList = res.data
      console.log(this.rightsList)
    }
  }
}
</script>

<style lang="less" scoped></style>
