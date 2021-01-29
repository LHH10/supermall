<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav"/>
    <scroll class="content" ref="scroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info :param-info="paramInfo"/>
      <detail-comment-info :comment-info="commentInfo"/>

      <goods-list :goods="recommends"/>
    </scroll>
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

  import Scroll from '@/components/common/scroll/Scroll'
  import GoodsList from "@/components/content/goods/GoodsList";


  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "@/network/detail";


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
            recommends: []
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
        GoodsList,

        Scroll
      },
      created() {
        // 1.保存传入的iid
        this.iid = this.$route.params.iid

        // 2.根据iid请求详情数据
        getDetail(this.iid).then(res =>{
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
        })

        //3.请求推荐数据
        getRecommend().then(res => {
          this.recommends = res.data.list
        })
      },
      methods: {
        imageLoad() {
          this.$refs.scroll.scroll.refresh()
        }
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
    height: calc(100% - 44px);
    overflow: hidden;
  }
</style>
