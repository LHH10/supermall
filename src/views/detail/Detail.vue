<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick"ref="nav"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>

    <detail-bottom-bar @addCart="addToCart"/>

    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  import DetailNavBar from "@/views/detail/childComps/DetailNavBar";
  import DetailSwiper from "@/views/detail/childComps/DetailSwiper";
  import DetailBaseInfo from "@/views/detail/childComps/DetailBaseInfo";
  import DetailShopInfo from "@/views/detail/childComps/DetailShopInfo";
  import DetailGoodsInfo from "@/views/detail/childComps/DetailGoodsInfo";
  import DetailParamInfo from "@/views/detail/childComps/DetailParamInfo";
  import DetailCommentInfo from "@/views/detail/childComps/DetailCommentInfo";
  import DetailBottomBar from "@/views/detail/childComps/DetailBottomBar";

  import Scroll from '@/components/common/scroll/Scroll'
  import GoodsList from "@/components/content/goods/GoodsList";

  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "@/network/detail";
  import {debounce} from "@/common/utils";
  import {backTopMixin, itemListenerMixin} from "@/common/mixin";


  export default {
      name: "Detail",
      data() {
          return {
            iid:null,
            topImages:[],
            goods: {},
            shop: {},
            detailInfo: {},
            paramInfo: {},
            commentInfo: {},
            recommends: [],
            themeTopYs: [],
            getThemeTopY: null,
            currentIndex: 0,

          }
      },
      components: {
        DetailNavBar,
        DetailSwiper,
        DetailBaseInfo,
        DetailShopInfo,
        DetailGoodsInfo,
        DetailParamInfo,
        DetailCommentInfo,
        DetailBottomBar,

        GoodsList,
        Scroll
      },
    //混入方法
      mixins: [itemListenerMixin,backTopMixin],

      created() {
        // 1.保存传入的iid
        this.iid = this.$route.params.iid

        // 2.根据iid请求详情数据
        getDetail(this.iid).then(res =>{
          // console.log(res);
          const data = res.result;
          //1.获取顶部的图片轮播数据
          this.topImages = data.itemInfo.topImages

          // 2.获取商品信息
          this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)

          //3.创建店铺信息的对象
          this.shop = new Shop(data.shopInfo)

          //4.保存商品的详情数据
          this.detailInfo = data.detailInfo;

          //5.获取参数信息
          this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)

          //6.取出评论信息
          if(data.rate.cRate !== 0) {
            this.commentInfo = data.rate.list[0]
          }

          //1.第一方法获取offsetTop，值不对
          //原因：this.$refs.params.$el压根没有渲染
          // this.themeTopYs = []
          //
          // this.themeTopYs.push(0);
          // this.themeTopYs.push(this.$refs.params.$el.offsetTop)
          // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
          // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)

          // this.$nextTick(() => {
            //第二方法获取，值依然不对
            //原因：图片没有计算在内
            //根据最新的数据，对应的DOM是已经被渲染出来
            //但是图片是没有加载完的
            //offsetTop值不对的时候，都是因为图片的问题
          //   this.themeTopYs = []
          //
          //   this.themeTopYs.push(0);
          //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
          //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
          //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
          //
          // })

        })

        //3.请求推荐数据
        getRecommend().then(res => {
          this.recommends = res.data.list
        })

        //4.给getThemeTopY赋值（对给this.themeTopYs赋值的操作进行防抖）
        //这是第三种方式取offsetTop值，使用回调的方式避免多次调用
        this.getThemeTopY = debounce(() => {
          this.themeTopYs = []

          //初始值为0
          this.themeTopYs.push(0);
          this.themeTopYs.push(this.$refs.params.$el.offsetTop)
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
          //给它一个最大值
          this.themeTopYs.push(Number.MAX_VALUE)
          // console.log(this.themeTopYs);
        },200)
      },

      methods: {
        imageLoad() {
          this.newRefresh()
          // this.$refs.scroll.refresh()
          this.getThemeTopY()
        },
        titleClick(index) {
          // console.log(index);
          this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200)
        },
        contentScroll(position) {
          // console.log(position);
          //1.获取y值
          const positionY = -position.y

          //2.positionY和主题中值进行对比
          //比如：positionY在0和7938之间，index=0
          let length = this.themeTopYs.length
          for(let i = 0;i < length-1;i++) {
            //优化过后的判断条件，在上方取值时给它一个最大值，则可以少判断一个条件
            if (this.currentIndex !== i &&(i < length-1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
              this.currentIndex = i
              //   // console.log(this.currentIndex);
              this.$refs.nav.currentIndex = this.currentIndex;
            }



            //if判断条件过长，有点冗余，还可以优化
            // if (this.currentIndex !== i && (i < length-1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])
            // || (i === length-1 && positionY >= this.themeTopYs[i])) {
            //   this.currentIndex = i
            //   // console.log(this.currentIndex);
            //   this.$refs.nav.currentIndex = this.currentIndex;
            // }
          }

          //3.判断BackTop是否显示
          this.isShowBackTop = (-position.y) > 1000
        },
        addToCart() {
          //1.获取购物车需要展示的信息
          const product = {}
          product.image = this.topImages[0];
          product.title = this.goods.title;
          product.desc = this.goods.desc;
          product.price = this.goods.nowPrice;
          product.iid = this.iid;

          // 2.将商品添加到购物车里面
          // this.$store.commit('addCart',product)
          this.$store.dispatch('addCart',product).then(res => {
            this.$toast.show(res)
          })
        }
      },

    deactivated() {
      this.$bus.$off('itemImgLoad',this.itemImgListener)
    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }
  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
  /*.content {*/
  /*  position: absolute;*/
  /*  top: 44px;*/
  /*  left: 0;*/
  /*  right: 0;*/
  /*  bottom: 0;*/
  /*  overflow: hidden;*/
  /*}*/
  .content {
    height: calc(100% - 93px);
    overflow: hidden;
  }
</style>
