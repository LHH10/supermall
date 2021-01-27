<template>
  <div id="home" class="wrapper">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>

    <scroll class="content" ref="scroll"
            :probe-type="3" @scroll="contentScroll"
            :pull-up-load="true" @pullingUp="loadMore">
      <home-swiper :banners="banners" />
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <TabControl class="tab-control" :titles="['流行','新款','精选']"
                  @tabClick="tabClick"></TabControl>
      <goods-list :goods="showGoods"/>
    </scroll>

<!--    当我们需要监听一个组件的的原生事件时，必须给对应的事件加上.native修饰符，才能进行监听。-->
    <back-top @click.native="backClick" v-show="isShowBackTop"/>

  </div>

</template>

<script>
  import HomeSwiper from "@/views/home/childComps/HomeSwiper";
  import RecommendView from "@/views/home/childComps/RecommendView";
  import FeatureView from "@/views/home/childComps/FeatureView";

  import NavBar from "@/components/common/navbar/NavBar";
  import TabControl from "@/components/content/tabControl/TabControl";
  import GoodsList from "@/components/content/goods/GoodsList";
  import Scroll from '@/components/common/scroll/Scroll'
  import BackTop from "@/components/content/backTop/BackTop";

  import {getHomeMultidata,getHomeGoods} from "@/network/home";

  export default {
    name: "Home",
    components: {
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    data() {
      //保留请求过来的数据，使其不会执行过后就被销毁
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0,list: []},
          'new': {page: 0,list: []},
          'sell': {page: 0,list: []},
        },
        currentType: 'pop',
        isShowBackTop: false
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    created() {
      //1.请求多个数据
      this.getHomeMultidata();

      //2.请求商品数据
      this.getHomeGoods('pop');
      this.getHomeGoods('new');
      this.getHomeGoods('sell');
    },
    methods: {
      //事件监听的方法
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
      },
      //返回顶部
      backClick() {
        this.$refs.scroll.scrollTo(0,0);
      },
      //返回顶部标志的隐藏
      contentScroll(position) {
        // console.log(position);
        this.isShowBackTop = (-position.y) > 1000
      },
      //上拉加载更多
      loadMore() {
        this.getHomeGoods(this.currentType)
        //数据加载后进行刷新，方便better-scroll进行下拉，否则会出现下拉卡顿bug
        this.$refs.scroll.scroll.refresh()
      },
      //网络请求相关的方法
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1;
        getHomeGoods(type,page).then(res =>{
          this.goods[type].list.push(... res.data.list)
          this.goods[type].page +=1

          this.$refs.scroll.finishPullUp()
        })
      }
    }
  }
</script>

<style scoped>
  #home {
    height: 100vh;
    position: relative;
    padding-top: 44px;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: white;
    font-size: 20px;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
  }
  .tab-control {
    position: sticky;
    top: 44px;
    z-index: 9;
  }
  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  /*.content {*/
  /*  height: calc(100% - 93px);*/
  /*  overflow: hidden;*/
  /*  margin-top: 44px;*/
  /*}*/

</style>
