// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const TcbRouter=require('tcb-router');
const  db=cloud.database();
const findCollection=db.collection('find');

// 云函数入口函数
exports.main = async (event, context) => {
   const app=new TcbRouter({
     event
   })
   app.router('list',async(cxt,next)=>{
    let blogList= await findCollection.skip(event.start).limit(event.count).orderBy('createTime','desc').get().then((res)=>{
       return res.data;
     })
     cxt.body=blogList;
   })
   return app.serve();
}