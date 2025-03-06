const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('capture');
const downloadBtn = document.getElementById('download');

// 1️⃣ 📷 カメラを起動
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        console.error("カメラ起動エラー:", err);
        alert("カメラのアクセスを許可してください！");
    });

// 2️⃣ ✨ 撮影して Canvas に描画
captureBtn.addEventListener('click', () => {
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 3️⃣ 📂 画像をダウンロードできるようにする
    canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        downloadBtn.href = url;
    }, "image/jpeg");
});

// 4️⃣ 📏 ガイド枠のサイズ調整
function updateGuideFrame() {
    const guideFrame = document.getElementById('guide-frame');
    if (window.innerWidth > window.innerHeight) {
        guideFrame.style.width = "80vw";
        guideFrame.style.height = "45vw";
    } else {
        guideFrame.style.width = "45vh";
        guideFrame.style.height = "25vh";
    }
}
window.addEventListener('resize', updateGuideFrame);
window.onload = updateGuideFrame;

// 5️⃣ 🛠 PWA の Service Worker 登録
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
        .then(() => console.log("✅ Service Worker 登録成功"))
        .catch(error => console.log("❌ Service Worker 登録失敗", error));
}
