import hmacMD5 from 'crypto-js/hmac-md5';

function flower_password(pwd:string, key:string) {
    let code16;
    const md5one = hmacMD5(pwd,key).toString();
    const md5two = hmacMD5(md5one, "snow").toString();
    const md5three = hmacMD5(md5one, "kise").toString();
    // to uppercase
    const rule = md5three.split("");
    const source = md5two.split("");
    console.assert(rule.length === source.length, "md5 output length not equal");
    for (let i = 0; i < source.length; ++i) {
        if (isNaN(Number(source[i]))) {
            const str = "sunlovesnow1990090127xykab";
            if (str.search(rule[i]) > -1) {
                source[i] = source[i].toUpperCase();
            }
        }
    }
    const code32 = source.join("");
    const code1 = code32.slice(0, 1);
    if (isNaN(Number(code1))) {
        code16 = code32.slice(0, 16);
    } else {
        code16 = "K" + code32.slice(1, 16);
    }
    return [code16, code32];
}

export function seek_password(hash:string) {
    // generate alphabet
    const lower = "abcdefghijklmnopqrstuvwxyz".split("");
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const number = "0123456789".split("");
    const punctuation = ",.:;!?".split("");
    const alphabet = lower.concat(upper).concat(number).concat(punctuation);
    // try to generate password
    for (let i = 0; i <= hash.length - 10; ++i) {
        const sub_hash = hash.slice(i, i + 10).split("");
        let count = 0;
        const map_index = sub_hash.map(function (c) {
            count = (count + c.charCodeAt(0)) % alphabet.length;
            return count;
        });
        const sk_pwd = map_index.map(function (k) {
            return alphabet[k];
        });
        // validate password
        const matched = [false, false, false, false];
        sk_pwd.forEach(function(e) {
            matched[0] = matched[0] || lower.includes(e);
            matched[1] = matched[1] || upper.includes(e);
            matched[2] = matched[2] || number.includes(e);
            matched[3] = matched[3] || punctuation.includes(e);
        });
        if (!matched.includes(false)) {
            return sk_pwd.join("");
        }
    }
    return "";
}

export function generate_password(pwd:string, key:string) {
    if (pwd && key) {
        const fl_pwd = flower_password(pwd, key);
        console.log(fl_pwd)
        const hash = fl_pwd[1];
        console.assert(hash.length === 32, "flower_password output length not equal to 32");
        return seek_password(hash);
    }
}
