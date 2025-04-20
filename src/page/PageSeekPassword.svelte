<script lang="ts">
    import {generatePassword} from "../lib/SeekPasswordUtils"
    import {InfoMsg} from "./PageSeekPassword"

    let passwordInput = $state("")
    let distinguishCodeInput = $state("")
    let passwordEOutput = $state("")

    let infoMsg = $state(InfoMsg.NO_MSG)

    let generationMode = $state("default")

    function handleGenerate() {
        if(passwordInput==""||distinguishCodeInput==""){
            infoMsg = InfoMsg.INPUT_EMPTY;
            return
        }
        if(generationMode=="default"){
            infoMsg = InfoMsg.NO_MSG;
            passwordEOutput = generatePassword(passwordInput, distinguishCodeInput)
        }
        else{
            infoMsg = InfoMsg.NO_MSG;
            passwordEOutput = generatePassword(passwordInput, distinguishCodeInput).replace(/[.,-\/#!$%^&*;:{}=\-_`~()@+?><\[\]]/g, "")
        }
    }

    async function handleCopy() {
        if (passwordEOutput == "") {
            infoMsg = InfoMsg.CP_EMPTY
            return
        }
        try {
            await navigator.clipboard.writeText(passwordEOutput);
            infoMsg = InfoMsg.CP_SUCCESS;
        } catch (error) {
            infoMsg = InfoMsg.JS_ERROR;
        }
    }
</script>

<div class="max-w-screen-2xl m-6   flex flex-wrap">
    <fieldset class="fieldset w-full">
        {#if infoMsg === InfoMsg.CP_EMPTY}
            <div role="alert" class="alert alert-warning">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none"
                     viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <span>待复制内容为空，请先生成密码</span>
            </div>
        {:else if infoMsg === InfoMsg.CP_SUCCESS}
            <div role="alert" class="alert alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none"
                     viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>复制成功</span>
            </div>
        {:else if infoMsg === InfoMsg.JS_ERROR}
            <div role="alert" class="alert alert-warning">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none"
                     viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <span>操作出错，请检查浏览器js是否开启并更新浏览器</span>
            </div>
        {:else if infoMsg === InfoMsg.INPUT_EMPTY}
            <div role="alert" class="alert alert-warning">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none"
                     viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <span>请输入记忆密码和区分代码</span>
            </div>
        {/if}
    </fieldset>



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
               type="text"
               bind:value={distinguishCodeInput}
               placeholder="Distinguish Code"/>
    </fieldset>

    <fieldset class="fieldset w-64">
        <legend class="fieldset-legend">生成模式 - Generation Mode</legend>
        <select class="select w-64" bind:value={generationMode}>
            <option selected value="default">默认 - Default</option>
            <option value="no_punctuation">去除标点 - Remove punctuation</option>
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
        <button class="btn btn-neutral join-item" onclick="{handleCopy}">Copy</button>
    </div>
</div>

