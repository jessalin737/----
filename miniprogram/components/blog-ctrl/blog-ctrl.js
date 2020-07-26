// components/blog-ctrl/blog-ctrl.js
let userInfo={};
let db=wx.cloud.database();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId:String
  },
  externalClasses:['iconfont','icon-pinglun','icon-shared'],
  /**
   * 组件的初始数据
   */
  data: {
   loginShow:false,
   modalShow:false,
   content:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment(){
      wx.getSetting({
        success: (res) => {
          if(res.authSetting['scope.userInfo']){
            //获取用户信息
            wx.getUserInfo({
              success: (res) => {
                userInfo=res.userInfo
                //显示写评论的界面
                this.setData({
                  modalShow:true
                })
              },
            })
          }else{
            //显示需要授权的信息
            this.setData({
              loginShow:true
            })
          }
        },
      })
    },
    onLoginsuccess(event){
      userInfo=event.detail;
     //授权成功时授权框消失，同时显示评论框
     this.setData({
       loginShow:false
     },()=>{
      this.setData({
        modalShow:true
      })
     })
    },
    onLoginfail(){
      wx.showModal({
        title: '授权用户才能评论',
        content:''
      })
    },
    //使用form表单不需要实时绑定
    // onInput(event){
    //  this.setData({
    //    content:event.detail.value
    //  })
    // },
    onSend(event){
      // console.log(event);
      let formId=event.detail.formId;
      let content=event.detail.value.content;
      if(content.trim()==''){
        wx.showModal({
          title: '评价的内容不能为空',
        })
        return
      }
        wx.showLoading({
          title: '评价中',
          mask:true
        })
        //小程序端直接将数据添加到数据库中
        db.collection('find-comment').add({
          data:{
            content,
            createTime:db.serverDate(),
            nickname:userInfo.nickname,
            avatarUrl:userInfo.avatarUrl,
            blogId:this.data.blogId
          }
        }).then((res)=>{
          wx.cloud.callFunction({
            name:"sendMessage",
            data:{
              content,
              createTime,
              blogId:this.properties.blogId
            }
          }).then((res)=>{
             console.log(res);
          })
          wx.hideLoading();
          wx.showToast({
            title: '评价成功',
          })
          this.setData({
            modalShow:false,
            content:''
          })
        })
    }
  }
})
