<template>
  <div class="list">
    <breadcrumb :insertuser="breadobj" />
    <el-card>
      <el-row :gutter="20" style="margin-bottom:15px">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="clearquery"
            @input="inputquery"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="queryClick"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage"
            >添加商品</el-button
          ></el-col
        >
      </el-row>
      <el-table :data="goodsList" border script>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" width="95px" label="商品价格(元)">
        </el-table-column>
        <el-table-column prop="goods_weight" width="70px" label="商品重量">
        </el-table-column>
        <el-table-column prop="add_time" width="140px" label="创建时间">
          <template v-slot="scope">
            {{ scope.row.add_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editClick(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row.goods_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
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
        @click="editDialogClose"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editForm.goods_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editForm.goods_number" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editForm.goods_weight" type="number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from 'common/Breadcrumb.vue'
export default {
  name: 'List',
  data() {
    return {
      breadobj: {
        name: '首页',
        name1: '商品管理',
        name2: '商品列表'
      },
      editDialogVisible: false,
      editForm: {},
      editRules: {
        goods_name: [
          {
            required: true,
            message: '请输入商品名称',
            tigger: 'blur'
          }
        ],
        goods_price: [
          {
            required: true,
            message: '请输入商品价格',
            tigger: 'blur',
            type: 'number'
          }
        ],
        goods_number: [
          {
            required: true,
            message: '请输入商品数量',
            tigger: 'blur',
            type: 'number'
          }
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入商品重量',
            tigger: 'blur',
            type:'number'
          }
        ]
      },
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      //商品列表
      goodsList: [],
      //总数据
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    editUserInfo() {
      this.$refs.editRef.validate(async data => {
        if (!data) return
        let { data: res } = await this.$http.put(
          'goods/' + this.editForm.goods_id,this.editForm
        )
        console.log(res)
        if (res.meta.status != 201) {
          return this.$message.error('更新商品信息失败')
        }
        //关闭对话框
        this.editDialogVisible = false
        this.editForm = {}
        //更新数据列表
        this.getGoodsList()
        //提示修改成功
        this.$message.success('更新商品信息成功!')
      })
    },
    //关闭对话框清除验证规则
    editDialogClose() {
      this.$refs.editRef.resetFields()
    },
    //编辑按钮
    async editClick(row) {
      this.editForm = row
      console.log(this.editForm)
      this.editDialogVisible = true
    },
    goAddpage() {
      this.$router.push('/goods/add')
    },
    async removeById(id) {
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
        let { data: res } = await this.$http.delete(`goods/${id}`)
        if (res.meta.status != 200) {
          return this.$message.error('删除商品失败!')
        }
        this.$message.success('删除商品成功!')
        this.getGoodsList()
      }
    },
    inputquery() {
      if (this.queryInfo.query == '') {
        this.queryInfo.pagenum = 1
        this.queryInfo.pagesize = 10
        this.getGoodsList()
      }
    },
    clearquery() {
      this.queryInfo.query = ''
      this.queryInfo.pagenum = 1
      this.queryInfo.pagesize = 10
      this.getGoodsList()
    },
    queryClick() {
      this.queryInfo.pagenum = 1
      this.getGoodsList()
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPagenum) {
      this.queryInfo.pagenum = newPagenum
      this.getGoodsList()
    },
    async getGoodsList() {
      let { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      console.log(res.data)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.goodsList = res.data.goods
      console.log(this.goodsList)
      this.total = res.data.total
    }
  },
  components: {
    Breadcrumb
  }
}
</script>

<style lang="less" scoped>
.abcC {
  width: 100px;
}
</style>
