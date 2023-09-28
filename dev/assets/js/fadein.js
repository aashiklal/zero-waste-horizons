
// 获取line-chart和tree-map元素
const lineChart = document.querySelector('.linechart');
const treeMap = document.querySelector('.treemap');

// 检测滚动事件
window.addEventListener('scroll', () => {
    // 获取line-chart和tree-map元素的位置信息
    const lineChartRect = lineChart.getBoundingClientRect();
    const treeMapRect = treeMap.getBoundingClientRect();

    // 计算视口的顶部和底部
    const viewportTop = window.scrollY;
    const viewportBottom = viewportTop + window.innerHeight;

    // 如果line-chart进入视口，显示它
    if (lineChartRect.top <= viewportBottom && lineChartRect.bottom >= viewportTop) {
        lineChart.style.display = 'inline-flex';
    }

    // 如果tree-map进入视口，显示它
    if (treeMapRect.top <= viewportBottom && treeMapRect.bottom >= viewportTop) {
        lineChart.style.display = 'inline-flex';

    }
});