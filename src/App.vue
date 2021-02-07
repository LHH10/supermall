<template>
  <div id="app">
<!--    keep-alive,不消毁页面-->
    <keep-alive exclude="Detail">
      <router-view/>
    </keep-alive>

    <main-tab-bar/>
    <icon></icon>
    <svg-icon></svg-icon>
  </div>
</template>

<script>
import MainTabBar from 'components/content/mainTabbar/MainTabBar'
import Icon from "@/components/content/Icon/Icon";
import SvgIcon from "@/components/content/Icon/Svg";


export default {
  name: 'App',
  components: {
    MainTabBar,
    Icon,
    SvgIcon
  }
}
</script>

<style>
  @import "assets/css/base.css";
  #app {
    position: relative;
  }
</style>
