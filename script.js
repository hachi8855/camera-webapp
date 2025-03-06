// DOM要素を取得
const video = document.getElementById('camera-view');
const captureButton = document.getElementById('capture-button');
const capturedImage = document.getElementById('captured-image');
const downloadLink = document.getElementById('download-link');
const errorMessage = document.getElementById('error-message');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// メディアストリームを保持する変数
let mediaStream = null;

// カメラ初期化関数
async function initCamera() {
    try {
        // エラーメッセージを非表示に
        errorMessage.style.display = 'none';
        
        // カメラ設定 - A4横向き撮影に最適化（16:9に近い解像度で高画質）
        const constraints = {
            video: {
                facingMode: 'environment', // リアカメラ優先
                width: { ideal: 1920 },    // 高解像度に設定
                height: { ideal: 1080 },
                aspectRatio: { ideal: 16/9 } // A4横向きに最適なアスペクト比
            }
        };

        // カメラアクセスを要求
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        // メディアストリームをビデオ要素に設定
        video.srcObject = mediaStream;
        
        // iOS Safariでの問題に対応するため、読み込み完了後に再生
        video.onloadedmetadata = function() {
            // ビデオのサイズをキャンバスに設定
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            // ビデオ再生
            video.play()
                .then(() => {
                    console.log('Camera started successfully');
                    // カメラ起動成功時にボタンを有効化
                    captureButton.disabled = false;
                })
                .catch(e => {
                    console.error('Video play error:', e);
                    showError('カメラの起動に失敗しました。ブラウザの設定でカメラへのアクセスを許可してください。');
                });
        };
        
        // エラーハンドリング
        video.onerror = function() {
            showError('ビデオストリームの処理中にエラーが発生しました。');
        };
        
    } catch (error) {
        console.error('Camera initialization error:', error);
        showError('カメラの初期化に失敗しました。ブラウザの設定でカメラへのアクセスを許可してください。');
    }
}

// エラーメッセージを表示する関数
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    captureButton.disabled = true;
}

// 画面の向きが変わった時にカメラを再初期化
window.addEventListener('orientationchange', function() {
    // 少し遅延を入れてレイアウト変更完了後に実行
    setTimeout(function() {
        // カメラの再起動
        stopCamera();
        initCamera();
    }, 500);
});

// カメラを停止する関数
function stopCamera() {
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => {
            track.stop();
        });
    }
}

// 撮影ボタンのクリックイベント
captureButton.addEventListener('click', function() {
    if (video.readyState === 4) { // HAVE_ENOUGH_DATA
        // キャンバスにビデオフレームを描画
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // A4向けに高画質設定
        const imageUrl = canvas.toDataURL('image/jpeg', 0.95); // 高画質設定
        
        // 画像をImg要素に設定
        capturedImage.src = imageUrl;
        capturedImage.style.display = 'block';
        
        // ダウンロードリンクを設定（日付を含むシンプルな名前）
        const now = new Date();
        const dateStr = now.getFullYear() + 
                      ('0' + (now.getMonth() + 1)).slice(-2) + 
                      ('0' + now.getDate()).slice(-2) + '-' + 
                      ('0' + now.getHours()).slice(-2) + 
                      ('0' + now.getMinutes()).slice(-2);
        
        downloadLink.href = imageUrl;
        downloadLink.download = 'document-' + dateStr + '.jpg';
        downloadLink.style.display = 'inline-block';
        
        // 撮影後のUIを表示
        document.getElementById('captured-area').style.display = 'block';
    } else {
        console.warn('Video not ready yet');
    }
});

// 新しい写真を撮るボタン
document.getElementById('new-capture-button').addEventListener('click', function() {
    // 撮影したイメージを非表示に
    document.getElementById('captured-area').style.display = 'none';
});

// ページ読み込み完了時にカメラを初期化
document.addEventListener('DOMContentLoaded', initCamera);

// ページを離れる際にカメラを停止
window.addEventListener('beforeunload', stopCamera);