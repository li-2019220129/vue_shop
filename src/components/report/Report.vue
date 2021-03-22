<template>
  <div class="report">
    <breadcrumb :insertuser="breadobj" />
    <el-card>
      <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import Breadcrumb from 'common/Breadcrumb.vue'
import _ from 'lodash'
export default {
  name: 'Report',
  data() {
    return {
      breadobj: {
        name: '首页',
        name1: '数据统计',
        name2: '数据报表'
      },
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {},
  methods: {},
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    let { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error('获取折线图数据失败')
    }
    // 指定图表的配置项和数据
let objRes=_.merge(res.data,this.options)
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(objRes)
  },
  components: {
    Breadcrumb
  }
}
</script>

<style lang="less" scoped></style>
