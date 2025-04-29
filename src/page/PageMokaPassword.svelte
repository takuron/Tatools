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

<!-- 整体容器 -->
<!--
  max-w-screen-2xl: 限制内容最大宽度为 2xl 断点 (1536px)，防止在大屏幕上过宽。
  mx-auto:          水平居中容器。
  p-6:             在容器内部添加 1.5rem (24px) 的内边距，替代之前的 m-6 外边距，方便内部元素使用 w-full。
-->
<div class="max-w-screen-2xl mx-auto p-4">

    <!-- 警告信息区域 -->
    <!--
      w-full:        让 fieldset 占据其父容器（div）的全部宽度。
      mb-6:          添加 1.5rem (24px) 的下外边距，将其与下面的输入区域分开。
    -->
    <fieldset class="fieldset w-full">
        {#if infoMsg === InfoMsg.CP_EMPTY}
            <div role="alert" class="alert alert-warning mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none"
                     viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <span>待复制内容为空，请先生成密码</span>
            </div>
        {:else if infoMsg === InfoMsg.CP_SUCCESS}
            <div role="alert" class="alert alert-success mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none"
                     viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>复制成功</span>
            </div>
        {:else if infoMsg === InfoMsg.JS_ERROR}
            <div role="alert" class="alert alert-warning mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none"
                     viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <span>操作出错，请检查浏览器js是否开启并更新浏览器</span>
            </div>
        {:else if infoMsg === InfoMsg.INPUT_EMPTY}
            <div role="alert" class="alert alert-warning mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none"
                     viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <span>请输入记忆密码和区分代码</span>
            </div>
        {/if}

    </fieldset>

    <!-- 输入和选项区域 - 使用 Grid 布局 -->
    <!--
      grid:             启用 Grid 布局。
      grid-cols-1:      默认（移动端）为单列布局，每个项目占一行。
      md:grid-cols-2:   在中等屏幕 (>=768px) 及以上，变为两列布局。
      lg:grid-cols-3:   在大型屏幕 (>=1024px) 及以上，变为三列布局。
      gap-6:            在网格项目之间添加 1.5rem (24px) 的间距。
      mb-6:             添加下外边距，与下面的操作区分开。
    -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">

        <fieldset class="fieldset">
            <legend class="fieldset-legend">记忆密码 - Memory Password</legend>
            <input class="input max-w-96"
                   id="input_password max-w-96"
                   type="password"
                   bind:value={passwordInput}
                   placeholder="Memory Password"/>
        </fieldset>

        <fieldset class="fieldset">
            <legend class="fieldset-legend">区分代码 - Distinguish Code</legend>
            <input class="input max-w-96"
                   id="input_key"
                   type="text"
                   bind:value={distinguishCodeInput}
                   placeholder="Distinguish Code"/>
        </fieldset>

        <fieldset class="fieldset">
            <legend class="fieldset-legend">生成模式 - Generation Mode</legend>
            <select class="select max-w-64" bind:value={generationMode}>
                <option value="nls">字母数字符号 - Number&Letter&Symbol</option>
                <option value="nl">字母数字 - Number&Letter</option>
                <option value="nlse">去除易混淆字母数字符号 - Number&Letter&Symbol-E</option>
            </select>
        </fieldset>
    </div>

    <!-- 操作按钮和输出区域 - 使用 Flexbox 布局 -->
    <!--
      flex:             启用 Flexbox 布局。
      flex-col:         默认（移动端）为垂直排列 (列)。
      md:flex-row:      在中等屏幕 (>=768px) 及以上，变为水平排列 (行)。
      gap-4:            在 flex 项目之间添加 1rem (16px) 的间距。
      md:items-center:  在水平排列时，垂直居中对齐项目。
      mb-12:            保留或调整下外边距。
    -->
    <div class="flex flex-col md:flex-row gap-6 mb-6">
        <button id="btn_gencode" class="btn btn-primary w-auto" onclick={handleGenerate}>生成 - Generate</button>

        <div class="join flex-1 w-full">
            <label class="input validator join-item">
                <input id="input_epassword" type="text"
                       bind:value={passwordEOutput}
                       placeholder="Encrypted Password"
                       disabled>
            </label>
            <button class="btn btn-neutral join-item" onclick="{handleCopy}">Copy</button>
        </div>
    </div>


    <!-- 高级设置区域容器 -->
    <!--
      使用与上面内容区相同的 max-w-screen-2xl 和 mx-auto, p-6 (或根据需要调整)
      来确保高级设置区域与上方内容对齐并有相同的边距和最大宽度。
      移除了 flex flex-nowrap，因为这里只有一个主要子元素（collapse）。
    -->
    <div class="max-w-screen-2xl mx-auto">

        <div class="collapse collapse-arrow bg-base-100 border-base-300 border w-full">
            <input type="checkbox"/>
            <div class="collapse-title font-semibold">高级设置 - Advanced settings</div>
            <!-- Collapse 内容区域 -->
            <!--
              grid:             启用 Grid 布局。
              grid-cols-1:      默认（移动端）为单列布局，每个设置项占一行。
              md:grid-cols-2:   在中等屏幕 (>=768px) 及以上，变为两列布局，并排显示设置项。
              gap-6:            在网格项目之间（行和列）添加 1.5rem (24px) 的间距。
              p-4:              在内容区域内部添加 1rem (16px) 的内边距，使其不紧贴边框。
              text-sm:          保持较小的字体大小。
            -->
            <div class="collapse-content text-sm grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <fieldset class="fieldset">
                    <legend class="fieldset-legend">平台代码 - Platform Id</legend>
                    <input class="input"
                           id="input_password"
                           type="text"
                           bind:value={platformId}
                           placeholder="takuron.com"/>
                </fieldset>

                <div>
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">密码长度 - Password Length</legend>
                    </fieldset>
                    <input type="range" min="8" max="32" class="range w-full" step="4" bind:value={passwordLegend}/>
                    <div class="flex w-full justify-between px-2.5 mt-2 text-xs">
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

</div>