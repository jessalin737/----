// components/bottom-modal/bottom-modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalShow: Boolean
  },
  //可共享且修改外部的样式
  options: {
    styleIsolation: 'apply-shared',
    //使用具名插槽时需要定义才可以使用
    multipleSlots: true,
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClose() {
      this.setData({
        modalShow: false
      })
    },
  }
})