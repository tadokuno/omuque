document.getElementById('uploadForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // ファイルアップロード処理をシミュレート（ここに実際の処理を追加）
    setTimeout(function () {
        // アップロード完了後に完了メッセージを表示
        document.getElementById('completeMessage').style.display = 'block';
    }, 1000); // 1秒後に完了表示
});
