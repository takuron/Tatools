
<script lang="ts">
    import {generate_password} from "../lib/SeekPasswordUtils"
    function generator() {
        const pwd = document.getElementById("input_password")!!;
        const key = document.getElementById("input_key")!!;
        const sk_pwd = generate_password("123", "123");

        document.getElementById("input_epassword")!!.nodeValue = sk_pwd!!;
        // if (sk_pwd) {
        //     if (document.getElementById("cb_remove").checked == true) {
        //         document.getElementById("code").value = sk_pwd.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g, "");
        //     } else {
        //         document.getElementById("code").value = sk_pwd;
        //     }
        // }
    }

    document.getElementById("btn_gencode")!!.onclick = function () {
        generator()
    }
</script>

<div class="max-w-screen-2xl m-6   flex flex-wrap">
    <fieldset class="fieldset w-96">
        <legend class="fieldset-legend">记忆密码 - Memory Password</legend>
        <input id="input_password" type="password" class="input" placeholder="Memory Password"/>
    </fieldset>

    <fieldset class="fieldset w-96">
        <legend class="fieldset-legend">区分代码 - Distinguish Code</legend>
        <input id="input_key" type="password" class="input" placeholder="Distinguish Code"/>
    </fieldset>

    <fieldset class="fieldset w-64">
        <legend class="fieldset-legend">生成模式 - Generation Mode</legend>
        <select class="select w-64">
            <option selected>默认 - Default</option>
            <option>去除标点 - Remove punctuation</option>
        </select>
    </fieldset>
</div>

<div class="max-w-screen-2xl mt-6 mb-12 ml-6 mr-6 flex flex-nowrap">
    <button id="btn_gencode" class="btn btn-primary">生成 - Generate</button>

    <div class="join ml-4">
        <label class="input validator join-item">
            <input id="input_epassword" type="text" placeholder="Encrypted Password" disabled>
        </label>
        <button class="btn btn-neutral join-item">Copy</button>
    </div>
</div>