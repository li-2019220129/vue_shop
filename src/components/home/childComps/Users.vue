<template>
  <div class="user">
    <breadcrumb :insertuser="breadobj" />
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="cls"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="addDialogclick">添加用户</el-button>
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
          <el-switch
            v-model="scope.row.mg_state"
            @change="userStateChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template v-slot="scope">
          <!--修改按钮-->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditDialog(scope.row.id)"
          ></el-button>
          <!-- 删除按钮 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeUser(scope.row.id)"
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
              @click="setRole(scope.row)"
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
      :total="total"
    >
    </el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialog"
      width="50%"
      @close="addDialogClose"
    >
      <el-form
        :model="addform"
        :rules="addformrules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addform.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addform.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addform.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialog" width="50%" @close="setRoleClose">
      <div>
        <p>当前的用户: {{ setuserinfo.username }}</p>
        <p>当前的角色：{{ setuserinfo.role_name }}</p>
        <p>
          分配新角色：
          <el-select v-model="selectRolesId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from 'common/Breadcrumb.vue'
export default {
  name: 'Users',
  data() {
    var checkemail = (rule, value, callback) => {
      var regemail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (regemail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    var checkmobile = (rule, value, callback) => {
      var regmobile = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
      if (regmobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    return {
      selectRolesId: '',
      //所有角色的数据列表
      rolesList: [],
      //需要被分配角色的用户信息
      setuserinfo: '',
      //控制分配角色对话框的显示和隐藏
      setRoleDialog: false,
      editForm: {},
      //控制修改用户的对话框的显示和隐藏
      editDialogVisible: false,
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
      },
      //控制添加用户的对话框的显示和隐藏
      addDialog: false,
      //添加用户的表单数据
      addform: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //添加用户表单验证规则
      addformrules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            tigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符串之间',
            tigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            tigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '密码的长度在3~10个字符串之间',
            tigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱名',
            tigger: 'blur'
          },
          { validator: checkemail, trigger: 'blur' }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            tigger: 'blur'
          },
          { validator: checkmobile, trigger: 'blur' }
        ]
      },
      editRules: {
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            tigger: 'blur'
          },
          { validator: checkmobile, trigger: 'blur' }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱名',
            tigger: 'blur'
          },
          { validator: checkemail, trigger: 'blur' }
        ]
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
    //监听分配角色对话框关闭
    setRoleClose(){
       this.setuserinfo={}
       this.selectRolesId=''
    },
    //点击按钮分配角色
    async saveRoleInfo() {
      if (!this.selectRolesId) {
        return this.$message.error('请选择要分配的角色')
      }
      let { data: res } = await this.$http.put(
        `users/${this.setuserinfo.id}/role`,
        {
          rid: this.selectRolesId
        }
      )
      if (res.meta.status != 200) {
        return this.$message.error('更新角色失败')
      }
       this.$message.success('更新角色成功')
       this.getUserList()
       this.setRoleDialog=false
    },
    //展示分配角色对话框
    async setRole(setuserinfo) {
      this.setuserinfo = setuserinfo
      //在展示对话框之前，获取角色列表
      let { data: res } = await this.$http.get('roles')
      if (res.meta.status != 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
      this.setRoleDialog = true
    },
    //根据id删除用户信息
    async removeUser(id) {
      let confirmres = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => {
        return err
      })
      if (confirmres != 'confirm') {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      } else {
        let { data: res } = await this.$http.delete('users/' + id)
        if (res.meta.status != 200) {
          this.$message.error('删除用户失败!')
        }
        this.$message.success('删除用户成功!')
        this.getUserList()
      }
    },
    //修改用户信息并提交
    editUserInfo() {
      this.$refs.editRef.validate(async data => {
        if (!data) return
        let { data: res } = await this.$http.put('users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.status != 200) {
          return this.$message.error('更新用户信息失败')
        }
        //关闭对话框
        this.editDialogVisible = false
        //更新数据列表
        this.getUserList()
        //提示修改成功
        this.$message.success('更新用户信息成功!')
      })
    },
    //监听修改用户对话框的关闭事件
    editDialogClose() {
      this.$refs.editRef.resetFields()
    },
    async showEditDialog(id) {
      let { data: res } = await this.$http.get('users/' + id)
      console.log(res)
      if (res.meta.status != 200) {
        this.$message.error('查询用户失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    addUser() {
      this.$refs.addFormRef.validate(async data => {
        if (!data) return
        let { data: res } = await this.$http.post('users', this.addform)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.addDialog = false
        this.getUserList()
      })
    },
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    addDialogclick() {
      this.addDialog = true
    },
    getUser() {
      this.queryInfo.pagenum = 1
      this.getUserList()
    },
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status !== 200)
        return this.$message.error('获取用户列表失败')
      this.userList = res.data.users
      this.total = res.data.total
    },
    //监听pagesize改变事件
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async userStateChange(userinfo) {
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      console.log(res)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    cls() {
      this.getUserList()
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
