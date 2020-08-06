// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
// 云函数入口函数
exports.main = async (event, context) => {
  //推送消息模板的云函数
  try{
     const wxContent=cloud.getWXContext()
     const templateId='Fey5Nwm0wT_mrswQIb284fcQWK_dW7Q--I9u7T3k4Bc'
     const result=await cloud.openapi.subscribeMessage.send({
       touser:wxContent.OPENID,
       page:`pages/blog-comment/blog-comment?blogId=${event.blogId}`,
       lang:'zh_CN',
       data:{
         time1:{
           value:event.createTime
         },
         phrase2:{
           value:'评价完成'
         },
         thing3:{
           value:event.content
         }
       },
       templateId:"Fey5Nwm0wT_mrswQIb284fcQWK_dW7Q--I9u7T3k4Bc",
       miniprogram_state: 'developer'
     })
     return result
  }catch(err){
    return err;
  }
}