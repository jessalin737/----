// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const TcbRouter=require('tcb-router');
const  db=cloud.database();
const findCollection=db.collection('find');

// 云函数入口函数
exports.main = async (event, context) => {
   const app=new TcbRouter({
     event
   })
   app.router('list',async(cxt,next)=>{
    //搜索功能的实现
    const keyword=event.keyword;
    let w={};
    if(keyword.trim()!=''){
      w={
        content:db.RegExp({
          regexp:keyword,
          options:"i"
        })
      }
    }
    let blogList= await findCollection.where(w).skip(event.start).limit(event.count).orderBy('createTime','desc').get().then((res)=>{
       return res.data;
     })
     cxt.body=blogList;
   })
   return app.serve();
}