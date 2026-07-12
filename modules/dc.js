export function initDc() {
    const container = document.getElementById('dc-container');
    if (container) {
        container.innerHTML = `<iframe src="dc.html" style="width:100%;height:calc(100vh - 80px);border:none;border-radius:16px;"></iframe>`;
    }
}