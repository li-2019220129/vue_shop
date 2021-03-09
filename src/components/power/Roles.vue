<template>
  <div class="roles">
    <breadcrumb :insertuser="breadobj" />
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row style="margin-bottom:15px">
        <el-col>
          <el-button type="primary" @click="addDialogclick">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <el-table-column align="center" type="expand">
          <template v-slot="scope">
            <el-row
              :class="['vcenter', 'bdbottom', index === 0 ? 'bdtop' : '']"
              v-for="(item1, index) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5"
                ><el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i
              ></el-col>
              <el-col :span="19">
                <el-row
                  :class="['vcenter', i1 === 0 ? '' : 'bdtop']"
                  v-for="(item2, i1) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6"
                    ><el-tag
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      type="success"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i
                  ></el-col>
                  <el-col :span="18">
                    <el-col
                      ><el-tag
                        v-for="item3 in item2.children"
                        :key="item3.id"
                        type="warning"
                        closable
                        @close="removeRightById(scope.row, item3.id)"
                        >{{ item3.authName }}</el-tag
                      >
                    </el-col>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column align="center" type="index" label="#">
        </el-table-column
        ><el-table-column align="center" prop="roleName" label="角色名称">
        </el-table-column>
        <el-table-column align="center" prop="roleDesc" label="角色描述">
        </el-table-column>
        <el-table-column align="center" label="操作" width="300px">
          <template v-slot="scope">
            <!--编辑按钮-->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRole(scope.row.id)"
              >删除</el-button
            >
            <!-- 分配权限按钮 -->
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showsetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
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
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addform.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addform.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="setRightDialog"
      width="50%"
      @close="treeDialogClose"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialog = false">取 消</el-button>
        <el-button type="primary" @click="allotRights"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from 'common/Breadcrumb.vue'
export default {
  name: 'Roles',
  data() {
    return {
      breadobj: {
        name: '首页',
        name1: '权限管理',
        name2: '角色列表'
      },
      defKeys: [],
      roleId:'',
      setRightDialog: false,
      addDialog: false,
      editDialogVisible: false,
      editForm: {},
      rightsList: [],
      rolesList: [],
      addform: {
        roleName: '',
        roleDesc: ''
      },
      addformrules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            tigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '角色名称的长度在2~10个字符串之间',
            tigger: 'blur'
          }
        ],
        roleDesc: [
          {
            required: true,
            message: '请输入角色描述',
            tigger: 'blur'
          },
          {
            min: 2,
            max: 15,
            message: '密码的长度在2~15个字符串之间',
            tigger: 'blur'
          }
        ]
      },
      editRules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            tigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '角色名称的长度在2~10个字符串之间',
            tigger: 'blur'
          }
        ],
        roleDesc: [
          {
            required: true,
            message: '请输入角色描述',
            tigger: 'blur'
          },
          {
            min: 2,
            max: 15,
            message: '密码的长度在2~15个字符串之间',
            tigger: 'blur'
          }
        ]
      },
      treeProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  components: {
    Breadcrumb
  },
  created() {
    this.getRolesList()
  },
  methods: {
    //点击为角色分配权限
  async allotRights(){
      const keys=[
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idstr=keys.join();
      let {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{
        rids:idstr
      })
      console.log(res);
       if (res.meta.status !== 200) {
        return this.$message.error('分配权限数据失败')
      }
      this.$message.success('分配权限数据成功');
      this.setRightDialog=false;
      this.getRolesList();
    },
    //监听分配权限对话框的关闭
    treeDialogClose(){
         this.defKeys=[];
    },
    //通过递归的形式，获取角色下所有三级权限的id,并保存到defKeys数组中
    getLeafKeys(node, arr) {
      if (!node.children) {
        arr.push(node.id)
        return arr
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    async showsetRightDialog(role) {
      this.roleId=role.id;
      //获取所有权限的数据
      let { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      this.rightsList = res.data
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialog = true
    },
    async removeRightById(role, rightId) {
      let resconfirm = await this.$confirm(
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
      if (resconfirm != 'confirm') {
        return this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
      let { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status != 200) {
       return this.$message.error('删除权限失败!')
      }
      role.children = res.data
    },
    async removeRole(id) {
      let confirmres = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
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
        let { data: res } = await this.$http.delete('roles/' + id)
        if (res.meta.status != 200) {
          this.$message.error('删除角色失败!')
        }
        this.$message.success('删除角色成功!')
        this.getRolesList()
      }
    },
    editDialogClose() {
      this.$refs.editRef.resetFields()
    },
    editUserInfo() {
      this.$refs.editRef.validate(async data => {
        if (!data) return
        let { data: res } = await this.$http.put(
          'roles/' + this.editForm.roleId,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc
          }
        )
        console.log(res)
        if (res.meta.status != 200) {
          return this.$message.error('更新用户信息失败')
        }
        //关闭对话框
        this.editDialogVisible = false
        //更新数据列表
        this.getRolesList()
        //提示修改成功
        this.$message.success('更新用户信息成功!')
      })
    },
    async showEditDialog(id) {
      console.log(id)
      let { data: res } = await this.$http.get('roles/' + id)
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
        console.log(this.addform)
        let { data: res } = await this.$http.post('roles', this.addform)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功')
        this.addDialog = false
        this.getRolesList()
      })
    },
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    addDialogclick() {
      this.addDialog = true
    },
    //获取角色列表
    async getRolesList() {
      let { data: res } = await this.$http.get('roles')
      if (res.meta.status != 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
      console.log(this.rolesList)
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
