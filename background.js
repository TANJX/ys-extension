chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.get('time', function (data) {
    if (!data.time || data.time < 1607893180000) {
      chrome.storage.sync.set({ time: 1607893180000 }, function () {
        console.log('Time set.');
      });
    }
  });
});

const YS = [20, 40, 60, 80, 120, 160];

chrome.storage.local.set({ last_alarm: 0 }, () => {});

chrome.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === 'ys') {
    chrome.storage.sync.get('time', function (data) {
      const full_time = data.time;
      chrome.storage.local.get('last_alarm', function (data) {
        const last_alarm = data.last_alarm;
        const now = Date.now();
        const curr_ys = Math.floor(160 - (full_time - now) / 1000 / 60 / 8);
        console.log('last alarm', last_alarm);
        console.log('curr_ys', curr_ys);
        if (curr_ys != last_alarm && YS.includes(curr_ys)) {
          new Notification(`现在体力：${curr_ys}`, {
            icon: 'img/ys.png',
            body: '冲~',
          });
          chrome.storage.local.set({ last_alarm: curr_ys }, () => {});
          console.log('alarm!');
        }
      });
    });
  }
});

chrome.alarms.clearAll();
chrome.alarms.create('ys', { delayInMinutes: 1, periodInMinutes: 1 });
