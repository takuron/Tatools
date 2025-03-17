<script lang="ts">
    import {generatePassword} from "../lib/SeekPasswordUtils"

    let passwordInput = $state("")
    let distinguishCodeInput = $state("")
    let passwordEOutput = $state("")

    function handleGenerate() {
        passwordEOutput = generatePassword(passwordInput, distinguishCodeInput)
    }
</script>

<div class="max-w-screen-2xl m-6   flex flex-wrap">
    <fieldset class="fieldset w-96">
        <legend class="fieldset-legend">记忆密码 - Memory Password</legend>
        <input class="input"
               id="input_password"
               type="password"
               bind:value={passwordInput}
               placeholder="Memory Password"/>
    </fieldset>

    <fieldset class="fieldset w-96">
        <legend class="fieldset-legend">区分代码 - Distinguish Code</legend>
        <input class="input"
               id="input_key"
               type="password"
               bind:value={distinguishCodeInput}
               placeholder="Distinguish Code"/>
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
    <button id="btn_gencode" class="btn btn-primary" onclick={handleGenerate}>生成 - Generate</button>

    <div class="join ml-4">
        <label class="input validator join-item">
            <input id="input_epassword" type="text"
                   bind:value={passwordEOutput}
                   placeholder="Encrypted Password"
                   disabled>
        </label>
        <button class="btn btn-neutral join-item">Copy</button>
    </div>
</div>