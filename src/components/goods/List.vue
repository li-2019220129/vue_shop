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
          <el-button type="primary" @click="goAddpage">添加商品</el-button></el-col
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
            <el-button type="primary" icon="el-icon-edit" size="mini"
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
    goAddpage(){
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
