# 我的第一个原生小程序可开发
### 蓝牙连接启动页
1. 启动页点击连接蓝牙，连接成功后进入小程序首页中
缺点:必须采用低功耗蓝牙，蓝牙的传输距离过短，在和智慧教室硬件上的连接距离问题存在一定的缺陷
优化：采用ESP8266 WIFI-模块实现数据的通信，将数据传输到阿里云服务器上，再通过后端的接口实现读取数据到小程序的云函数中（该功能尚未优化）  
### 首页显示当前教室的情况
1. 首页显示当前教室的人数、温度、湿度、亮度
2. 硬件上采用红外模块高低电平统计经过的人数，温湿度分别通过具体的温度传感器、湿度传感器传输到硬件上，亮度采用光敏传感器进行模数转换获取到数值
### 通知功能
1. 点击搜索框左侧的发布按钮就可以进入到发布的具体界面，发布界面实现微信统计最多字数不能超过140个字，图片最多只能上传九张
### 个人信息
1. 个人信息功能采用动态的波纹图，呈现蓝色边框底部我动态流动的效果
### 效果图
![image](https://github.com/jessalin737/xiaochengxu-Smart-classroom/blob/master/classroom-4.jpg)
![image](https://github.com/jessalin737/xiaochengxu-Smart-classroom/blob/master/classroom-5.png)
![image](https://github.com/jessalin737/xiaochengxu-Smart-classroom/blob/master/classroom-6.png)




