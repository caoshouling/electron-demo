
window.onload=function(){
    //测试 渲染进程 -> 主进程的通讯
    let syncSendBnt = document.getElementById("syncSendBnt");
    syncSendBnt.addEventListener('click',()=>{
        window.electronAPI.setTitle1('render.js - Sync message')
    })
    let asyncSendBnt = document.getElementById("asyncSendBnt");
    asyncSendBnt.addEventListener('click',()=>{
        window.electronAPI.setTitle2('render.js - Async message')
    })

   // 测试 主进程 <-> 渲染进程(双向)
    const btn = document.getElementById('btn')
    const filePathElement = document.getElementById('filePath')

    btn.addEventListener('click', async () => {
        const filePath = await window.electronAPI.openFile()
        filePathElement.innerText = filePath
    })

    // 测试 主进程 -> 渲染进程的通讯
    const counter = document.getElementById('counter')

    window.electronAPI.onUpdateCounter((value) => {
        const oldValue = Number(counter.innerText)
        const newValue = oldValue + value
        counter.innerText = newValue.toString()
        window.electronAPI.counterValue(newValue)
    })
    
}


