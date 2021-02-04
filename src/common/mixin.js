import {debounce} from "@/common/utils";
import BackTop from "@/components/content/backTop/BackTop";

//多次使用的页面防抖，用混入的方法使其方便重复使用
export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null,
      newRefresh: null
    }
  },
  mounted() {
    //这个地方img标签确实被挂载，但是其中的图片还没有占据高度
    //this.$refs.scroll.scroll.refresh对这个函数进行防抖操作
    this.newRefresh = debounce(this.$refs.scroll.refresh,100)

    //对监听的事件进行保存
    this.itemImgListener = () => {
      this.newRefresh()
    }
    this.$bus.$on('itemImgLoad',this.itemImgListener)
  }
}

//返回顶部按钮的公共混入
export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    //返回顶部
    backClick() {
      this.$refs.scroll.scrollTo(0,0);
    },
  }
}
