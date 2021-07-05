const local = {
    // 存储单个属性
    set: function (key, value) {
        localStorage[key] = value;
    },
    // 读取单个属性
    get: function (key, defaultValue) {
        return localStorage[key] || defaultValue;
    },
    // 存储对象，以JSON格式存储
    setObject: function (key, value) {
        localStorage[key] = JSON.stringify(value); // 将对象以字符串保存
    },
    // 读取对象
    getObject: function (key) {
        return JSON.parse(localStorage[key] || '{}'); // 获取字符串并解析成对象
    },
    // 删除指定存储对象
    removeItem: function (key) {
        localStorage.removeItem(key);
    },
    // 清空所有存储对象
    clear: function () {
        localStorage.clear();
    }
}

export default local;