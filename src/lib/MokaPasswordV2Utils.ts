import sha256 from "crypto-js/sha256"
import Hex from "crypto-js/enc-hex"
import Base64 from "crypto-js/enc-base64"

const VERSION_NAME = "MokaV2"
const DEFAULT_PLATFORM_ID = "takuron.com"

export default {
    mappingNLSE: mappingNLSE,
    mokaPasswordV2: mokaPasswordV2
}

const replacements: Record<string, string> = {
    'o': '!',
    'O': '?',
    '0': '*',
    'L': '{',
    'l': '}',
    'I': '[',
    'i': ']',
    '=': '#',
    '/': '&'
};
function mappingNLSE(wordBase64: string): string {
    const regex = new RegExp(
        Object.keys(replacements)
            .map(key => key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
            .join('|'),
        'g'
    );

    return wordBase64.replace(regex, (match) => replacements[match]);
}

function mokaPasswordV2(
    pwd: string,
    key: string,
    mapping: (wordBase64: string) => string,
    legend: number = 16,
    platformId: string = DEFAULT_PLATFORM_ID
): string {
    if(pwd==""||key=="")
        return ""

    let pwdSha256 = Hex.stringify(sha256(pwd))
    //$versionName:$platformId:$distinguishCode:sha256_hex($passwordSource):$passwordLength
    let combineSource = `${VERSION_NAME}:${platformId}:${key}:${pwdSha256}:${legend}`
    let mappingStr = mapping(Base64.stringify(sha256(combineSource)))

    return mappingStr.slice(legend,legend*2)
}


