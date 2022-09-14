const axios = require("axios");
const moment = require("moment");
// 设置语言环境
moment.locale("zh-cn", {
  months:
    "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split(
      "_"
    ),
  monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
  weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
  weekdaysShort: "周日_周一_周二_周三_周四_周五_周六".split("_"),
  weekdaysMin: "日_一_二_三_四_五_六".split("_"),
  longDateFormat: {
    LT: "HH:mm",
    LTS: "HH:mm:ss",
    L: "YYYY-MM-DD",
    LL: "YYYY年MM月DD日",
    LLL: "YYYY年MM月DD日Ah点mm分",
    LLLL: "YYYY年MM月DD日ddddAh点mm分",
    l: "YYYY-M-D",
    ll: "YYYY年M月D日",
    lll: "YYYY年M月D日 HH:mm",
    llll: "YYYY年M月D日dddd HH:mm",
  },
  meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
  meridiemHour: function (hour, meridiem) {
    if (hour === 12) {
      hour = 0;
    }
    if (meridiem === "凌晨" || meridiem === "早上" || meridiem === "上午") {
      return hour;
    } else if (meridiem === "下午" || meridiem === "晚上") {
      return hour + 12;
    } else {
      // '中午'
      return hour >= 11 ? hour : hour + 12;
    }
  },
  meridiem: function (hour, minute, isLower) {
    const hm = hour * 100 + minute;
    if (hm < 600) {
      return "凌晨";
    } else if (hm < 900) {
      return "早上";
    } else if (hm < 1130) {
      return "上午";
    } else if (hm < 1230) {
      return "中午";
    } else if (hm < 1800) {
      return "下午";
    } else {
      return "晚上";
    }
  },
  calendar: {
    sameDay: "[今天]LT",
    nextDay: "[明天]LT",
    nextWeek: "[下]ddddLT",
    lastDay: "[昨天]LT",
    lastWeek: "[上]ddddLT",
    sameElse: "L",
  },
  dayOfMonthOrdinalParse: /\d{1,2}(日|月|周)/,
  ordinal: function (number, period) {
    switch (period) {
      case "d":
      case "D":
      case "DDD":
        return number + "日";
      case "M":
        return number + "月";
      case "w":
      case "W":
        return number + "周";
      default:
        return number;
    }
  },
  relativeTime: {
    future: "%s内",
    past: "%s前",
    s: "几秒",
    ss: "%d秒",
    m: "1分钟",
    mm: "%d分钟",
    h: "1小时",
    hh: "%d小时",
    d: "1天",
    dd: "%d天",
    M: "1个月",
    MM: "%d个月",
    y: "1年",
    yy: "%d年",
  },
  week: {
    // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
    dow: 1, // Monday is the first day of the week.
    doy: 4, // The week that contains Jan 4th is the first week of the year.
  },
});
const schedule = require("node-schedule");

const appID = "wx5**********11f"; //微信公众号APPID
const appsecret = "db178**********b3606f12"; //微信公众号appsecret
const noticeID = "_I49UNL83F4Nh8CICr**********_ZaYPrUCng"; //短信模板ID
const touser = ["oNGza6cn**********FKvPkCT0Qs"]; //用户的openid
const accessTokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`;
const sendUrl =
  "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=";
const weatherUrl =
  "https://devapi.qweather.com/v7/weather/3d?location=113.449176,22.204213&key=7bd390ac**********971ce0c"; //获取天气的地址
const wordsUrl = "https://api.shadiao.pro/chp"; //获取彩虹屁的接口
const loveDay = "2022-07-30";
const jwBirthday = "02-03";
const jzBirthday = "10-24";

//声明发送微信通知的方法
async function sendMsg(data) {
  const accessTokenRes = await axios.get(accessTokenUrl);
  const accessToken = accessTokenRes.data.access_token;
  touser.forEach(async userId => {
    const res = await axios.post(sendUrl + accessToken, {
      touser: userId,
      template_id: noticeID,
      data,
    });
    console.log(res.data);
  });
}

//声明获取天气的方法
async function getWeather() {
  const res = await axios.get(weatherUrl);
  return res.data.daily[0];
}

//声明彩虹屁的方法
async function getWords() {
  const res = await axios.get(wordsUrl);
  if (res.data.data.text) {
    return res.data.data.text;
  }
  return getWords();
}

//声明发送微信通知的参数
async function getSendData() {
  const nowWeather = await getWeather();
  const nowWords = await getWords();
  const data = {
    date: {
      value: moment().format("YYYY年MM月DD日"),
      color: randomHexColor(),
    },
    week_day: {
      value: moment().local("zh-cn").format("dddd"),
      color: randomHexColor(),
    },
    weather: {
      value: nowWeather["textDay"],
      color: randomHexColor(),
    },
    humidity: {
      value: nowWeather["humidity"] + "%",
      color: randomHexColor(),
    },
    wind: {
      value: nowWeather["windDirDay"] + nowWeather["windScaleDay"] + "级",
      color: randomHexColor(),
    },
    highest: {
      value: nowWeather["tempMax"],
      color: randomHexColor(),
    },
    lowest: {
      value: nowWeather["tempMin"],
      color: randomHexColor(),
    },
    sunrise: {
      value: nowWeather["sunrise"],
      color: randomHexColor(),
    },
    sunset: {
      value: nowWeather["sunset"],
      color: randomHexColor(),
    },
    love_days: {
      value: String(moment().diff(moment(loveDay), "days")),
      color: randomHexColor(),
    },
    birthday_left: {
      value: String(getBirthday(jwBirthday)),
      color: randomHexColor(),
    },
    birthday_left_1: {
      value: String(getBirthday(jzBirthday)),
      color: randomHexColor(),
    },
    words: {
      value: nowWords,
      color: randomHexColor(),
    },
  };

  return data;
}

//获取生日倒计时
function getBirthday(MMDD) {
  let Year = new Date().getFullYear();
  //判断下今年生日是不是过了
  if (
    new Date().getTime() >= new Date(Year + "-" + MMDD + " 23:59:59").getTime()
  ) {
    Year++;
  }
  return moment(Year + "-" + MMDD + " 23:59:59").diff(moment(), "days");
}

function createdSchedule() {
  const waterTime = schedule.scheduleJob("0 0 7 * * *", async () => {
    const data = await getSendData();
    sendMsg(data);
  });
}

//随机生成十六进制颜色
function randomHexColor() {
  return "";
  // let str = "#";
  // const arr = [
  //   "0",
  //   "1",
  //   "2",
  //   "3",
  //   "4",
  //   "5",
  //   "6",
  //   "7",
  //   "8",
  //   "9",
  //   "a",
  //   "b",
  //   "c",
  //   "d",
  //   "e",
  //   "f",
  // ];
  // for (let i = 0; i < 6; i++) {
  //   let num = parseInt(Math.random() * 16);
  //   str += arr[num];
  // }
  // return str;
}

// sendWeather(2);
// getWeather();
createdSchedule();
console.log("家文早安开始运行，小张随时待命！");
// getWords();
// async function main() {
// }

// main();
