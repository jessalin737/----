// 输入文字最大的个数
const MAX_WORDS_NUM = 140
// 最大上传图片数量
const MAX_IMG_NUM = 9

const db = wx.cloud.database()
// 输入的文字内容
let content = ''
let userInfo = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 输入的文字个数
    wordsNum: 0,
    footerBottom: 0,//底部数字和按钮一栏
    images: [],
    selectPhoto: true, // 添加图片元素是否显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options)
    userInfo = options
  },
  //textarea绑定的输入事件
  onInput(event) {
    // console.log(event.detail.value)
    let wordsNum = event.detail.value.length
    if (wordsNum >= MAX_WORDS_NUM) {
      wordsNum = `最大字数为${MAX_WORDS_NUM}`
    }
    this.setData({
      wordsNum
    })
    content = event.detail.value
  },

  onFocus(event) {
    //真机运行时键盘高度为0
    // console.log(event)
    this.setData({
      footerBottom: event.detail.height,
    })
  },
  onBlur() {
    this.setData({
      footerBottom: 0,
    })
  },

  onChooseImage() {
    // 还能再选几张图片
    let max=MAX_IMG_NUM-this.data.images.length;
    wx.chooseImage({
      count: max,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // console.log(res)
        this.setData({
          //追加上图片数量concat拼接
          images: this.data.images.concat(res.tempFilePaths)
        })
        // 还能再选几张图片
        max = MAX_IMG_NUM - this.data.images.length
        this.setData({
          selectPhoto: max <= 0 ? false : true
        })
      },
    })
  },
  onDelImage(event) {
    //splice直接改变原数组
    this.data.images.splice(event.target.dataset.index, 1)
    this.setData({
      images: this.data.images
    })
    if (this.data.images.length == MAX_IMG_NUM - 1) {
      this.setData({
        selectPhoto: true,
      })
    }
  },

  onPreviewImage(event) {
    wx.previewImage({
      urls: this.data.images,
      current: event.target.dataset.imgsrc,
    })
  },

  send() {
    // 图片 -> 云存储 fileID 云文件ID
     // 数据库：内容（判断是否为空）、图片fileID、openid、昵称、头像、时间
    // 数据 存入-> 云数据库
    if (content.trim() === '') {
      wx.showModal({
        title: '请输入内容',
        content: '',
      })
      return
    }

    wx.showLoading({
      title: '发布中',
      //发布时出现一个蒙版的功能
      mask: true,
    })

    let promiseArr = []
    let fileIds = []
    // 图片上传
    for (let i = 0, len = this.data.images.length; i < len; i++) {
     let p=new Promise((resolve,reject)=>{
        let item = this.data.images[i]
        // 利用正则获取文件扩展名 
        let suffix = /\.\w+$/.exec(item)[0]
        //上传到云存储中
        wx.cloud.uploadFile({
          //利用时间设置唯一的图片名
          cloudPath: 'find/' + Date.now() + '-' + Math.random() * 1000000 + suffix,
          filePath: item,
          success: (res) => {
            // console.log(res.fileID)
            fileIds = fileIds.concat(res.fileID)
            resolve()
          },
          fail: (err) => {
            console.error(err)
            reject()
          }
        })
      })
      promiseArr.push(p)
    }
    // 存入到云数据库
    Promise.all(promiseArr).then((res) => {
      db.collection('find').add({
        data: {
          ...userInfo,
          content,
          img: fileIds,
          createTime: db.serverDate(), // 服务端的时间
        }
      }).then((res) => {
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
        })
        // 返回find页面，并且刷新
        wx.navigateBack()
        const pages = getCurrentPages()
        // console.log(pages)
        // 取到上一个页面并刷新界面
        const prevPage = pages[pages.length - 2]
        prevPage.onPullDownRefresh()
      })
    }).catch((err) => {
      wx.hideLoading()
      wx.showToast({
        title: '发布失败',
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})