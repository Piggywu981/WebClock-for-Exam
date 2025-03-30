//import "../package/jquary.js"
//修改下表参数来实现科目更改
let all = []
const subjectlist = {
                    "schedule":[
                        {
                            "date":"2025/3/27",
                            "subject":[
                                {
                                    "sub":"地理",
                                    "starttime":"13:50",
                                    "endtime":"15:20"
                                },
                                {
                                    "sub":"英语",
                                    "starttime":"15:50",
                                    "endtime":"17:20"
                                },
                                //{
                                    //"sub":"生物/地理",
                                    //"starttime":"10:25",
                                    //"endtime":"11:30"
                                //}
                            ]
                        },
                        {
                            "date":"2025/3/28",
                            "subject":[
                                {
                                    "sub":"生物",
                                    "starttime":"08:00",
                                    "endtime":"09:30"
                                },
                                {
                                    "sub":"语文",
                                    "starttime":"09:50",
                                    "endtime":"12:20"
                                },
                                {
                                    "sub":"历史",
                                    "starttime":"13:50",
                                    "endtime":"15:20"
                                },
                                {
                                    "sub":"物理",
                                    "starttime":"15:50",
                                    "endtime":"17:20"
                                }
                            ]
                        },
                        {
                            "date":"2025/3/29",
                            "subject":[
                                {
                                    "sub":"政治",
                                    "starttime":"08:00",
                                    "endtime":"09:30"
                                },
                                {
                                    "sub":"数学",
                                    "starttime":"09:50",
                                    "endtime":"11:50"
                                },
                                {
                                    "sub":"化学",
                                    "starttime":"13:00",
                                    "endtime":"14:30"
                                }
                            ]
                        }
                    ]
                }
let state = []

function  getD1(){
    var date=new Date();
    var d1=date.toLocaleTimeString();
    document.getElementById("date-time").innerHTML =d1; 
}

console.log(state)

function highlight(){
    for( let i = 0 ; i < all.length ; i++){
        let date = all[i].date
        let subject = all[i].subject
        let starttime = all[i].starttime
        let endtime = all[i].endtime
        let classnum = all[i].classnum

        let year = date.split('/')[0]
        let month = date.split('/')[1]-1
        let day = date.split('/')[2]

        let starthour = starttime.split(':')[0]
        let startmin = starttime.split(':')[1]

        let endhour =endtime.split(':')[0]
        let endmin =endtime.split(':')[1]

        let time = new Date().getTime()
        let start = new Date(year,month,day,starthour,startmin).getTime()
        let end = new Date(year,month,day,endhour,endmin).getTime()

        let prepare = new Date(start).getTime()-60*30*1000
        let last = new Date(end).getTime()-60*15*1000
        console.log(state[i],state,i)
        if (time>=start && time<=end){
            if (time>=last && time<end){
                try{
                    let a = document.getElementsByClassName('subject')[classnum]
                    a.classList.replace('none','last')
                }finally{
                    let a = document.getElementsByClassName('subject')[classnum]
                    a.classList.replace('now','last')
                }

                state[classnum][0].state = 'last'

            }else{
                try{
                    let a = document.getElementsByClassName('subject')[classnum]
                    a.classList.replace('none','now')
                }finally{
                    let a = document.getElementsByClassName('subject')[classnum]
                    a.classList.replace('prepare','now')
                }
                state[classnum][0].state = 'now'
            }
        }else if(time>=prepare && time<start){
            let a = document.getElementsByClassName('subject')[classnum]
                a.classList.replace('none','prepare')
            state[classnum][0].state = 'prepare'
        }else if(time<prepare){
            let a = document.getElementsByClassName('subject')[classnum]
                a.classList.replace('none','none')
            state[classnum][0].state = 'none'
        }else if(time>end){
            let a = document.getElementsByClassName('subject')[classnum]
                a.classList.replace('last','none')
            state[classnum][0].state = 'end'
        }
        if (state[classnum][0].state !== state[classnum][0].state_){
            console.log(state[classnum][0].state)
            if(state[classnum][0].state === 'none'){
                let a =document.getElementsByClassName('subjectstate')[classnum]
                a.innerHTML='未开始';
                console.log('1')
                state[classnum][0].state_ =state[classnum][0].state
            }else if(state[classnum][0].state === 'prepare'){
                let a =document.getElementsByClassName('subjectstate')[classnum]
                a.innerHTML='即将开始';
                state[classnum][0].state_ =state[classnum][0].state
            }else if(state[classnum][0].state === 'now'){
                let a =document.getElementsByClassName('subjectstate')[classnum]
                a.innerHTML='正在进行';
                state[classnum][0].state_ =state[classnum][0].state
            }else if(state[classnum][0].state === 'last'){
                let a =document.getElementsByClassName('subjectstate')[classnum]
                a.innerHTML='即将结束';
                state[classnum][0].state_ =state[classnum][0].state
            }else if(state[classnum][0].state === 'end'){
                let a =document.getElementsByClassName('subjectstate')[classnum]
                a.innerHTML='已经结束';
                state[classnum][0].state_ =state[classnum][0].state
            }
        }
    }
}

function getjson(data){
    const schedule = data.schedule
    console.log(schedule)
    let iii = 0
    for(let i = 0 ; i < schedule.length ; i++){
        let thedate = schedule[i].date
        let subject = schedule[i].subject
        let date = document.createElement("div")
        let datetext = document.createTextNode(thedate)
        date.appendChild(datetext)
        let a =document.getElementsByClassName('schedule')[0]
        a.appendChild(date);
        date.classList.add('date')
        for(let ii = 0 ; ii<subject.length ; ii++){
            let sub = subject[ii].sub
            let starttime =subject[ii].starttime
            let endtime = subject[ii].endtime

            let theall = [{"date":thedate,"subject":sub,"starttime":starttime,"endtime":endtime,"classnum":iii}]
            all =[...all,...theall]

            let thestate = [{state:'none',state_:'1'}]
            state =[...state,thestate]

            console.log(state)

            let subjectt = document.createElement("div")
            let a =document.getElementsByClassName('date')[i]
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
}

function init(){
    getjson(subjectlist)
}

setInterval(getD1,[100])
setInterval(highlight,[1000])
