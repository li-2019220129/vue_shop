<template>
  <div class="order">
    <breadcrumb :insertuser="breadobj" />
    <el-card>
      <el-row style="margin-bottom:15px">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表数据 -->
      <el-table :data="orderListdata" border stripe>
        <el-table-column label="#" type="index" align="center">
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号" align="center">
        </el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格"
          width="100px"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="pay_status"
          label="是否付款"
          width="100px"
          align="center"
        >
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          width="100px"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间" align="center">
          <template v-slot="scope">
            {{ scope.row.create_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showBox"
            ></el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location"
              @click="showProgress"
            >
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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
    <!-- 修改地址的对化框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="orderClose"
    >
      <el-form
        :model="orderForm"
        :rules="orderRules"
        ref="orderRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="adress1">
          <el-cascader
            v-model="orderForm.adress1"
            :options="citydata"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="adress2">
          <el-input v-model="orderForm.adress2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 展示物流对话框 -->
    <el-dialog title="物流进度" :visible.sync="ProgressVisible" width="50%">
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in ProgressInfo"
          :key="index"
          :timestamp="activity.tiem"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from 'common/Breadcrumb.vue'
import citydata from './citydata'
import progress from './progress'
export default {
  name: 'Order',
  data() {
    return {
      ProgressInfo: progress,
      ProgressVisible: false,
      citydata,
      addressVisible: false,
      breadobj: {
        name: '首页',
        name1: '订单管理',
        name2: '订单列表'
      },
      orderListdata: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderForm: {
        adress1: [],
        adress2: ''
      },
      orderRules: {
        adress1: [
          {
            required: true,
            message: '请选择省市区/县',
            tigger: 'blur',
            type: 'array'
          }
        ],
        adress2: [
          {
            required: true,
            message: '请填写详细地址',
            tigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.orderList()
  },
  methods: {
    //展示物流对话框
    async showProgress() {
      // let { data: res } = await this.$http.get('/kuaidi/1106975712662')
      // if (res.meta.status !== 200) {
      //   this.$message.error('获取物流信息失败')
      // }
      // console.log(res.data)
      // this.ProgressInfo = res.data
      console.log(this.ProgressInfo)
      this.ProgressVisible = true
    },
    //修改地址对画框关闭事件
    orderClose() {
      this.$refs.orderRef.resetFields()
    },
    //展示修改地址的对话框
    showBox() {
      this.addressVisible = true
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.orderList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.orderList()
    },
    async orderList() {
      let { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('请求订单列表失败')
      }
      this.orderListdata = res.data.goods
      this.total = res.data.total
      console.log(this.orderListdata)
    }
  },
  components: {
    Breadcrumb
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
