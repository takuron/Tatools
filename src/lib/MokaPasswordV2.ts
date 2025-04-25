import sha512 from "crypto-js/sha512";
import sha256 from "crypto-js/sha256";
import Hex from "crypto-js/enc-hex";
import Base64 from "crypto-js/enc-base64";

// --- 常量定义 ---
const VERSION_NAME = "MokaV2"; // 内部版本标识
const DEFAULT_PLATFORM_ID = "takuron.com"; // 默认平台标识符
const MAX_LENGTH = 39; // 原始逻辑允许的最大长度 (legend)

// --- 替换规则定义 (内部使用) ---
const nlseReplacements: Record<string, string> = {
    'o': '!', 'O': '?', '0': '*', 'L': '{', 'l': '}', 'I': '[', 'i': ']', '=': '#', '/': '&'
};
const nlReplacements: Record<string, string> = {
    '=': 'P', '/': 'Q'
};
const nlsReplacements: Record<string, string> = {
    '=': '!', '/': '?'
};

// --- 内部辅助函数：创建映射函数 ---
/**
 * 根据提供的替换规则创建一个执行字符替换的函数。
 * @param replacements - 一个包含 '要查找的字符': '替换成的字符' 的对象。
 * @returns 一个接受字符串并返回替换后字符串的函数。
 * @internal
 */
function createMappingFunction(replacements: Record<string, string>): (input: string) => string {
    const keysToReplace = Object.keys(replacements);
    if (keysToReplace.length === 0) {
        return (input: string) => input;
    }
    // 预编译正则表达式以提高性能
    const escapedKeys = keysToReplace.map(key =>
        key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );
    const regex = new RegExp(escapedKeys.join('|'), 'g');
    return (input: string): string => {
        return input.replace(regex, (match) => replacements[match]);
    };
}

// 预先创建内部使用的映射函数实例
const mappingFunctions = {
    NLSE: createMappingFunction(nlseReplacements),
    NL: createMappingFunction(nlReplacements),
    NLS: createMappingFunction(nlsReplacements),
    None: (input: string) => input, // 提供一个无操作的映射类型
};

/**
 * 定义生成派生密码所需的配置选项。
 */
export interface MokaPasswordV2Options {
    /**
     * @description 用户的原始密码或主密码。这是必须的。
     */
    passwordSource: string;

    /**
     * @description 用于区分不同用途的密钥或标识符（例如，网站域名、用户名等）。这是必须的。
     */
    distinguishKey: string;

    /**
     * @description 选择应用于最终哈希结果的字符替换映射类型。
     * - 'NLSE': 数字(N)、字母(L)、符号(S)增强(E)替换，规则较为复杂。
     * - 'NL':   仅对Base64中的特定符号进行数字/字母替换。
     * - 'NLS':  仅对Base64中的特定符号进行其他符号替换。
     * - 'None': 不执行任何字符替换。
     * @default 'NLSE'
     */
    mappingType?: 'NLSE' | 'NL' | 'NLS' | 'None';

    /**
     * @description 最终生成密码的期望长度。这个值也用于内部哈希计算和切片逻辑。
     * 注意：长度必须大于 0 且不应超过 39，否则将返回空字符串。
     * @default 16
     */
    length?: number;

    /**
     * @description 一个可选的平台或应用标识符，用于哈希计算。
     * @default "takuron.com"
     */
    platformId?: string;
}

