

chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        chrome.storage.local.set({num_tabs:1});
        chrome.storage.local.set({state_red:false});
        chrome.storage.local.set({wait_time:5}); 
        chrome.storage.local.set({check_time:1}); 
        chrome.storage.local.set({bet_amount:450});
        chrome.storage.local.set({status:"STOP"});
        chrome.storage.local.set({click_period:500}); 

        let score_pivots = [{score_auto_start:400000,click_period:1000},
            {score_auto_start:500000,click_period:500},
            {score_auto_start:600000,click_period:250}];
        chrome.storage.local.set({score_pivots:JSON.stringify(score_pivots)}); 
        chrome.storage.local.set({link: "https://www.nimo.tv/fragments/act/lucky-gift"}); 
    }        
});

