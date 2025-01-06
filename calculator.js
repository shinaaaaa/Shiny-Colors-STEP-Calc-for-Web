// 初期化
let requiredStatusPoint = 0; // ステータスの次の成長に必要な熟練度
let requiredLimitPoint = 0; // ステータス上限の次の成長に必要な熟練度
let requiredStatusTeamworkPoint = 0; // ステータスの次の成長に必要な団結力
let requiredLimitTeamworkPoint = 0; // ステータス上限の次の成長に必要な団結力
let initialTeamwork = 0; // 団結力の初期値

/**
 * 特化ステータス/上限の次の成長に必要な熟練度と団結力を計算する関数
 * @param {number} count 成長回数
 * @returns {Object} 必要ポイント情報 { point, teamworkPoint }
 */
function calculateRequiredPoint(count) {
    let point = 0;
    let teamworkPoint = 0;

    if (count >= 0 && count < 30) {
        point = 10;
        teamworkPoint = 0;
    } else if (count >= 30 && count < 60) {
        point = 15;
        teamworkPoint = 0;
    } else if (count >= 60 && count < 90) {
        point = 20;
        teamworkPoint = 1;
    } else if (count >= 90 && count < 120) {
        point = 30;
        teamworkPoint = 2;
    } else if (count >= 120 && count < 150) {
        point = 40;
        teamworkPoint = 3;
    } else if (count >= 150 && count < 230) {
        point = 50;
        teamworkPoint = 4;
    }

    return { point, teamworkPoint };
}

/**
 * メインロジックを実行し、結果を表示
 */
function executeCalculation() {
    // HTMLフォームから値を取得
    const status = parseInt(document.getElementById("status").value, 10);
    const statusLimit = parseInt(document.getElementById("statusLimit").value, 10);
    const proficiency = parseInt(document.getElementById("proficiency").value, 10);
    const teamwork = parseInt(document.getElementById("teamwork").value, 10);
    const statusCount = parseInt(document.getElementById("statusCount").value, 10);
    const statusLimitCount = parseInt(document.getElementById("statusLimitCount").value, 10);

    // バリデーションチェック
    if (
        status < 0 || status > 5000 ||
        statusLimit < 500 || statusLimit > 5000 ||
        proficiency < 0 || proficiency > 9999 ||
        teamwork < 0 || teamwork > 9999 ||
        statusCount < 0 || statusCount > 230 ||
        statusLimitCount < 0 || statusLimitCount > 140
    ) {
        alert("入力値が正しくありません。範囲内の値を入力してください。");
        return;
    }

    // 初期状態の変数を設定
    let currentStatus = status;
    let currentStatusLimit = statusLimit;
    let currentProficiency = proficiency;
    let currentTeamwork = teamwork;
    let currentStatusCount = statusCount;
    let currentStatusLimitCount = statusLimitCount;

    initialTeamwork = teamwork;

    // 成長判定ループ
    while (
        (currentProficiency >= requiredStatusPoint && currentTeamwork >= requiredStatusTeamworkPoint) ||
        (currentProficiency >= requiredLimitPoint && currentTeamwork >= requiredLimitTeamworkPoint && currentStatusCount < 230)
        ) {
        const statusGrowth = calculateRequiredPoint(currentStatusCount);
        const limitGrowth = calculateRequiredPoint(currentStatusLimitCount);

        requiredStatusPoint = statusGrowth.point;
        requiredStatusTeamworkPoint = statusGrowth.teamworkPoint;

        requiredLimitPoint = limitGrowth.point;
        requiredLimitTeamworkPoint = limitGrowth.teamworkPoint;

        if (
            currentStatus + 10 <= currentStatusLimit &&
            currentProficiency >= requiredStatusPoint &&
            currentTeamwork >= requiredStatusTeamworkPoint &&
            currentStatusCount < 230
        ) {
            currentStatus += 10;
            currentProficiency -= requiredStatusPoint;
            currentTeamwork -= requiredStatusTeamworkPoint;
            currentStatusCount++;
        } else if (
            currentProficiency >= requiredLimitPoint &&
            currentStatusLimit - currentStatus <= 10 &&
            currentProficiency >= 2 * requiredStatusPoint &&
            currentTeamwork >= requiredLimitTeamworkPoint &&
            currentStatusLimitCount < 140
        ) {
            currentStatusLimit += 10;
            currentProficiency -= requiredLimitPoint;
            currentTeamwork -= requiredLimitTeamworkPoint;
            currentStatusLimitCount++;
        } else if (
            currentStatus < currentStatusLimit &&
            currentProficiency >= requiredStatusPoint &&
            currentTeamwork >= requiredStatusTeamworkPoint &&
            currentStatusCount < 230
        ) {
            currentStatus = currentStatusLimit;
            currentProficiency -= requiredStatusPoint;
            currentTeamwork -= requiredStatusTeamworkPoint;
            currentStatusCount++;
        } else {
            break;
        }
    }

    // 結果を表示
    const resultContainer = document.getElementById("result");
    resultContainer.innerHTML = `
        <p>特化ステータス: ${currentStatus}</p>
        <p>特化上限: ${currentStatusLimit}</p>
        <p>累計特化ステータス成長回数: ${currentStatusCount}</p>
        <p>累計特化上限成長回数: ${currentStatusLimitCount}</p>
        <p>残り熟練度: ${currentProficiency}</p>
        <p>残り団結力: ${currentTeamwork}</p>
        <p>SP変換可能回数: ${Math.floor(currentTeamwork / 30)}</p>
        <p>SP変換値: ${Math.floor(currentTeamwork / 30) * 10}</p>
        <p>SP変換後残り団結力: ${initialTeamwork - 30 * Math.floor(currentTeamwork / 30)}</p>
    `;
}

// ボタンにイベントリスナーを登録
document.getElementById("calculate-button").addEventListener("click", executeCalculation);