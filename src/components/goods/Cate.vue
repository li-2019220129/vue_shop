<template>
  <div class="cate">
    <breadcrumb :insertuser="breadobj" />
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="cateDialogClick">
            添加分类
          </el-button>
        </el-col>
      </el-row>
      <!-- 分页区域 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
        class="tree"
      >
        <template v-slot:isok="scope">
          <i
            class="el-icon-success"
            style="color:lightgreen"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-error" style="color:red" v-else></i>
        </template>
        <!-- 排序 -->
        <template v-slot:order="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level == 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template v-slot:opt="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="setCatename(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deleteCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="cateVisible"
      width="50%"
      @close="parentCateclose"
    >
      <!-- 添加分类表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- option用来指定数据源 -->
          <el-cascader
            v-model="selectKeys"
            :options="parentCateList"
            :props="cascader"
            @change="parentChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cateVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="setcateVisible"
      width="50%"
      @close="setCateclose"
    >
      <!-- 添加分类表单 -->
      <el-form
        :model="setaddCateForm"
        :rules="setaddCateFormRules"
        ref="setaddCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称发：" prop="cat_name">
          <el-input v-model="setaddCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setcateVisible = false">取 消</el-button>
        <el-button type="primary" @click="setaddCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from 'common/Breadcrumb.vue'
export default {
  name: 'Cate',
  data() {
    return {
      //验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      setcateVisible: false,
      setaddCateForm: {},
      setaddCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      //添加分类表单数据对象
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      //添加分类控制对话框的显示和隐藏
      cateVisible: false,
      breadobj: {
        name: '首页',
        name1: '商品管理',
        name2: '商品分类'
      },
      //为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          //表示将当前列定义为模板列
          type: 'template',
          //表示当前这一列使用的模板名称
          template: 'isok'
        },
        {
          label: '排序',
          //表示将当前列定义为模板列
          type: 'template',
          //表示当前这一列使用的模板名称
          template: 'order'
        },
        {
          label: '操作',
          //表示将当前列定义为模板列
          type: 'template',
          //表示当前这一列使用的模板名称
          template: 'opt'
        }
      ],
      cascader: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      //选中父级分类的ID数组
      selectKeys: [],
      //商品分类数据列表
      cateList: [],
      parentCateList: [],
      total: 0,
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      }
    }
  },
  components: {
    Breadcrumb
  },
  created() {
    //获取商品分类数据
    this.getCateList()
  },
  methods: {
    //删除分类
   async deleteCate(id){
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
        let { data: res } = await this.$http.delete('categories/' + id)
        if (res.meta.status != 200) {
         return this.$message.error('删除分类失败!')
        }
        this.$message.success('删除分类成功!')
        console.log(this.querInfo.pagenum)
        this.getCateList()
      }
    },
    setCateclose() {
      this.$refs.setaddCateFormRef.resetFields()
      this.setaddCateForm = {}
    },
    setaddCate() {
      this.$refs.setaddCateFormRef.validate(async valid => {
        let { data: res } = await this.$http.put('categories/' + this.setId, {
          cat_name: this.setaddCateForm.cat_name
        })
        if (res.meta.status != 200) {
          return this.$message.error('更新失败')
        }
        this.$message.success('更新成功')
        this.setcateVisible = false
        this.getCateList()
      })
    },
    async setCatename(id) {
      let { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status != 200) {
        return this.$message.error('编辑分类失败')
      }
      this.setaddCateForm = res.data
      this.setId = this.setaddCateForm.cat_id
      this.setcateVisible = true
    },
    //关闭分类对话框事件
    parentCateclose() {
      this.$refs.addCateFormRef.resetFields()
      this.selectKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    //点击按钮添加分类
    addCate() {
      console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        let { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status != 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCateList()
        this.cateVisible = false
      })
    },
    //选择项发生变化
    parentChange() {
      console.log(this.selectKeys)
      if (this.selectKeys.length > 0) {
        //父级分类的id
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        //为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectKeys.length
        return
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    //获取父级分类数据列表
    async getParentCate() {
      let { data: res } = await this.$http.get('categories', {
        params: {
          type: 2
        }
      })
      if (res.meta.status != 200) {
        this.$message.error('获取分类数据列表数据失败')
      }
      this.parentCateList = res.data
    },
    cateDialogClick() {
      this.cateVisible = true
      this.getParentCate()
    },
    // 每页条数改变时触发
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    //当前页改变时触发
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage
      this.getCateList()
    },
    async getCateList() {
      console.log(this.querInfo.pagenum)
      let { data: res } = await this.$http.get('categories', {
        params: this.querInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败')
      }
      //把数据列表数据赋值给cateList
      this.cateList = res.data.result
      this.total = res.data.total
    }
  }
}
</script>

<style lang="less" scoped>
.el-button {
  margin-bottom: 15px;
}
.tree {
  margin-bottom: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
