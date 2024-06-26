
function TriggerTimer() {
    StartCountDownTimeer(localStorage.getItem("ssEnteredDate"));
}

$(document).ready(function () {
    if (localStorage.getItem("ssEnteredDate") === null) {
        $('#main').hide();
        document.getElementById("btnSubmit").addEventListener("click", SetValues);
    }
    else {
        $('#home').hide();
        $('#dateholder').html(localStorage.getItem("ssEnteredMyDateTitle"))
        $('#dateDisplayer').html(displayDateInFormat(localStorage.getItem("ssEnteredDate")))
        document.getElementById("btnClearReset").addEventListener("click", ClearValues);
        TriggerTimer();
    }
});

function loadScript(scriptUrl) {
    const darkStyles = document.createElement('link');
    darkStyles.rel = 'stylesheet';
    darkStyles.type = 'text/css';
    darkStyles.href = scriptUrl;
    document.head.appendChild(darkStyles);
}

function SetValues() {
    if (document.getElementById("MyDateTitle").value == "") {
        document.getElementById("MyDateTitle").focus();
    }
    else if (document.getElementById("Txtdatetime").value == "") {
        document.getElementById("Txtdatetime").focus();
    }
    else {
        var isoDateValue = document.getElementById("Txtdatetime").value;
        date = new Date(document.getElementById("Txtdatetime").value);
        year = date.getFullYear();
        month = date.getMonth() + 1;
        dt = date.getDate();
        if (isoDateValue.length = 16) {
            isoDateValue = isoDateValue + ':00'
        }
        let ssEnteredDate = month + '/' + dt + '/' + year + ' ' + isoDateValue.substr(isoDateValue.length - 8);
        localStorage.setItem("ssEnteredMyDateTitle", document.getElementById("MyDateTitle").value);
        localStorage.setItem("ssEnteredDate", ssEnteredDate);
        localStorage.setItem("ssSentNotification", "0");
        location.reload(true);
    }
}

function ClearValues() {
    localStorage.removeItem("ssEnteredMyDateTitle");
    localStorage.removeItem("ssEnteredDate");
    localStorage.setItem("ssSentNotification", "0");
    location.reload(true);
}

function getDayOfWeek(date) {
    var dayOfWeek = new Date(date).getDay();
    return isNaN(dayOfWeek) ? null : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
}

function GetMonthName(date) {
    var monthNumber = new Date(date).getMonth();
    return isNaN(monthNumber) ? null : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][monthNumber];
}

function displayDateInFormat(date) {
    var date = new Date(date);
    var month = date.toLocaleString('en-IN', { month: 'long' });
    var mdate = date.getDate();
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    mdate = mdate < 10 ? '0' + mdate : mdate;
    var strTime = month + " " + mdate + ", " + year + " " + hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function ShowCountDown(targetEl, targetDate) {
    var days = Math.ceil((new Date(targetDate) - new Date()) / 86400000);
    var endPhrase = '';
    $(targetEl).siblings('.count').html(Math.abs(days));
    if (days == 0) {
        $(targetEl).siblings('.count').html('TODAY');
    } else if (days == 1) {
        endPhrase = 'day remains';
    } else if (days == -1) {
        endPhrase = 'day ago';
    } else if (days > 1) {
        endPhrase = 'days remaining';
    } else if (days < -1) {
        endPhrase = 'days ago';
    }
    $(targetEl).siblings('.endphrase').html(endPhrase);
}

function StartCountDownTimeer(targetDate) {
    var dthen = new Date(targetDate);
    var dnow = new Date();
    ddiff = new Date(dthen - dnow);
    gsecs = Math.floor(ddiff.valueOf() / 1000);
    CountBack(gsecs);
}

function Calcage(secs, num1, num2) {
    if (secs < 0) { secs += num1 };
    s = ((Math.floor(secs / num1)) % num2).toString();
    if (s.length < 2) {
        s = "0" + s;
    }
    return (s);
}

function CountBack(secs) {
    var DisplayStr;
    var DisplayFormat = "<table class='countdown'><tr><td class='cdday' width='25%' nowrap>%%D%%</td><td class='cdday'>:</td><td width='25%'>%%H%%</td><td>:</td><td width='25%'>%%M%%</td><td>:</td><td width='25%'>%%S%%</td><tr class='cdlabels'><td class='cdday'>Days</td><td class='cdday'></td><td>Hours</td><td></td><td>Minutes</td><td></td><td>Seconds</td></tr></table>";
    var d = Calcage(secs, 86400, 100000);
    DisplayStr = DisplayFormat.replace(/%%D%%/g, d);
    DisplayStr = DisplayStr.replace(/%%H%%/g, Calcage(secs, 3600, 24));
    DisplayStr = DisplayStr.replace(/%%M%%/g, Calcage(secs, 60, 60));
    DisplayStr = DisplayStr.replace(/%%S%%/g, Calcage(secs, 1, 60));
    $('#count').html(DisplayStr);
    if (d == '00') { $('.dayLabels').siblings('.cdday').hide(); };

    var thoseSecs = secs - 1;
    setTimeout(function () { CountBack(thoseSecs); }, 990);
    if (secs > 0) {
        //still counting down
        $('#endphrase').html('remaining');
    }
    else {
        //happened in the past
        $('#endphrase').html('in the past');
        if (localStorage.getItem("ssSentNotification") != "1") {
            chrome.runtime.sendMessage('', {
                type: 'notification',
                options: {
                    title: 'CountDown Timer',
                    message: 'Your count down for ' + localStorage.getItem("ssEnteredMyDateTitle") + ' is completed now.',
                    iconUrl: '/icon.png',
                    type: 'basic'
                }
            });
            localStorage.setItem("ssSentNotification", "1");
        }
    }
}