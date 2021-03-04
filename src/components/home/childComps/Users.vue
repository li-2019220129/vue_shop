<template>
  <div class="user">
    <breadcrumb :insertuser="breadobj" />
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-table :data="userList" style="width: 100%" script border>
      <el-table-column type="index" label="#"> </el-table-column>
      <el-table-column prop="username" label="姓名"> </el-table-column>
      <el-table-column prop="email" label="邮箱"> </el-table-column>
      <el-table-column prop="mobile" label="电话"> </el-table-column>
      <el-table-column prop="role_name" label="角色"> </el-table-column>
      <el-table-column prop="mg_state" label="状态">
        <template v-slot="scope">
          <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template v-slot="">
          <!--修改按钮-->
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <!-- 删除按钮 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
          <!-- 分配角色按钮 -->
          <el-tooltip
            effect="dark"
            content="分配角色"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
        <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 4, 6]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import Breadcrumb from 'common/Breadcrumb.vue'
export default {
  name: 'Users',
  data() {
    return {
      //获取用户列表的参数对象
      queryInfo: {
        query: '',
        //当前的页数
        pagenum: 1,
        //当前每页显示多少条数据
        pagesize: 2
      },
      userList: [],
      total: 0,
      breadobj: {
        name: '首页',
        name1: '用户管理',
        name2: '用户列表'
      }
    }
  },
  components: {
    Breadcrumb
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取用户列表失败')
      this.userList = res.data.users
      this.total = res.data.total
    },
    //监听pagesize改变事件
    handleSizeChange(newSize){
      console.log(newSize);
      this.queryInfo.pagesize=newSize;
      this.getUserList();
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage){
        this.queryInfo.pagenum=newPage;
      this.getUserList();
    },
   async userStateChange(userinfo){
    const {data:res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`);
      console.log(res);
      if(res.meta.status!==200){
        userinfo.mg_state=!userinfo.mg_state;
        return this.$message.error('更新用户状态失败')
      }
       this.$message.success('更新用户状态成功')
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
</style>
