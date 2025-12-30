function playStream(url) {
    const video = document.getElementById('video');

    // HLS.js সাপোর্ট চেক করা
    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
            video.play();
        });

        // এরর হ্যান্ডলিং (ঐচ্ছিক)
        hls.on(Hls.Events.ERROR, function (event, data) {
            if (data.fatal) {
                console.error("HLS Error:", data);
            }
        });

    } 
    // যদি ব্রাউজারে বিল্ট-ইন HLS সাপোর্ট থাকে (যেমন: Safari)
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.addEventListener('loadedmetadata', function() {
            video.play();
        });
    } else {
        alert("আপনার ব্রাউজার এই ভিডিও ফরম্যাট সাপোর্ট করে না।");
    }
}





const videoElement = document.getElementById('video');

// ফুলস্ক্রিন ইভেন্ট ডিটেক্ট করার জন্য লিসেনার
document.addEventListener("fullscreenchange", handleFullscreenChange);
document.addEventListener("webkitfullscreenchange", handleFullscreenChange); // সাফারি/পুরানো ব্রাউজারের জন্য
document.addEventListener("mozfullscreenchange", handleFullscreenChange); // ফায়ারফক্সের জন্য
document.addEventListener("msfullscreenchange", handleFullscreenChange); // IE/Edge এর জন্য

async function handleFullscreenChange() {
    // চেক করা হচ্ছে ইউজার কি ফুলস্ক্রিনে ঢুকেছে নাকি বের হয়েছে
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
        
        // ফুলস্ক্রিনে ঢুকলে ল্যান্ডস্কেপ মোড লক করো
        if (screen.orientation && screen.orientation.lock) {
            try {
                await screen.orientation.lock("landscape");
            } catch (error) {
                console.log("রোটেশন লক করা যায়নি: ", error);
                // কিছু ব্রাউজারে বা ডিভাইসে পারমিশন না থাকলে এটা কাজ নাও করতে পারে
            }
        }
    } else {
        // ফুলস্ক্রিন থেকে বের হলে ওরিয়েন্টেশন আনলক করো (ডিফল্ট অবস্থায় ফিরে যাও)
        if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
        }
    }
}