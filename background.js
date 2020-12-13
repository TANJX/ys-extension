chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.get('time', function(data) {
      if (!data.time || data.time < 1607893180000) {
        chrome.storage.sync.set({time: 1607893180000}, function() {
          console.log('Time set.');
        });
      }
    });
});

let last_alarm = 0;
const YS = [20, 40, 60, 80, 120, 160];

chrome.alarms.onAlarm.addListener(function( alarm ) {
  if (alarm.name === 'ys') {
    chrome.storage.sync.get('time', function(data) {
      const now = Date.now();
      const curr_ys = Math.floor(160 - (data.time - now) / 1000 / 60 / 8);
      console.log(curr_ys);
      if (curr_ys != last_alarm && YS.includes(curr_ys)) {
        new Notification(`现在体力：${curr_ys}`, {
          icon: 'img/ys.png',
          body: '冲~'
        });
        last_alarm = curr_ys;
      }
    });
  }
});

chrome.alarms.clearAll();
chrome.alarms.create('ys', {delayInMinutes: 1, periodInMinutes: 1});