/**
 * 根据用户输入和配置，使用 MokaV2 算法生成一个确定性的派生密码。
 *
 * 此函数基于原始密码、区分密钥、平台标识符和长度，通过一系列哈希和（可选的）字符映射
 * 来生成一个不易直接反推原始密码的派生密码。适用于为不同服务生成不同的、但可重现的密码。
 *
 * @param {MokaPasswordV2Options} options - 包含所有生成参数的配置对象。
 * @param {string} options.passwordSource - 用户的原始密码。
 * @param {string} options.distinguishKey - 用于区分密码用途的密钥（如网站域名）。
 * @param {'NLSE' | 'NL' | 'NLS' | 'None'} [options.mappingType='NLSE'] - 应用于结果的字符映射类型。
 * @param {number} [options.length=16] - 最终密码的长度 (1-39)。
 * @param {string} [options.platformId='takuron.com'] - 平台标识符。
 *
 * @returns {string} 生成的派生密码字符串。如果输入无效（如密码或密钥为空、长度超出范围），则返回空字符串。
 *
 * @example
 * // 示例 1: 使用默认选项生成密码
 * const password = mokaPasswordV2({
 *   passwordSource: "mysecretpassword",
 *   distinguishKey: "example.com"
 * });
 * console.log(password); // 输出基于默认设置 (长度16, NLSE映射) 的密码
 *
 * @example
 * // 示例 2: 指定长度和不同的映射类型
 * const shortPassword = mokaPasswordV2({
 *   passwordSource: "another_pwd",
 *   distinguishKey: "service-app",
 *   length: 10,
 *   mappingType: 'NL'
 * });
 * console.log(shortPassword); // 输出长度为10, 使用NL映射的密码
 *
 * @example
 * // 示例 3: 不使用任何字符映射
 * const noMapPassword = mokaPasswordV2({
 *   passwordSource: "password123",
 *   distinguishKey: "github.com",
 *   length: 20,
 *   mappingType: 'None'
 * });
 * console.log(noMapPassword); // 输出长度为20, 未经字符映射的密码
 *
 * @example
 * // 示例 4: 指定自定义平台ID
 * const customPlatformPwd = mokaPasswordV2({
 *   passwordSource: "mysecretpassword",
 *   distinguishKey: "example.com",
 *   platformId: "my-custom-app"
 * });
 * console.log(customPlatformPwd); // 输出使用自定义平台ID计算的密码
 *
 * @example
 * // 示例 5: 无效输入导致返回空字符串
 * const invalidLengthPwd = mokaPasswordV2({
 *   passwordSource: "mysecretpassword",
 *   distinguishKey: "example.com",
 *   length: 50 // 超出范围
 * });
 * console.log(invalidLengthPwd); // 输出: ""
 *
 * const emptyInputPwd = mokaPasswordV2({
 *   passwordSource: "", // 密码为空
 *   distinguishKey: "example.com"
 * });
 * console.log(emptyInputPwd); // 输出: ""
 */
export function mokaPasswordV2(options: MokaPasswordV2Options): string {
    // --- 解构并设置默认值 ---
    const {
        passwordSource,
        distinguishKey,
        mappingType = 'NLSE', // 默认使用 NLSE 映射
        length = 16,        // 默认长度 16
        platformId = DEFAULT_PLATFORM_ID // 默认平台 ID
    } = options;

    // --- 输入验证 ---
    // 检查必需输入是否为空，以及长度是否在有效范围内
    if (!passwordSource || !distinguishKey || length <= 0 || length > MAX_LENGTH) {
        // 如果验证失败，根据原始逻辑返回空字符串
        if (length > MAX_LENGTH) {
            console.warn(`请求的长度 (${length}) 超出允许的最大值 (${MAX_LENGTH})。`);
        }
        if (!passwordSource || !distinguishKey) {
            console.warn("密码源 (passwordSource) 和区分密钥 (distinguishKey) 不能为空。");
        }
        return "";
    }



    // --- 选择映射函数 ---
    const selectedMappingFunction = mappingFunctions[mappingType] || mappingFunctions.None;

    // --- 核心逻辑 (与 mokaPasswordV2 相同) ---
    // 1. 计算原始密码的 SHA256 哈希 (Hex 编码)
    const pwdSha256 = Hex.stringify(sha256(passwordSource));

    // 2. 构建用于最终哈希的组合源字符串
    // 格式: $versionName:$platformId:$distinguishKey:sha256_hex($passwordSource):$passwordLength
    const combineSource = `${VERSION_NAME}:${platformId}:${distinguishKey}:${pwdSha256}:${length}`;

    // 3. 计算组合源的 SHA512 哈希，并进行 Base64 编码
    const sha512Base64 = Base64.stringify(sha512(combineSource));

    // 4. 对 Base64 编码的哈希应用选定的字符映射
    const mappedString = selectedMappingFunction(sha512Base64);

    // 5. 从映射后的字符串中提取最终密码
    // 切片逻辑：从索引 `length` 开始，取 `length` 个字符
    // (slice 的第二个参数是结束索引，不包含在内，所以是 length * 2)
    // --- 返回结果 ---
    return mappedString.slice(length, length * 2);
}

// 可以选择性地导出默认平台ID，如果外部需要的话
export const MOKA_DEFAULT_PLATFORM_ID = DEFAULT_PLATFORM_ID;

// 主导出函数
export default mokaPasswordV2;
