

// 获取ul元素和行模板
const list = document.querySelector("ul");
const rowTemplate = document.querySelector("#li_template");

// 添加行
function addRow() {
  // 从行模板创建一个新行
  const newRow = document.importNode(rowTemplate.content, true);
  const addBtn = newRow.querySelector("#addRow");
  const delBtn = newRow.querySelector("#deleteRow");
  // 添加按钮点击事件
  addBtn.addEventListener("click", addRow);

  // 删除按钮点击事件
  delBtn.addEventListener("click", deleteRow);
  const searchBtn = newRow.querySelector("#search");

  searchBtn.addEventListener("click", search)
  list.appendChild(newRow);
  // 把新行添加到ul元素
}

// 删除行
function deleteLastRow() {
  // 获取最后一个li元素，如果没有则退出函数
  const lastRow = list.querySelector("li:last-child");
  if (!lastRow) return;

  // 从ul元素中删除最后一个li元素
  list.removeChild(lastRow);
}
function deleteRow(){
  // 获取当前选中的li元素
  const currentLi = this.closest('li');
  // 如果存在，则将其从DOM中删除
  if (currentLi) {
    currentLi.remove();
  }
}


// 获取保存按钮
const saveBtn = document.querySelector("#saveBtn");

// 保存输入数据
function save() {
  // 获取所有描素和url
  const descriptions = document.querySelectorAll(".description");
  const urls = document.querySelectorAll(".url");

  // 创建一个空数组用于存储数据
  const data = [];

  // 循环遍历每个输入框，将它们的值添加到数据数组中
  for (let i = 0; i < descriptions.length; i++) {
    // 获取description和url的值
    const description = descriptions[i].value;
    const url = urls[i].value;

    // 如果description或url为空，则跳过此项
    if (!description || !url) continue;

    // 否则将当前项添加到数据数组中
    data.push({ description, url });
  }

  //将数据保存到chrome.storage中
  chrome.storage.sync.set({ 'searchAssistantData': data }, function () {
    console.log('Data saved successfully');
  });
  reloadMenu();
}

// 绑定保存按钮的点击事件
saveBtn.addEventListener("click", save);

// const searchBtn = document.querySelector("#search");
function search(){
  const searchInput = document.querySelector("#search-input")
  const currentLi = this.closest('li');
    // 如果存在，则将其从DOM中删除
    if (currentLi) {
      const currentUrl = currentLi.querySelector('.url').value;
      console.log(currentUrl);
      const url = currentUrl.replace('%s', encodeURI(searchInput.value));
      console.log(url)
      // chrome.tabs.create({
      // //  const url = currentUrl.replace('%s', encodeURI(searchInput));
      chrome.tabs.create({
        url: url
        });
    }  

}

// 查看chrome.storage中是否有数据
chrome.storage.sync.get(['searchAssistantData'], function (result) {
  // 如果有则将其加载到页面中
  if (result?.searchAssistantData) {
    const savedData = result.searchAssistantData;

    // 循环遍历每个保存项，将其添加到页面上
    savedData.forEach(item => {
      // 克隆行模板创建一个新行
      const newRow = document.importNode(rowTemplate.content, true);
      // 获取添加和删除按钮
      const addBtn = newRow.querySelector("#addRow");
      const delBtn = newRow.querySelector("#deleteRow");
      const searchBtn = newRow.querySelector("#search");

      // 添加按钮点击事件
      addBtn.addEventListener("click", addRow);

      // 删除按钮点击事件
      delBtn.addEventListener("click", deleteRow);
      searchBtn.addEventListener("click", search);
      // 将description和url添加到新行中
      newRow.querySelector(".description").value = item.description;
      newRow.querySelector(".url").value = item.url;

      // 将新行添加到ul元素中
      list.appendChild(newRow);
    });
  } else{
    addRow()
  }
});



function reloadMenu(){
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
          contexts: ['selection']
        });
      });
    }
  });
}