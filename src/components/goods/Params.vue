<template>
  <div class="params">
    <breadcrumb :insertuser="breadobj" />
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
        show-icon
      ></el-alert>
      <el-row class="elrow">
        <el-col
          ><span>选择商品的分类: </span>
          <el-cascader
            v-model="catevalue"
            :options="cateList"
            :props="catepProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数按钮 -->
          <el-button
            type="primary"
            :disabled="isBtnDisable"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 索引列-->
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDiolag(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性按钮 -->
          <el-button
            type="primary"
            :disabled="isBtnDisable"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 索引列-->
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDiolag(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addClose"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editClose"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from 'common/Breadcrumb.vue'
export default {
  name: 'Params',
  data() {
    return {
      //修改表单数据对象
      editForm: {
        attr_name: ''
      },
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }
        ]
      },
      //控制编辑对话框的显示
      editDialogVisible: false,
      //控制添加对话框的显示
      addDialogVisible: false,
      breadobj: {
        name: '首页',
        name1: '商品管理',
        name2: '参数列表'
      },
      //被激活的y页签名称
      activeName: 'many',
      //   级联选择框双向绑定到的数组
      catevalue: [],
      //商品分类列表
      cateList: [],
      //级联选择框的配置对象
      catepProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      //动态参数数据
      manyTableData: [],
      //静态属性参数
      onlyTableData: [],
      //添加参数的表单数据对象
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async handleClose(index, row) {
      row.attr_vals.splice(index, 1)
      this.saveParams(row)
    },
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    //文本框失去焦点或按下回车触发
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveParams(row)
    },
    async saveParams(row) {
      let { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(',')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败')
      }
      this.$message.success('修改参数项成功！')
    },
    // 根据id删除对应参数项
    async removeParams(attr_id) {
      let confirmres = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
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
        let { data: res } = await this.$http.delete(
          `categories/${this.cateId}/attributes/${attr_id}`
        )
        if (res.meta.status != 200) {
          return this.$message.error('删除参数失败!')
        }
        this.$message.success('删除参数成功!')
        this.handleChange()
      }
    },
    //点击确定按钮后修改参数
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        let { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status != 200) {
          return this.$message.error('修改参数失败')
        }
        this.$message.success('修改参数成功')
        this.handleChange()
        this.editDialogVisible = false
      })
    },
    //编辑对话框的关闭事件
    editClose() {
      //重置表单操作
      this.$refs.editFormRef.resetFields()
      this.editForm = {}
    },
    //点击按钮展示修改的对话框
    async showEditDiolag(attr_id) {
      let { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: {
            attr_sel: this.activeName
          }
        }
      )
      if (res.meta.status != 200) {
        return this.$message.error('修改参数失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    //点击按钮添加参数
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        let { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status != 201) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.addDialogVisible = false
        this.handleChange()
      })
    },
    //监听添加对话框的关闭事件
    addClose() {
      this.$refs.addFormRef.resetFields()
    },
    //Tabs页签点击事件
    handleTabsClick() {
      this.handleChange()
    },
    //级联选择框选中项变化，会触发
    async handleChange() {
      if (this.catevalue.length < 3) {
        this.catevalue = []
        this.manyTableData=[]
        this.onlyTableData=[]
        return
      }
      //根据所选分类的id,和当前所处的面板，获取对应的参数
      let { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      res.data.forEach(element => {
        element.attr_vals = element.attr_vals
          ? element.attr_vals.split(',')
          : []
        element.inputVisible = false
        //文本框输入的内容
        element.inputValue = ''
      })
      console.log(res.data)
      if (res.meta.status != 200) {
        return this.$message.error('获取参数列表失败')
      }
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    async getCateList() {
      let { data: res } = await this.$http.get('categories')
      if (res.meta.status != 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.cateList = res.data
    }
  },
  computed: {
    isBtnDisable() {
      return this.catevalue.length < 3
    },
    cateId() {
      if (this.catevalue.length === 3) {
        return this.catevalue[2]
      }
      return null
    },
    titleText() {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    }
  },
  components: {
    Breadcrumb
  }
}
</script>

<style lang="less" scoped>
.elrow {
  margin: 15px 10px;
}
.el-button {
  margin-bottom: 15px;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
