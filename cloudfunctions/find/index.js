// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const TcbRouter=require('tcb-router');
const  db=cloud.database();
const findCollection=db.collection('find');
const MAX_LIMIT=100;
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
   //正文中需要整个博客的内容+评价，对应查询数据库中的find和find-comment
   app.router('detail',async(cxt,next)=>{
     let blogId=event.blogId;
     let detail=await findCollection.where({
      _id:blogId
     }).get().then((res)=>{
         return res.data;
     })
     //评论查询
     const countResult=await db.collection('find-comment').where({blogId}).count();
     const total=countResult.total;
     const task=[];
     let commentlist={
       data:[]
     }
     if(total>0){
       const batchTimes=Math.ceil(total/MAX_LIMIT);
       for(let i=0;i<batchTimes;i++){
         let promise=db.collection('find-comment').skip(i*MAX_LIMIT).limit(MAX_LIMIT).where({blogId}).orderBy('createTime','desc').get()
       task.push(promise);  
       }
       if(task.length>0){
        commentlist=(await Promise.all(task)).reduce((acc,cur)=>{
           return{
             data:acc.data.concat(cur.data)
           }
         })
       }
     }
     cxt.body={
       detail,
       commentlist
     }
   })

   return app.serve();

}