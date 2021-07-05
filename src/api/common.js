
// 身份类型
export function _idTypeStr(type) {
    let typeStr = '';
    switch (type) {
        case 1:
            typeStr = "银行(网点负责人)";
            break;
        case 2:
            typeStr = "保洁员（驻点）";
            break;
        case 3:
            typeStr = "保洁员（机动）";
            break;
        case 4:
            typeStr = "巡检";
            break;
        case 5:
            typeStr = "区域经理";
            break;
        case 6:
            typeStr = "项目经理";
            break;
        case 7:
            typeStr = "银行(区域负责人)";
            break;
        case 8:
            typeStr = "银行(项目负责人)";
            break;
        default:
            break;
    }
    return typeStr;
}

// 回显周选项
export function _getWeekList(weekNum) {
    console.log(weekNum)
    let list = [];
    if ((weekNum & 1) === 1) {
        list.push(1);
    }
    if ((weekNum & 2) === 2) {
        list.push(2);
    }
    if ((weekNum & 4) === 4) {
        list.push(4);
    }
    if ((weekNum & 8) === 8) {
        list.push(8);
    }
    if ((weekNum & 16) === 16) {
        list.push(16);
    }
    if ((weekNum & 32) === 32) {
        list.push(32);
    }
    if ((weekNum & 64 )=== 64) {
        list.push(64);
    }
    return list;
}


