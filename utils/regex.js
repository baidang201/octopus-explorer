// 校验
import PATTERN from './pattern.js'

export default {
    // 判断是不是数字
    isNum(str) {
        if (!PATTERN.NUMBER.test(str)) {
            return false
        }

        if (str === '') {
            return false
        }
        if (isNaN(Number(str))) {
            return false
        }
        return true
    },
    // 判断是不是合法hash
    isHashLegal(str) {
        return PATTERN.HASH.test(str)
    }
}
