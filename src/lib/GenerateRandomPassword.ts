/**
 * 配置选项接口，用于生成密码
 */
interface PasswordOptions {
    /** 密码长度 (默认: 16) */
    length?: number;
    /** 是否包含小写字母 (默认: true) */
    useLowercase?: boolean;
    /** 是否包含大写字母 (默认: true) */
    useUppercase?: boolean;
    /** 是否包含数字 (默认: true) */
    useNumbers?: boolean;
    /** 是否包含特殊符号 (默认: true) */
    useSymbols?: boolean;
    /**
     * 自定义特殊符号字符串。如果提供了此项且 useSymbols 为 true，
     * 则仅使用此字符串中的符号。(默认使用 '!@#$%^&*()_+-=[]{}|;:,.<>?')
     */
    customSymbols?: string;
    /** 是否排除易混淆字符 (0, O, o, 1, l, I) (默认: true) */
    excludeSimilarChars?: boolean;
}

/**
 * 生成一个随机密码字符串。
 *
 * @param options - 配置密码生成的选项对象。
 * @returns 生成的随机密码字符串。
 * @throws 如果没有选择任何字符类型或长度小于所需字符类型的数量，则抛出错误。
 */
function generateRandomPassword(options?: PasswordOptions): string {
    // --- 默认设置 ---
    const defaults: Required<Omit<PasswordOptions, 'customSymbols'>> & { customSymbols?: string } = {
        length: 16,
        useLowercase: true,
        useUppercase: true,
        useNumbers: true,
        useSymbols: true,
        customSymbols: undefined, // 稍后处理默认符号集
        excludeSimilarChars: true,
    };

    // 合并用户选项和默认值
    const config = { ...defaults, ...options };

    // --- 字符集定义 ---
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const defaultSymbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'; // 避免使用反斜杠等可能引起问题的字符
    const similarChars = '0Oo1lI'; // 易混淆字符列表

    // --- 辅助函数：过滤字符 ---
    const filterChars = (source: string, charsToRemove: string): string => {
        if (!config.excludeSimilarChars) {
            return source;
        }
        let result = '';
        for (let i = 0; i < source.length; i++) {
            if (charsToRemove.indexOf(source[i]) === -1) {
                result += source[i];
            }
        }
        return result;
    };

    // --- 构建可用字符池 ---
    let availableChars = '';
    const requiredChars: string[] = []; // 确保每种选定的类型至少有一个字符

    // 处理小写字母
    if (config.useLowercase) {
        const filtered = filterChars(lowercaseChars, similarChars);
        if (filtered.length > 0) {
            availableChars += filtered;
            requiredChars.push(filtered[Math.floor(Math.random() * filtered.length)]);
        } else if (config.excludeSimilarChars) {
            console.warn("无法包含小写字母，因为过滤后字符集为空。");
        }
    }

    // 处理大写字母
    if (config.useUppercase) {
        const filtered = filterChars(uppercaseChars, similarChars);
        if (filtered.length > 0) {
            availableChars += filtered;
            requiredChars.push(filtered[Math.floor(Math.random() * filtered.length)]);
        } else if (config.excludeSimilarChars) {
            console.warn("无法包含大写字母，因为过滤后字符集为空。");
        }
    }

    // 处理数字
    if (config.useNumbers) {
        const filtered = filterChars(numberChars, similarChars);
        if (filtered.length > 0) {
            availableChars += filtered;
            requiredChars.push(filtered[Math.floor(Math.random() * filtered.length)]);
        } else if (config.excludeSimilarChars) {
            console.warn("无法包含数字，因为过滤后字符集为空。");
        }
    }

    // 处理符号
    if (config.useSymbols) {
        const symbolsToUse = config.customSymbols !== undefined ? config.customSymbols : defaultSymbolChars;
        const filtered = filterChars(symbolsToUse, similarChars); // 也过滤自定义符号中的易混淆字符
        if (filtered.length > 0) {
            availableChars += filtered;
            requiredChars.push(filtered[Math.floor(Math.random() * filtered.length)]);
        } else {
            console.warn("无法包含符号，因为（自定义或默认）符号集为空或过滤后为空。");
        }
    }

    // --- 输入验证 ---
    if (availableChars.length === 0) {
        throw new Error('无法生成密码：没有可用的字符类型被选中或过滤后字符集为空。');
    }

    if (config.length <= 0) {
        throw new Error('密码长度必须是正数。');
    }

    if (config.length < requiredChars.length) {
        throw new Error(`密码长度 (${config.length}) 太短，无法包含所有选定类型的字符 (至少需要 ${requiredChars.length} 个字符)。`);
    }

    // --- 生成密码 ---
    const passwordArray: string[] = [...requiredChars]; // 从必需字符开始

    // 填充剩余长度的密码
    const remainingLength = config.length - requiredChars.length;
    for (let i = 0; i < remainingLength; i++) {
        const randomIndex = Math.floor(Math.random() * availableChars.length);
        passwordArray.push(availableChars[randomIndex]);
    }

    // --- 打乱密码数组 (Fisher-Yates Shuffle) ---
    for (let i = passwordArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]]; // Swap
    }

    // --- 返回结果 ---
    return passwordArray.join('');
}