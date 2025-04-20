import sha512 from "crypto-js/sha512"
import sha256 from "crypto-js/sha256"
import Hex from "crypto-js/enc-hex"
import Base64 from "crypto-js/enc-base64"

const VERSION_NAME = "MokaV2"
const DEFAULT_PLATFORM_ID = "takuron.com"

// --- 替换规则定义 ---
const nlseReplacements: Record<string, string> = {
    'o': '!', 'O': '?', '0': '*', 'L': '{', 'l': '}', 'I': '[', 'i': ']', '=': '#', '/': '&'
};
const nlReplacements: Record<string, string> = {
    '=': 'P', '/': 'Q'
};
const nlsReplacements: Record<string, string> = {
    '=': '!', '/': '?'
};

// --- 辅助函数：创建映射函数 ---
/**
 * 根据提供的替换规则创建一个执行字符替换的函数。
 * 这个函数会预先编译好正则表达式以提高性能。
 * @param replacements 一个包含 '要查找的字符': '替换成的字符' 的对象。
 * @returns 一个接受字符串并返回替换后字符串的函数。
 */
function createMappingFunction(replacements: Record<string, string>): (input: string) => string {
    // 1. 获取所有需要被替换的字符 (map 的键)
    const keysToReplace = Object.keys(replacements);

    // 2. 如果没有需要替换的字符，直接返回原字符串的函数
    if (keysToReplace.length === 0) {
        return (input: string) => input;
    }

    // 3. 转义正则表达式中的特殊字符，防止它们被解释为正则元字符
    //    比如，'?' 需要被转义成 '\?'
    const escapedKeys = keysToReplace.map(key =>
        key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& 表示匹配到的整个字符串
    );

    // 4. 创建一个正则表达式，匹配所有需要替换的字符 (用 '|' 连接)
    //    'g' 标志表示全局匹配 (替换所有出现的匹配项)
    //    这个 RegExp 对象只在 createMappingFunction 调用时创建一次！
    const regex = new RegExp(escapedKeys.join('|'), 'g');

    // 5. 返回实际执行替换的函数 (这是一个闭包，可以访问外部的 regex 和 replacements)
    return (input: string): string => {
        // 使用 String.prototype.replace 和一个回调函数
        // 回调函数接收匹配到的字符 (match)，并从 replacements 中查找对应的替换字符
        return input.replace(regex, (match) => replacements[match]);
    };
}

export default {
    mappingNLSE: createMappingFunction(nlseReplacements),
    mappingNL: createMappingFunction(nlReplacements),
    mappingNLS: createMappingFunction(nlsReplacements),
    DEFAULT_PLATFORM_ID: DEFAULT_PLATFORM_ID,
    mokaPasswordV2: mokaPasswordV2
}

function mokaPasswordV2(
    pwd: string,
    key: string,
    mapping: (wordBase64: string) => string,
    legend: number = 16,
    platformId: string = DEFAULT_PLATFORM_ID
): string {
    if(pwd===""||key===""||legend>39)
        return ""

    let pwdSha256 = Hex.stringify(sha256(pwd))
    //$versionName:$platformId:$distinguishCode:sha256_hex($passwordSource):$passwordLength
    let combineSource = `${VERSION_NAME}:${platformId}:${key}:${pwdSha256}:${legend}`
    let mappingStr = mapping(Base64.stringify(sha512(combineSource)))

    return mappingStr.slice(legend,legend*2)
}


