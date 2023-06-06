
// 拿屏幕状态栏
var statusBar__alarmClock = document.querySelector(".alarmClock")
var statusBar__stopWatch = document.querySelector(".stopWatch")
var statusBar__clock = document.querySelector(".clock")
var statusBar__timing = document.querySelector(".timing")
// 拿屏幕数字
var number__hour = document.querySelector(".number__hour")
var colon = document.querySelector(".colon")
var number__minutes = document.querySelector(".number__minutes")
var tips = document.querySelector(".tips")
var number__seconds = document.querySelector(".number__seconds")
//拿按键
var set__time = document.querySelector(".set__time")//调按钮
var button__hour = document.querySelector(".button__hour")
var button__minutes = document.querySelector(".button__minutes")
var button__seconds = document.querySelector(".button__seconds")
var button__open = document.querySelector(".button__open")
var button__clear = document.querySelector(".button__clear")
var button__mode = document.querySelector(".button__mode")


button__open.addEventListener("mousedown",function (){
    button__open.classList.toggle("active")
})

set__time.addEventListener("mousedown",mouseDown)
set__time.addEventListener("mouseup",mouseUp)
var increaseTimer=0
    function mouseDown(e){
        set__time.addEventListener("mousemove",mousemove)
        increaseTimer=setTimeout(longPress,500,e)
        return
    }
    //按下调时间
    function mousemove(e){
        if(button__hour.contains(e.target)||button__minutes.contains(e.target)||button__seconds.contains(e.target)){
            return
        }
        clearTimeout(increaseTimer)
    }
    //抬起调时间
    function mouseUp(e){
        set__time.removeEventListener("mousemove",mousemove)
        clearTimeout(increaseTimer)
        if(increaseTimer != 0){
                increase(e)
        }
    }
    //长按增加数值
    function longPress(button){
        console.log(button.target.innerText);
        clearTimeout(increaseTimer)
        increaseTimer=setTimeout(function fn(){
                increase(button)
            increaseTimer=setTimeout(fn,100)
        },100)
    }

    //个位数判断
    function singleDigit(number){
        if(parseInt(number.innerText).toString().length<2){
            number.innerText=`0${number.innerText}`
        }
        if(parseInt(number.innerText%10)===1){
            number.innerText=`${Math.floor(parseInt(number.innerText%100)/10)} ${parseInt(number.innerText%10)}`
        }else{
            number.innerText=number.innerText
        }
    }
    //处理数字间空格
    function space(number){
        if(number.firstChild.substringData(1,1) == " "){
            number.firstChild.deleteData(1,1)
        }
    }
function increase(e) {//调时间
    switch (e.target) {
        case button__hour:
            number__hour.innerText++
            if (number__hour.innerText === "24") number__hour.innerText = 0
            console.log("调时钟");
            break;
        case button__minutes:
            space(number__minutes)
            number__minutes.innerText++
            if (number__minutes.innerText === "60") number__minutes.innerText = 0
            singleDigit(number__minutes)
            console.log("调分钟");
            break;
        case button__seconds:
            space(number__seconds)
            number__seconds.innerText++
            if (number__seconds.innerText === "60"||number__seconds.innerText==="100") number__seconds.innerText = 0
            singleDigit(number__seconds)
            console.log("调秒钟");
            break;
        default:
            break;
    }

}
var setTimeTimer = null
function setTime() {//开关时钟
    var clock = null//开关
    return function fn() {
        clearInterval(setTimeTimer)
        if (clock) {
            clock = false
            return
        }
        clock = true
        setTimeTimer = setInterval(() => {
            number__hour.innerText = new Date().getHours()
            number__minutes.innerText = new Date().getMinutes()
            number__seconds.innerText = new Date().getSeconds()
            //个位数判断
            singleDigit(number__minutes)
            singleDigit(number__seconds)
        }, 500)
    }
}
function clearTime() {//一键清零
    number__hour.innerText = "00"
    number__minutes.innerText = '00'
    number__seconds.innerText = '00'
}
function clearTimeSup() {//超级一键清零
    switchMode()
}
var countDownTimer = null
function countDown() {//倒计时
    var clock = null//开关
    //剩余的时间
    var setNow = null
    return function () {
        //处理数字间空格
        space(number__minutes)
        space(number__seconds)
        cancelAnimationFrame(countDownTimer)
        if (clock) {
            clock = false
            return
        }
        clock = true
        //获取旧时间戳
        var timeOri = new Date().getTime()
        //调的时间
        var setOri = parseInt(number__hour.innerText * 3600) +
            parseInt(number__minutes.innerText * 60) +
            parseInt(number__seconds.innerText * 1)
        //定时器
        countDownTimer = requestAnimationFrame(function fn() {
            //获取新时间戳
            var timeNow = new Date().getTime()
            //调的时间 减去（新时间 减去 旧时间）
            setNow = setOri - Math.floor((timeNow - timeOri) / 1000)
            number__hour.innerText = Math.floor((setNow % 86400) / 3600)
            number__minutes.innerText = Math.floor((setNow % 3600) / 60)
            number__seconds.innerText = Math.floor((setNow % 60))
            //个位数判断
            // singleDigit(number__minutes)
            singleDigit(number__seconds)
            countDownTimer = requestAnimationFrame(fn)
            if (setNow <= 0) {
                console.log("倒计时，时间到");
                cancelAnimationFrame(countDownTimer)
                clock = false
                countDownTimer = null
            }
        })
    }
}
var stopWatchTimer = null
function stopWatch() {//秒表
    var clock = null
    //旧的系统时间
    var timeOri = null
    //已经过去的时间
    var setNow = null
    //暂停时的时间
    var last = null

    return function () {
        cancelAnimationFrame(stopWatchTimer)
        if (clock) {
            last = setNow
            clock = false
            return
        }
        clock = true
        timeOri = new Date().getTime() - last
        stopWatchTimer = requestAnimationFrame(function fn() {
            setNow = new Date().getTime() - timeOri
            number__hour.innerText = Math.floor((setNow / 1000) % 3600 / 60)
            number__minutes.innerText = Math.floor((setNow / 1000) % 60)
            number__seconds.innerText = Math.floor((setNow / 10) % 100)//1厘秒=0.01秒=10毫秒
            //个位数判断
            singleDigit(number__minutes)
            singleDigit(number__seconds)
            stopWatchTimer = requestAnimationFrame(fn)
        })
    }
}
var on_clock = null
var alarmClockTimer = 200
function alarmClock() {//闹钟
    return function () {
        //处理数字间空格
        space(number__minutes)
        space(number__seconds)
        cancelAnimationFrame(alarmClockTimer)
        var hourOri = number__hour.innerText
        var minutesOri = number__minutes.innerText
        var secondsOri = number__seconds.innerText
        if(parseInt(hourOri)>23||parseInt(minutesOri)>59||parseInt(secondsOri)>59){
            console.log(`${hourOri}:${minutesOri}:${secondsOri}注意!：设置的时间有误`);
            return
        }
        if (on_clock) {
            on_clock = false
            cancelAnimationFrame(alarmClockTimer)
            console.log("已设定的闹钟关闭");
            tips.classList.remove("Hover")
            return
        }
        on_clock = true
        console.log(`闹钟已开启${hourOri}:${minutesOri}:${secondsOri}`);
        tips.classList.add("Hover")
        alarmClockTimer=requestAnimationFrame(function fn(){
            if (hourOri == new Date().getHours() && minutesOri == new Date().getMinutes() && secondsOri == new Date().getSeconds()) {
                console.log("闹钟响起，将在明天此时再次响起");
            }
            alarmClockTimer=requestAnimationFrame(fn)
        })
    }
}

