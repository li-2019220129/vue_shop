<template>
  <el-container>
    <el-aside :width="sidebar" class="anmition">
       <div class="torggle-botton" @click="shrink">
        |||
      </div>
      <el-menu
        background-color="#333744"
        text-color="#fff"
        unique-opened
        :collapse="flag"
        :collapse-transition="false"
        :router= "true"
        :default-active="activePath"
      >
        <el-submenu
          :index="item.id + ''"
          v-for="item in menusList"
          :key="item.id"
        >
          <template slot="title">
            <i :class="icon[item.id]"></i>
            <span>{{ item.authName }}</span>
          </template>
          <el-menu-item
            :index="'/'+subItem.path"
            v-for="subItem in item.children"
            :key="subItem.id"
            @click="saveNave('/'+subItem.path)"
          >
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{ subItem.authName }}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-main>
        <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'HomeSidebar',
  data() {
    return {
      flag: false,
      activePath:''
    }
  },
  props: {
    menusList: {
      type: Array,
      default() {
        return []
      }
    },
    icon: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  created(){
    this.activePath=window.sessionStorage.getItem('activePath')
  },
  methods: {
    shrink() {
      this.flag = !this.flag
    },
    saveNave(activePath){
       window.sessionStorage.setItem('activePath',activePath);
       this.activePath=activePath;
    }
  },
  computed:{
    sidebar(){
      return this.flag ? '64px':'200px';
    }
  }
}
</script>

<style lang="less" scoped>
.el-aside {
  background-color: #333744;
  .el-menu {
    border: 0;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.torggle-botton {
  width: 100%;
  color: #fff;
  font-size: 10px;
  line-height: 24px; 
  letter-spacing: 0.2em;
  text-align: center;
  cursor: pointer;
  background-color: #4a5064;
}
.anmition{
  transition: .6s;
}
</style>
