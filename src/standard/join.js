const fs = require('fs');
const path = require('path');

const head = fs.readFileSync(path.resolve(__dirname, './head.html'), 'utf-8');
const tail = fs.readFileSync(path.resolve(__dirname, './tail.html'), 'utf-8')
const title = (title) => {return `<div style="
box-shadow: 0 0 20px #66ccff8f;
background-color: #FAFEFF;
width: 600px;
border-radius: 16px;
margin: 20px auto 20px auto;
padding: 32px 40px;
font-weight: bolder;
line-height: 46px;
font-size: 41px;
background: url('https://bobblehat-1259032998.cos.ap-beijing.myqcloud.com/GRIS/banner.svg') no-repeat center center;
background-position: center;
background-size: 680px;">${title}</div>`}
const content = (content) => `<div style="width: 660px;padding: 0 10px;margin: auto;min-height: 242px;">${content}</div>`
const inscribe = (inscribe) => `<div style="
width: 640px;
margin: 20px auto;
border-radius: 16px;
padding: 20px;
box-shadow: 0 0 20px #66ccff8f;
font-size: 16px;
line-height: 20px;
font-weight: 600;
background: url('https://bobblehat-1259032998.cos.ap-beijing.myqcloud.com/GRIS/grass.svg') no-repeat center center;
background-position: 0% 68%;
background-size: 680px;">${inscribe}</div>`


// 周报日报之类的class
class Report {

    /**
     * @param title 标题，在横线上左侧的部分
     * @param extra 额外的部分，在横线右侧的部分
    */
    title = (param) => `<div style="display: flex;
        justify-content: space-between;
        align-items: flex-end;
        height: 60px;
        width: 100%;
        font-size: 20px;"><p style="margin: 0">${param.title}</p><p style="margin: 0">${param.extra || ''}</p></div><div style="width: 100%;
        margin: 12px 0;
        border-bottom: 1px solid #66ccff;
        box-shadow: 0 0 10px #66ccff" ></div>`;

    billing = (param) => {
        let _billing_ = '';
        param.map((item)=>{
            _billing_ += `<div style="display: flex;align-items: center;justify-content: space-between;">
            <div style="width: 4px;height: 13px;border-radius: 10px;background-color: ${checkBenifit(item) ? '#44cd00' : '#eb1535'};"></div>
                <p style="display: flex;margin: 6px auto;justify-content: flex-start;width: 25%">${item.end_time.substring(5)}</p>
                <p style="display: flex;margin: 6px auto;justify-content: center;width: 18%">~$${item.start_price}</p>
                <p style="display: flex;margin: 6px auto;justify-content: center;width: 2%;text-shadow: 0 0 6px ${checkTrend(item) ? '#44cd00' : '#eb1535'};color: ${checkBenifit(item) ? '#44cd00' : '#eb1535'}">${item.way === 'buy' ? '▲' : '▼'}</p>
                <p style="display: flex;margin: 6px auto;justify-content: center;width: 16%">$${item.end_price}</p>
                
                <p style="display: flex;margin: 6px 0 6px auto;justify-content:flex-end;padding:0 3px 0 5px;border-radius: 5px;color:white;background-color: ${checkBenifit(item) ? '#44cd00' : '#eb1535'};width: 19%;overflow: hidden">${numberBenifit(item)} U</p>
            </div>`
        })
        return _billing_
    }
    
    // <div style="width: 4px;height: 13px;border-radius: 10px;margin-right: 10px;background-color: ${checkBenifit(item) ? '#15f700' : '#eb1535'};box-shadow: 0 0 6px ${checkBenifit(item) ? '#15f700' : '#eb1535'}"></div>
    // <p style="display: flex;margin: 6px auto;justify-content: center;width: 19%">${item.start_time.substring(5)}</p>

    // <p style="display: flex;margin: 6px auto;justify-content: center;width: 19%">${item.end_time.substring(5)}</p>
    aurora = (param) => {
        return ''
    }

    offline = () => {
        return ''
    }
}

const _r_ = new Report()



/** 邮件的拼接 */
exports.Join = (param) => {
    return head + title(param.title) + content(param.content) + inscribe(param.inscribe) + tail
}


/** 周报，月报 之类的邮件内容 */
exports.ReportContent = (params) => {
    try {
      let ans = '';
      JSON.parse(params.content).map((item) => {
        ans += _r_.title(item);
        ans += _r_[item.type](item.data);
      })
      return head + title(params.title) + content(ans) + inscribe(params.inscribe) + tail    
    } catch (error) {
        
    }
}

// 算一下是不是盈利了，赚了的话会返回true
const checkBenifit = (param) => {
    return param.earn > 0
    // return (param.start_price - param.end_price > 0 && param.way === 'sell') || (param.start_price - param.end_price < 0 && param.way === 'buy')
}

// 检查趋势 涨了饭回true
const checkTrend = (param) => {
    return param.start_price < param.end_price
}

// 盈利了多少s
const numberBenifit = (param) => {
  return param.earn
    // return (Math.max(param.start_price, param.end_price) / Math.min(param.start_price, param.end_price) * 100 - 100).toPrecision(3)
}









// 周报内容
const params = [
  {
      title: 'Billing Revenue',
      extra: '测试',
      type: 'billing',
      data: [{
          start_time: '2021/12/3 13:11:55',
          start_price: '61020',
          end_time: '2021/12/3 19:11:55',
          end_price: '63030',
          way: 'buy',
          earn: '11.3'
      },{
          start_time: '2021/12/3 13:11:55',
          start_price: '61020',
          end_time: '2021/12/3 19:11:55',
          end_price: '63020',
          way: 'sell'
      }]
  }, {
      title: 'Aurora Project',
      type: 'aurora',
      data: [
          
      ]
  }, {
      title: 'Offline Report',
      type: 'offline',
      data: [
          
      ]
  }
]






// console.log('rc', ReportContent(params))