var mode = 1//1时钟模式，2倒计时模式，3秒表模式，4闹钟模式
button__mode.addEventListener("click", function () {
    mode++
    if (mode > 4) {
        mode = 1
    }
    switchMode()

})

var a = null
var b = null
var c = null
var d = null

function switchMode() {
    //闭包
    var setT = setTime()
    var countD = countDown()
    var stopW = stopWatch()
    var alarmC = alarmClock()

    for (var i = 0; i < 3; i++) {
        cancelAnimationFrame(countDownTimer)
        cancelAnimationFrame(stopWatchTimer)
        clearInterval(setTimeTimer)
    }

    //删除监听
    button__open.removeEventListener("click", a)
    button__open.removeEventListener("click", b)
    button__open.removeEventListener("click", c)
    button__open.removeEventListener("click", d)
    button__clear.removeEventListener("click", clearTime)
    button__clear.removeEventListener("click", clearTimeSup)

    //改状态栏模式名字
    statusBar__alarmClock.classList.remove("Hover")
    statusBar__stopWatch.classList.remove("Hover")
    statusBar__clock.classList.remove("Hover")
    statusBar__timing.classList.remove("Hover")

    //改开关样式
    button__open.classList.remove("active")

    switch (mode) {
        case 1:
            console.log("时钟模式");
            statusBar__clock.classList.add("Hover")
            button__open.addEventListener("click", setT)
            a = setT
            button__clear.addEventListener("click", clearTime)
            break;
        case 2:
            console.log("倒计时模式");
            statusBar__timing.classList.add("Hover")
            button__open.addEventListener("click", countD)
            b = countD
            button__clear.addEventListener("click", clearTime)
            break;
        case 3:
            console.log("秒表模式");
            statusBar__stopWatch.classList.add("Hover")
            clearTime()
            button__open.addEventListener("click", stopW)
            c = stopW
            button__clear.addEventListener("click", clearTimeSup)
            break;
        case 4:
            console.log("闹钟模式");
            statusBar__alarmClock.classList.add("Hover")
            button__open.addEventListener("click", alarmC)
            d = alarmC
            button__clear.addEventListener("click", clearTime)
            break;
        default:
            break;
    }
}

switchMode()




var fn=function (arr){
    if(!arr || !arr.length){
        return
    }
    var index=0
    document.documentElement.addEventListener("click",function fnn(e){
    var x=e.pageX,y=e.pageY
    var textPopup=document.createElement("span")
    textPopup.className='textPopup'
    this.appendChild(textPopup)
    textPopup.innerText=arr[index]
    index=(index+1)%arr.length
    textPopup.addEventListener("animationend",function (){
        textPopup.parentNode.removeChild(textPopup)
    })
    textPopup.style.left=x-(textPopup.clientWidth/2)+'px'
    textPopup.style.top=y-textPopup.clientHeight+'px'
    })

}
fn(["富强",'民主', '文明', '和谐', '自由', '平等', '公正', '法治', '爱国', '敬业', '诚信', '友善'])