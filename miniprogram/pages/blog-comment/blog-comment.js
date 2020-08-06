// pages/blog-comment/blog-comment.js
import formatTime from '../../utils/formatTime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blog:{},
    commentlist:[],
    blogId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    this.setData({
      blogId:options.blogId
    })
    this._getBlogDetail();
  },
  _getBlogDetail(){
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    wx.cloud.callFunction({
      name:'find',
      data:{
        blogId:this.data.blogId,
        $url:'detail'
      }
    }).then((res)=>{
      //将评论中的时间格式化
      let commentlist=res.result.commentlist.data;
      for(let i=0;i<commentlist.length;i++){
        commentlist[i].createTime=formatTime(new Date(commentlist[i].createTime))
      }
      this.setData({
        commentlist,
        blog:res.result.detail[0],
      })

      wx.hideLoading();
      // console.log(res);
    })
   

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let blog=this.data.blog;
    return {
      title:'鱿鱼教室通知',
      path:`/pages/blog-comment/blog-comment/blogId=${blog._id}`,
      // imageUrl:'../images/fengmian.png'
    }
  }
})