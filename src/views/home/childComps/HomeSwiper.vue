<template>
  <Swiper>
    <swiper-item v-for="(item, id) in banners" :key="id">
      <a :href="item.link">
        <img :src="item.image" alt="" @load="imageLoad">
      </a>
    </swiper-item>
  </Swiper>
</template>

<script>
  import {Swiper,SwiperItem} from '@/components/common/swiper';

  export default {
    name: "HomeSwiper",
    props: {
      banners: {
        type: Array,
        default() {
          return []
        }
      }
    },
    components: {
      Swiper,
      SwiperItem
    },
    methods: {
      imageLoad() {
        this.$emit('swiperImageLoad')
      }
    }
    }
</script>

<style scoped>

</style>
