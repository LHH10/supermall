<template>
  <div id="home" class="wrapper">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行','新款','精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control"
                 v-show="isTabFixed"></tab-control>

    <scroll class="content" ref="scroll"
            @scroll="contentScroll"
            :probe-type="3"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="['流行','新款','精选']"
                  @tabClick="tabClick"
                  ref="tabControl2"></tab-control>
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

  import {getHomeMultidata,getHomeGoods} from "@/network/home";
  import {itemListenerMixin,backTopMixin} from "@/common/mixin";

  export default {
    name: "Home",
    components: {
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      GoodsList,
      Scroll
    },
    //混入方法
    mixins: [itemListenerMixin,backTopMixin],

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
        isShowBackTop: false,
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY:0
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },

    //activated，deactivated，保存浏览状态
    activated() {
      // console.log(this.saveY);
      this.$refs.scroll.scrollTo(0,this.saveY,0)
      this.$refs.scroll.refresh()
    },
    //保存
    deactivated() {
      this.saveY = this.$refs.scroll.getScrollY()
      // console.log(this.saveY);

      //取消全局事件的监听
      this.$bus.$off('itemImgLoad',this.itemImgListener)
    },

    created() {
      //1.请求多个数据
      this.getHomeMultidata();

      //2.请求商品数据
      this.getHomeGoods('pop');
      this.getHomeGoods('new');
      this.getHomeGoods('sell');

      // //3.监听item中图片加载完成
      // this.$bus.$on('itemImageLoad',() => {
      //   this.$refs.scroll.refresh()
      // })
    },
    mounted() {

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
        //让分栏导航标题与内容保持一致
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;

      },
      //返回顶部标志的隐藏
      contentScroll(position) {
        // console.log(position);
        //1.判断BackTop是否显示
        this.isShowBackTop = (-position.y) > 1000

        //2.决定tabControl是否吸顶（position：fixed）
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      //上拉加载更多
      loadMore() {
        this.getHomeGoods(this.currentType)
        //数据加载后进行刷新，方便better-scroll进行下拉，否则会出现下拉卡顿bug
        this.$refs.scroll.refresh()
      },
      //获取广告栏的状态，方便后面分栏导航的吸顶效果
      swiperImageLoad() {
       this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
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
    /*padding-top: 44px;*/
  }
  .home-nav {
    background-color: var(--color-tint);
    color: white;
    font-size: 20px;

    /*在使用浏览器原生滚动时，为了让导航不跟随一起滚动，如今使用了better-scroll用不上了*/
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }
  .tab-control {
    position: relative;
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
