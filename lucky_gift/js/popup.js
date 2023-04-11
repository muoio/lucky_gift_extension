let open_tabs = document.getElementById("open_tabs");
let num_tabs = document.getElementById('num_tabs');
let check_time = document.getElementById("check_time");
let auto_start = document.getElementById('auto_start');
let score_auto_start = document.getElementById('score_auto_start');
let click_period = document.getElementById("click_period");

let bet_amount = document.getElementById("bet_amount");
let link = document.getElementById('link');



chrome.storage.local.get(['num_tabs', 'check_time','auto_start','bet_amount','link','score_pivots'],function(data){
    num_tabs.value = parseInt(data.num_tabs);
    check_time.value = parseInt(data.check_time);
    bet_amount.value = data.bet_amount;
    link.value = data.link;
    //click_period.value = data.click_period;
    auto_start.checked = data.auto_start;

    let score_auto_start =  document.getElementsByClassName('score_auto_start');
    let click_period = document.getElementsByClassName('click_period');
    let score_pivots = JSON.parse(data.score_pivots);

    for(let i=0;i<3;++i){
        score_auto_start[i].value = score_pivots[i].score_auto_start;
        click_period[i].value = score_pivots[i].click_period;
        score_auto_start[i].addEventListener('input', function(){
            chrome.storage.local.get('score_pivots', function(data){
                let score_pivots = JSON.parse(data.score_pivots);
                score_pivots[i].score_auto_start = parseInt(score_auto_start[i].value);
                chrome.storage.local.set({score_pivots:JSON.stringify(score_pivots)}); 
            })
        })
        click_period[i].addEventListener('input', function(){
            chrome.storage.local.get('score_pivots', function(data){
                let score_pivots = JSON.parse(data.score_pivots);
                score_pivots[i].click_period = parseInt(click_period[i].value);
                chrome.storage.local.set({score_pivots:JSON.stringify(score_pivots)}); 
            })
        })
    }
});

open_tabs.onclick = function(){
    chrome.storage.local.get(['num_tabs','link'],function(data){
        let link = data.link;
        let num_tabs = parseInt(data.num_tabs);
        let num_opened = 0;
        let interval = setInterval(() => {
            if (num_opened >= num_tabs) clearInterval(interval);
            else {
                chrome.tabs.create({url:link});
                num_opened++;
            }
        }, 0);
    })
}


num_tabs.addEventListener('input',function(){
    chrome.storage.local.set({num_tabs:num_tabs.value});
})

check_time.addEventListener('input',function(){
    chrome.storage.local.set({check_time:check_time.value});
})

auto_start.addEventListener('input',function(){
    chrome.storage.local.set({auto_start:auto_start.checked});
})



bet_amount.addEventListener('input',function(e){
    chrome.storage.local.set({bet_amount:bet_amount.value});
    let score_auto_start =  document.getElementsByClassName('score_auto_start');

    chrome.storage.local.get('score_pivots', function(data){
        let score_pivots = JSON.parse(data.score_pivots);
        let base_score_pivots = [400000,500000,600000];

        for(let i=0;i<3;++i){
            score_pivots[i].score_auto_start = parseInt(bet_amount.value)*base_score_pivots[i]/450;
            score_auto_start[i].value = score_pivots[i].score_auto_start;
        }
        chrome.storage.local.set({score_pivots:JSON.stringify(score_pivots)}); 
    })

})


link.addEventListener('input',function(){
    chrome.storage.local.set({link:link.value});
})
