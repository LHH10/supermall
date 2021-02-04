import {ADD_COUNTER,ADD_TO_CART} from "@/store/mutation-types";

export default {
  addCart(content,payload) {
    return new Promise((resolve,reject) => {
      //payload--新添加的商品

      //1.查找之前数组中是否有该商品
      let oldProduct = content.state.cartList.find(item => item.iid === payload.iid)

      // 2.判断oldProduct
      if (oldProduct) {//数量加1
        // oldProduct.count += 1
        content.commit(ADD_COUNTER,oldProduct)
        resolve('当前的商品数量加1')
      } else {//添加新的商品
        payload.count = 1
        // content.state.cartList.push(payload)
        content.commit(ADD_TO_CART,payload)
        resolve('添加了新的商品')
      }
    })

  }
}
