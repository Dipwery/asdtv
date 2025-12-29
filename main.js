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
