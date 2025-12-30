let hls = new Hls();
const video = document.getElementById('video');
const iframeContainer = document.getElementById('iframeContainer');
const iframe = document.getElementById('iframePlayer');

function playStream(url) {
    // আইফ্রেম বন্ধ করে ভিডিও দেখানো
    iframeContainer.style.display = "none";
    iframe.src = "";
    video.style.display = "block";

    if (Hls.isSupported()) {
        hls.destroy();
        hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
            video.play().catch(e => console.log("Auto-play blocked"));
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.play();
    }
}

function playIframe(url) {
    video.pause();
    video.style.display = "none";
    iframeContainer.style.display = "block";
    iframe.src = url;
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

document.addEventListener("fullscreenchange", handleFullscreenChange);
document.addEventListener("webkitfullscreenchange", handleFullscreenChange);