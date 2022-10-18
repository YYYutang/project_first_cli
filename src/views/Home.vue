<template>
  <div>
    <el-container >
  <el-header class="homeHeader">
      <div class="title" @click="returnHome" style="cursor:pointer" >xx系统</div>
        <div>
         <el-dropdown @command="commandHandler">
      <span class="el-dropdown-link" >
        <!-- {{user.name}} -->
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
       <el-dropdown-item icon="el-icon-circle-plus" command="setting">设置</el-dropdown-item>
       <el-dropdown-item icon="el-icon-circle-plus" command="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
        </div>
      </el-header>
      <el-container style="height: 500px; border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
       <el-row class="tac">
  <el-col>
    <el-menu
    router
      :default-active="$route.path"
      class="el-menu-vertical-demo"
       @select="handleSelect">
    <el-menu-item index="/dataManage">
        <i class="el-icon-menu"></i>
        <span slot="title">数据管理</span>
      </el-menu-item>
      <el-menu-item index="/dataAnalysis">
        <i class="el-icon-picture-outline-round"></i>
        <span slot="title">数据分析与可视化</span>
      </el-menu-item>
      <el-menu-item index="/vanishCom">
        <i class="el-icon-document"></i>
        <span slot="title">缺失值补齐</span>
      </el-menu-item>
      <el-menu-item index="/characteristic">
        <i class="el-icon-s-flag"></i>
        <span slot="title">特征表征</span>
      </el-menu-item>
    </el-menu>
  </el-col>
  </el-row>
      </el-aside>

  <el-main >
        <router-view/>
  </el-main>
</el-container>
      </el-container>
    </div>
</template>

<script>

export default {
name: 'Home',
  data() {
    return {
      user: JSON.parse(window.sessionStorage.getItem('user'))
    }
  },
    computed: {
    // 从 vuex 获取 routes


    },
    methods: {
    // 注销登录
    commandHandler(command) {
      if (command === 'logout') {
        // 弹框提示用户是否要删除
        this.$confirm('此操作将注销登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 注销登录
          console.log("in")
          this.$axios.post('/logout').then(res =>{
	    console.log('请求成功')
	    console.log(res)
	  }).catch(error =>{
	    console.log('请求失败')
	    console.log(error )
	  })
          // 清空用户信息
          window.sessionStorage.removeItem('tokenStr')
          window.sessionStorage.removeItem('user')
          // 路由替换到登录页面
           this.$router.replace('/')
          // 清空菜单信息；在src/utils/menus.js 中初始化菜单信息
          //this.$store.commit('initRoutes', [])
          this.$router.replace('/')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消注销登录'
          });
        });
      }

    },
    returnHome(){
      this.$router.push('/home')
    },

     handleSelect(key,keyPath){
          console.log(key,keyPath)
      }

  },
}
</script>

<style>
*{
   /*解决主页边框问题*/
  margin: 0;
}
.homeHeader{
    background:rgba(29, 110, 216, 0.738);
    display:flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    box-sizing: border-box;
}

.homeHeader .title {
  font-size: 25px;
  /*font-family: 微软雅黑;*/
  font-family: 微软雅黑;
  color: white;
   align-items: center;
}


</style>
