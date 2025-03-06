const video = document.getElementById('video');
const captureBtn = document.getElementById('capture');
const downloadBtn = document.getElementById('download');
const canvas = document.getElementById('canvas');

// 📌 背面カメラを優先してカメラを起動する
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: { ideal: "environment" } // 外カメラ（背面カメラ）を優先
            }
        });
        video.srcObject = stream;
    } catch (error) {
        console.error("カメラの起動に失敗:", error);
        alert("カメラにアクセスできませんでした。設定を確認してください。");
    }
}

// 📌 撮影処理（撮影後にダウンロード可能にする）
captureBtn.addEventListener('click', () => {
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 撮影画像をダウンロード用に設定
    canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        downloadBtn.href = url;
        downloadBtn.style.display = "block"; // ダウンロードボタンを表示
    }, "image/jpeg");
});

// 📌 カメラ起動
window.addEventListener("load", startCamera);
