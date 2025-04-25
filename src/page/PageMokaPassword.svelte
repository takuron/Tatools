<script lang="ts">
    import {InfoMsg} from "./PageMokaPassword"
    import {mokaPasswordV2} from "../lib/MokaPasswordV2";
    import type {MokaPasswordV2Options} from "../lib/MokaPasswordV2";

    let passwordInput = $state("")
    let distinguishCodeInput = $state("")
    let passwordEOutput = $state("")

    let infoMsg = $state(InfoMsg.NO_MSG)

    let generationMode = $state("nlse")
    let platformId = $state("")
    let passwordLegend = $state(16)

    function handleGenerate() {
        // 1. 输入验证 (Guard Clause)
        if (passwordInput === "" || distinguishCodeInput === "") {
            infoMsg = InfoMsg.INPUT_EMPTY;
            return;
        }

        // 2. 重置消息
        infoMsg = InfoMsg.NO_MSG;

        // 3. 验证 generationMode (可选但推荐)
        const validModes: ReadonlyArray<string> = ["nlse", "nl", "nls"];
        if (!validModes.includes(generationMode)) {
            console.error("Invalid generationMode:", generationMode);
            // 可以设置一个错误消息
            // infoMsg = InfoMsg.INVALID_MODE;
            return; // 或者抛出错误
        }

        // 4. 构建基础参数对象
        // 注意：根据原始代码，mappingType 的值是大写的 ('NLSE', 'NL', 'NLS')
        //       而 case 语句的值是小写的 ('nlse', 'nl', 'nls')
        //       所以需要将 generationMode 转换为大写。
        const options: MokaPasswordV2Options = {
            passwordSource: passwordInput,
            distinguishKey: distinguishCodeInput,
            length: passwordLegend,
            mappingType: generationMode.toUpperCase() as 'NLSE' | 'NL' | 'NLS', // 转换为大写并断言类型
        };

        // 5. 条件性地添加 platformId
        if (platformId !== "") {
            options.platformId = platformId;
        }

        // 6. 调用密码生成函数
        passwordEOutput = mokaPasswordV2(options);
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
            <option value="nls">字母数字符号 - Number&Letter&Symbol</option>
            <option value="nl">字母数字 - Number&Letter</option>
            <option value="nlse">去除易混淆字母数字符号 - Number&Letter&Symbol-E</option>
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

<div class="max-w-screen-2xl mt-6 mb-12 ml-6 mr-6 flex flex-nowrap">

    <div class="collapse collapse-arrow bg-base-100 border-base-300 border">
        <input type="checkbox"/>
        <div class="collapse-title font-semibold">高级设置 - Advanced settings</div>
        <div class="collapse-content text-sm flex flex-wrap">
            <fieldset class="fieldset w-96">
                <legend class="fieldset-legend">平台代码 - Platform Id</legend>
                <input class="input"
                       id="input_password"
                       type="text"
                       bind:value={platformId}
                       placeholder="takuron.com"/>
            </fieldset>

            <div class="max-w-xs w-96 ">
                <fieldset class="fieldset">
                    <legend class="fieldset-legend">密码长度 - Password Length</legend>
                </fieldset>
                <input type="range" min="8" max="32" class="range" step="4" bind:value={passwordLegend}/>
                <div class="flex justify-between px-2.5 mt-2 text-xs">
                    <span>8</span>
                    <span>12</span>
                    <span>16</span>
                    <span>20</span>
                    <span>24</span>
                    <span>28</span>
                    <span>32</span>
                </div>
            </div>
        </div>
    </div>

</div>