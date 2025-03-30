let all = [];
let state = [];

function getD1() {
    var date = new Date();
    var d1 = date.toLocaleTimeString();
    document.getElementById("date-time").innerHTML = d1;
}

function highlight() {
    for (let i = 0; i < all.length; i++) {
        let date = all[i].date;
        let subject = all[i].subject;
        let starttime = all[i].starttime;
        let endtime = all[i].endtime;
        let classnum = all[i].classnum;

        let year = date.split("/")[0];
        let month = date.split("/")[1] - 1;
        let day = date.split("/")[2];

        let starthour = starttime.split(":")[0];
        let startmin = starttime.split(":")[1];

        let endhour = endtime.split(":")[0];
        let endmin = endtime.split(":")[1];

        let time = new Date().getTime();
        let start = new Date(year, month, day, starthour, startmin).getTime();
        let end = new Date(year, month, day, endhour, endmin).getTime();

        let prepare = new Date(start).getTime() - 60 * 30 * 1000;
        let last = new Date(end).getTime() - 60 * 15 * 1000;

        if (time >= start && time <= end) {
            if (time >= last && time < end) {
                try {
                    let a = document.getElementsByClassName('subject')[classnum];
                    a.classList.replace('none', 'last');
                } finally {
                    let a = document.getElementsByClassName('subject')[classnum];
                    a.classList.replace('now', 'last');
                }

                state[classnum][0].state = 'last';

            } else {
                try {
                    let a = document.getElementsByClassName('subject')[classnum];
                    a.classList.replace('none', 'now');
                } finally {
                    let a = document.getElementsByClassName('subject')[classnum];
                    a.classList.replace('prepare', 'now');
                }
                state[classnum][0].state = 'now';
            }
        } else if (time >= prepare && time < start) {
            let a = document.getElementsByClassName('subject')[classnum];
            a.classList.replace('none', 'prepare');
            state[classnum][0].state = 'prepare';
        } else if (time < prepare) {
            let a = document.getElementsByClassName('subject')[classnum];
            a.classList.replace('none', 'none');
            state[classnum][0].state = 'none';
        } else if (time > end) {
            let a = document.getElementsByClassName('subject')[classnum];
            a.classList.replace('last', 'none');
            state[classnum][0].state = 'end';
        }

        if (state[classnum][0].state !== state[classnum][0].state_) {
            console.log(state[classnum][0].state);
            if (state[classnum][0].state === 'none') {
                let a = document.getElementsByClassName('subjectstate')[classnum];
                a.innerHTML = '未开始';
                state[classnum][0].state_ = state[classnum][0].state;
            } else if (state[classnum][0].state === 'prepare') {
                let a = document.getElementsByClassName('subjectstate')[classnum];
                a.innerHTML = '即将开始';
                state[classnum][0].state_ = state[classnum][0].state;
            } else if (state[classnum][0].state === 'now') {
                let a = document.getElementsByClassName('subjectstate')[classnum];
                a.innerHTML = '正在进行';
                state[classnum][0].state_ = state[classnum][0].state;
            } else if (state[classnum][0].state === 'last') {
                let a = document.getElementsByClassName('subjectstate')[classnum];
                a.innerHTML = '即将结束';
                state[classnum][0].state_ = state[classnum][0].state;
            } else if (state[classnum][0].state === 'end') {
                let a = document.getElementsByClassName('subjectstate')[classnum];
                a.innerHTML = '已经结束';
                state[classnum][0].state_ = state[classnum][0].state;
            }
        }
    }
}

async function getjson() {
    try {
        const response = await fetch('config/subjectlist.json');
        const data = await response.json();
        const schedule = data.schedule;

        let iii = 0;
        for (let i = 0; i < schedule.length; i++) {
            let thedate = schedule[i].date;
            let subject = schedule[i].subject;

            let date = document.createElement("div");
            let datetext = document.createTextNode(thedate);
            date.appendChild(datetext);
            let a = document.getElementsByClassName('schedule')[0];
            a.appendChild(date);
            date.classList.add('date');
            for (let ii = 0; ii < subject.length; ii++) {
                let sub = subject[ii].sub;
                let starttime = subject[ii].starttime;
                let endtime = subject[ii].endtime;

                let theall = [{"date":thedate,"subject":sub,"starttime":starttime,"endtime":endtime,"classnum":iii}];
                all =[...all,...theall];

                let thestate = [{state:'none',state_:'1'}];
                state =[...state,thestate];

                let subjectt = document.createElement("div");
                let a =document.getElementsByClassName('date')[i];
                a.appendChild(subjectt);
                subjectt.classList.add('subject','none')

                let subjecttext = document.createElement("span")
                let subjecttext_text = document.createTextNode(sub)
                subjecttext.appendChild(subjecttext_text)
                let b =document.getElementsByClassName('subject')[iii]
                b.appendChild(subjecttext);
                subjecttext.classList.add('subjectname')

                let time = document.createElement("span")
                let timetext = document.createTextNode(starttime+'-'+endtime)
                time.appendChild(timetext)
                let c =document.getElementsByClassName('subject')[iii]
                c.appendChild(time);
                time.classList.add('subjecttime')

                let state_ = document.createElement("div")
                let statetext = document.createTextNode('')
                state_.appendChild(statetext)
                let d =document.getElementsByClassName('subject')[iii]
                d.appendChild(state_);
                state_.classList.add('subjectstate')
                iii+=1
            };
        };
    } catch (error) {
        console.error("Error loading JSON file:", error);
    }
}

function init() {
    getjson();
}

document.addEventListener("DOMContentLoaded", init);

setInterval(getD1, 100);
setInterval(highlight, 1000);