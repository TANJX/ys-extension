chrome.storage.sync.get('time', function(data) {
    update(data.time);
});

const YS = [20, 40, 60, 80, 120, 160];
const OP = [20, 40, 60];
const div = document.getElementById('data');
const current = document.getElementById('current');

function update(full_time) {
    div.innerHTML = '';
    const now = Date.now();
    const curr_ys = 160 - (full_time - now) / 1000 / 60 / 8;
    current.innerText = `${Math.floor(curr_ys)}`
    YS.forEach(t => {
        if (curr_ys < t) {
            const date = new Date(now + (t - curr_ys) * 8 * 60 * 1000);
            const h = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`;
            const m = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;
            const day = date.getDay() === (new Date()).getDay() ? "今天" : "明天";
            const p = document.createElement('p');
            p.innerText = `${t}体力: ${day}${h}:${m}`;
            div.append(p);
        }
    });
}

OP.forEach(op => {
    document.getElementById(`m${op}`).onclick = function(element) {
        chrome.storage.sync.get('time', function(data) {
            const curr_ys = 160 - (data.time - Date.now()) / 1000 / 60 / 8;
            if (curr_ys < op) {
                return;
            }
            const newTime = data.time + op * 8 * 60 * 1000;
            chrome.storage.sync.set({time: newTime}, function() {
                update(newTime);
              });
        });
    };
    document.getElementById(`p${op}`).onclick = function(element) {
        chrome.storage.sync.get('time', function(data) {
            const newTime = data.time - op * 8 * 60 * 1000;
            chrome.storage.sync.set({time: newTime}, function() {
                update(newTime);
              });
        });
    };
})