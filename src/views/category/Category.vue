<template>
  <ul>
    <li v-for="(item,index) in 80" :key="index">{{item}}</li>
  </ul>
</template>


<script>
    export default {
        name: "Category"
    }
</script>

<style scoped>

</style>
