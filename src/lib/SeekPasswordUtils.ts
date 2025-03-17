import hmacMD5 from 'crypto-js/hmac-md5';

function flowerPassword(pwd:string, key:string):[string,string] {
    const strConstant = "sunlovesnow1990090127xykab";

    const md5one = hmacMD5(pwd,key).toString();
    const md5two = hmacMD5(md5one, "snow").toString();
    const md5three = hmacMD5(md5one, "kise").toString();
    const rule = md5three.split("");
    const source = md5two.split("");

    if (rule.length !== source.length) {
        throw new Error('MD5 output lengths do not match');
    }

    const modifiedSource = source.map((char, index) => {
        if (isNaN(Number(char))) { // 如果字符不是数字
            const ruleChar = rule[index];
            if (strConstant.includes(ruleChar)) {
                return char.toUpperCase();
            }
        }
        return char;
    });
    const code32 = modifiedSource.join('');

    const firstChar: string = code32[0];
    const code16: string = isNaN(Number(firstChar))
        ? code32.slice(0, 16)
        : `K${code32.slice(1, 16)}`;
    return [code16, code32];

}

function seekPassword(hash:string): string {
    // generate alphabet
    const lower = "abcdefghijklmnopqrstuvwxyz".split("");
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const number = "0123456789".split("");
    const punctuation = [',', '.', ':', ';', '!', '?'];
    const alphabet = [...lower, ...upper, ...number, ...punctuation];
    // try to generate password
    for (let i = 0; i <= hash.length - 10; ++i) {
        const subHash = hash.slice(i, i + 10).split('');
        let count = 0;
        const mapIndex = subHash.map(c =>
            (count = (count + c.charCodeAt(0)) % alphabet.length)
        );
        const skPwd = mapIndex.map(k => alphabet[k]);
        // validate password
        const matched = [false, false, false, false];
        skPwd.forEach(e => {
            matched[0] = matched[0] || lower.includes(e);
            matched[1] = matched[1] || upper.includes(e);
            matched[2] = matched[2] || number.includes(e);
            matched[3] = matched[3] || punctuation.includes(e);
        });
        if (matched.every(b => b)) { // 使用every方法简化条件判断
            return skPwd.join('');
        }
    }
    return "";
}

export function generatePassword(pwd:string, key:string):string {
    if (pwd && key) {
        const fl_pwd = flowerPassword(pwd, key);
        const hash = fl_pwd[1];
        console.assert(hash.length === 32, "flower_password output length not equal to 32");
        return seekPassword(hash);
    }
    return "";
}
