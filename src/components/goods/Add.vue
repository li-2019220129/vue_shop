<template>
  <div class="add">
    <breadcrumb :insertuser="breadobj" />
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps
        :space="200"
        :active="activeIndex * 1"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 添加商品表单 -->
      <el-form
        :model="addForm"
        :rules="addrules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- tag栏标签 -->
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabs"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(item1, index) in item.attr_vals"
                  :key="index"
                  :label="item1"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlytabdata"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadurl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"> </quill-editor>
          </el-tab-pane>
          <el-tab-pane label="完成添加" name="5">
            <el-button type="primary" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="dialogVisible"
      width="50%"
      @close="dialogClose"
    >
      <img :src="previewPath" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from 'common/Breadcrumb.vue'
import _ from 'lodash'
export default {
  name: 'Add',
  data() {
    return {
      //控制图片的关闭和开启的布尔值
      dialogVisible: false,
      //图片的完整路径
      previewPath: '',
      uploadurl: 'http://127.0.0.1:8888/api/private/v1/upload',
      breadobj: {
        name: '首页',
        name1: '商品管理',
        name2: '添加商品'
      },
      //图片上传组件的headers
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      //静态属性参数
      onlytabdata: [],
      //动态参数列表
      manyData: [],
      cateList: [],
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        pics: [],
        //商品的详情
        goods_introduce: '',
        attrs: []
      },
      addrules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //添加商品
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写必要的表单项')
        //执行添加的业务逻辑
        this.manyData.forEach(item => {
          let newObj = {
            attr_id: item.attr_id,
            attr_vals: item.attr_vals.join(',')
          }

          this.addForm.attrs.push(newObj)
        })
       this.onlytabdata.forEach(item => {
          let newObj = {
            attr_id: item.attr_id,
            attr_vals: item.attr_vals
          }

          this.addForm.attrs.push(newObj)
        })
        let from = _.cloneDeep(this.addForm)
        from.goods_cat = from.goods_cat.join(',')
        let {data:res} =await this.$http.post('goods',from)
        if(res.meta.status!==201){
        return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    },
    //图片预览对话框的关闭事件
    dialogClose() {
      this.dialogVisible = false
    },
    //监听图片上传成功事件
    handleSuccess(response) {
      console.log(response)
      const picInfo = { pic: response.data.tmp_path }
      this.addForm.pics.push(picInfo)
    },
    //处理移除图片效果
    handleRemove(object) {
      let num = this.addForm.pics.findIndex(item => {
        return item.pic === object.response.data.temp_path
      })
      this.addForm.pics.splice(num, 1)
      console.log(this.addForm.pics)
    },
    //处理图片预览效果
    handlePreview(file) {
      //点击预览按钮，显示对话框
      this.dialogVisible = true
      this.previewPath = file.response.data.url
      console.log(file)
    },
    async tabClick() {
      // if (this.activeIndex === '1') {
      //   // let { data: res } = await this.$http.get(
      //   //   `categories/${this.cateId}/attributes`,
      //   //   {
      //   //     params: {
      //   //       sel: 'many'
      //   //     }
      //   //   }
      //   // )
      //   // if (res.meta.status !== 200) {
      //   //   return this.$message.error('获取动态列表失败')
      //   // }
      //   // res.data.forEach(item => {
      //   //   item.attr_vals =
      //   //     item.attr_vals.length == 0 ? [] : item.attr_vals.split(',')
      //   // })
      //   // this.manyData = res.data
      // }
      // if (this.activeIndex === '2') {
      //   // let { data: res } = await this.$http.get(
      //   //   `categories/${this.cateId}/attributes`,
      //   //   {
      //   //     params: {
      //   //       sel: 'only'
      //   //     }
      //   //   }
      //   // )
      //   // if (res.meta.status !== 200) {
      //   //   return this.$message.error('获取静态属性失败')
      //   // }
      //   // console.log(res.data)
      //   // this.onlytabdata = res.data
      // }
    },
    beforeTabs(activename, oldActivename) {
      if (oldActivename === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
   async handleChange() {
      if (this.addForm.goods_cat.length < 3) {
        this.addForm.goods_cat = []
      }
      let { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: 'many'
            }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态列表失败')
        }
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length == 0 ? [] : item.attr_vals.split(',')
        })
        this.manyData = res.data
        let { data: opy } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: 'only'
            }
          }
        )
        if (opy.meta.status !== 200) {
          return this.$message.error('获取静态属性失败')
        }
        console.log(opy.data)
        this.onlytabdata = opy.data
    },
    async getCateList() {
      let { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      console.log(res.data)
      this.cateList = res.data
    }

  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  components: {
    Breadcrumb
  },
  created() {
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 9px 0 0 !important;
}
.previewImg {
  width: 100%;
}
</style>
