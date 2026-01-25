const video = document.getElementById('video');
const qualitySelect = document.getElementById('qualitySelect');

const extremeConfig = {
    enableWorker: true,
    enableSoftwareAES: false,
    
    // ইনস্ট্যান্ট প্লেব্যাক সেটিংস
    startLevel: 0,                   // সব থেকে লো-কোয়ালিটি দিয়ে স্টার্ট করবে যাতে ক্লিক মাত্রই চলে
    testBandwidth: false,            // ব্যান্ডউইথ টেস্ট করে সময় নষ্ট করবে না
    
    // ৩২০+ আইডিএম স্টাইল ডাটা থ্রাস্টার
    maxBufferLength: 600,            // ১০ মিনিট আগে থেকে লোড করবে
    maxBufferSize: 10000 * 1024 * 1024, // ১ জিবি র‍্যাম বাফার

    // নেটওয়ার্ক কানেকশন বুস্টার
    fLoader: function(config) {
        let loader = new Hls.DefaultConfig.loader(config);
        config.fragLoadingTimeOut = 60000;
        config.fragLoadingMaxRetry = 100;
        config.fragLoadingRetryDelay = 0; // কোনো গ্যাপ ছাড়াই ট্রাই করবে
        return loader;
    },

    // নেটওয়ার্ক অপ্টিমাইজেশন
    abrEwmaDefaultEstimate: 10000000000000000000000000, // ১ জিবিপিএস স্পিড সিগন্যাল
    progressive: true,                  // ডাটা পাওয়া মাত্রই স্ক্রিনে দেখাবে
    maxLoadingDelay: 0,                 // কোনো ওয়েটিং টাইম নেই
    manifestLoadingMaxRetry: 500,
    levelLoadingMaxRetry: 500,
};

let hls = new Hls(extremeConfig);

function playStream(url) {
    if (Hls.isSupported()) {
        hls.destroy(); 
        hls = new Hls(extremeConfig);
        hls.loadSource(url);
        hls.attachMedia(video);
        
        // ক্লিক করার সাথে সাথে ভিডিও ফোর্জ প্লে
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            updateQualityMenu();
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    // যদি ব্রাউজার অটো-প্লে ব্লক করে তবে মিউট করে দিবে যেন ভিডিও না থামে
                    video.muted = true;
                    video.play();
                });
            }
        });

        // এরর রিকোভারি - ভিডিও কখনো থামবে না
        hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        hls.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        hls.recoverMediaError();
                        break;
                    default:
                        hls.destroy();
                        break;
                }
            }
        });

    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.play();
    }
}

function updateQualityMenu() {
    if(!qualitySelect) return;
    qualitySelect.innerHTML = '<option value="-1">Auto (Boost Mode)</option>';
    hls.levels.forEach((level, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.text = level.name || level.height + 'p';
        qualitySelect.appendChild(option);
    });
}

function changeQuality() {
    hls.currentLevel = parseInt(qualitySelect.value);

}

    // ফুলস্ক্রিন ও ওরিয়েন্টেশন লজিক
async function handleFullscreenChange() {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
        if (screen.orientation && screen.orientation.lock) {
            try {
                await screen.orientation.lock("landscape");
            } catch (error) {
                console.log("রোটেশন লক করা যায়নি");
            }
        }
    } else {
        if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
        }
    }
}

function loginUser() {
    let pass= ['pass', '2009'];
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    if(username === "dip" && pass.includes(password)) {
        window.location.href = "tv.html";
        alert('Login successful');
    } else {
        alert('login failed');
    }
}
//imfrem tv url 
function playIframeStream(url) {
    const iframe = document.getElementById('video-iframe');
    const videoElement = document.getElementById('video');
    iframe.style.display = 'block';
    videoElement.style.display = 'none';
    iframe.src = url;
}