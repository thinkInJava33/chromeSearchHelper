


// chrome.contextMenus.create({
//     id: 'mtrace-prod',
//     title: '查看Mtrace-PROD：%s',
//     contexts: ['selection']
// });

// chrome.contextMenus.create({
//     id: 'mtrace-test',
//     title: '查看Mtrace-TEST：%s',
//     contexts: ['selection']
// });



// chrome.contextMenus.onClicked.addListener(function(info, tab) {
//     switch(info.menuItemId){
//         case 'mtrace-prod':
//             chrome.tabs.create({url: 'https://mtrace.sankuai.com/trace/' + encodeURI(info.selectionText)});
//             break;
//         case 'mtrace-test':
//             chrome.tabs.create({url: 'http://mtrace.inf.dev.sankuai.com/trace/' + encodeURI(info.selectionText)});
//             break;
//     }
// });

// 读取存储在本地的data
chrome.storage.sync.get(['searchAssistantData'], function (result) {
    // 删除所有菜单项
    chrome.contextMenus.removeAll(function() {
        console.log("所有菜单项已删除");
    });
      // 如果存在，则读取其中的description和url数组
    console.log(result.searchAssistantData)
    if (result.searchAssistantData) {
      // 遍历每个url，创建对应的右键菜单项
      result.searchAssistantData.forEach((item, index) => {
        const { description, url } = item;
        chrome.contextMenus.create({
          id: url,
          title: description + ':%s',
          contexts: ['selection'],
        
        });
      });
    }
  });
chrome.contextMenus.onClicked.addListener((info, tab) => {
// 如果触发事件的菜单项是我们所创建的菜单项
if (info.menuItemId ) {
//   // 获取菜单项的索引
//   const index = parseInt(info.menuItemId.substring(10));
    // 拼接选中的内容和对应的URL
    const url = info.menuItemId.replace('%s', encodeURI(info.selectionText));
    // 在新的选项卡中打开URL
    console.log('当前' + url)
    chrome.tabs.create({
    url: url
    });
}
});


