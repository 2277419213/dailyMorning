# 食用说明

## 首先！！！这个直接跑，是跑不起来的
- 需要先自己替换自己的公众号相关信息，我怕你们轰炸我，所以我做了脱敏！！！    
```
const appID = "wx5**********11f"; //微信公众号APPID
const appsecret = "db178**********b3606f12"; //微信公众号appsecret
const noticeID = "_I49UNL83F4Nh8CICr**********_ZaYPrUCng"; //短信模板ID
const touser = ["oNGza6cn**********FKvPkCT0Qs"]; //用户的openid
```
这里的数据需要你们自行上微信测试公众号申请https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login

## 其次这个代码的来源
- 代码当然无版权，技术无国界，爱咋用都行，起初看到这个是一个白嫖github的服务器，但是队列好慢，排队到晚上    
于是自己刚好又有阿里云的学生云服务器，就自己按照之前的类型方法写了一个，之前的他们用的是`python`而我用的是`nodejs`

## 再者调用了这些接口
- 目前代码外部接口是调用了一个土味情话的和一个天气的   
天气的接口用的是和风的天气接口，需要自行申请一下key，是免费的https://dev.qweather.com/docs/api/weather/weather-daily-forecast/    
土味情话的接口可以直接用，get请求就好了，均来自网络上的开源https://api.shadiao.pro/chp  

## 最后发现了bug
- 微信有个bug，如果我在通知模板配置了emoji,那么颜色显示就会错乱，如果我去掉emoji，那么就是正常的！