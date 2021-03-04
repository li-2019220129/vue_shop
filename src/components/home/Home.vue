<template>
  <el-container class="home-container">
    <el-header>
      <div class="header-img">
        <img src="~assets/img/4.jpg" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button></el-header
    >
    <home-sidebar :menusList='menusList' :icon='icon'/>
  </el-container>
</template>

<script>
import HomeSidebar from './childComps/HomeSidebar'
export default {
  name: 'Home',
  data(){
    return {
       menusList:[],
       icon:{
         '125':'iconfont icon-user',
         '103':'iconfont icon-tijikongjian',
         '101':'iconfont icon-shangpin',
         '102':'iconfont icon-danju',
         '145':'iconfont icon-baobiao'
       }
    }
  },
  components:{
    HomeSidebar
  },
  created(){
       this.getMenuList()
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //获取所有的菜单
   async getMenuList(){
      const {data:res} = await this.$http.get('menus');
      if(res.meta.status!=200) return this.$message.error(res.meta.msg);
      this.menusList=res.data
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.header-img img {
  width: 53px;
  height: 53px;
  border-radius: 50%;
  vertical-align: middle;
}
.el-header {
  display: flex;
  justify-content: space-between;
  background-color: #373d41;
  padding-left: 0;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 18px;
      font-size: 20px;
      color: #fff;
      user-select: none;
      font-weight: bold;
    }
  }
}
</style>
