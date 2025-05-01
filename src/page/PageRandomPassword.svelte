<script lang="ts">
    import {generatePassword} from "../lib/SeekPasswordUtils"
    import {InfoMsg} from "./PageSeekPassword"

    let passwordInput = $state("")
    let distinguishCodeInput = $state("")
    let passwordEOutput = $state("")

    let infoMsg = $state(InfoMsg.NO_MSG)

    let generationMode = $state("default")

    function handleGenerate() {
        if (passwordInput == "" || distinguishCodeInput == "") {
            infoMsg = InfoMsg.INPUT_EMPTY;
            return
        }
        if (generationMode == "default") {
            infoMsg = InfoMsg.NO_MSG;
            passwordEOutput = generatePassword(passwordInput, distinguishCodeInput)
        } else {
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
                <span>请至少选择一个类别生成</span>
            </div>
        {/if}
    </fieldset>


    <div class="w-full mb-6">
        <fieldset class="fieldset bg-base-100 border-base-300 rounded-box w-full border p-4">
            <legend class="fieldset-legend">使用字符 - Used Chars</legend>
            <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-6">
                <label class="label">
                    <input type="checkbox" checked="checked" class="checkbox"/>
                    A-Z
                </label>
                <label class="label">
                    <input type="checkbox" checked="checked" class="checkbox"/>
                    a-z
                </label>
                <label class="label">
                    <input type="checkbox" checked="checked" class="checkbox"/>
                    0-9
                </label>
                <label class="label">
                    <input type="checkbox" class="checkbox"/>
                    !@#$%&*()_+-=[]|;:,.?
                </label>
                <!--                <label class="label">-->
                <!--                    <input type="checkbox" checked="checked" class="checkbox" />-->
                <!--                    Remember me-->
                <!--                </label>-->
                <!--                <label class="label">-->
                <!--                    <input type="checkbox" checked="checked" class="checkbox" />-->
                <!--                    Remember me-->
                <!--                </label>-->
            </div>
        </fieldset>
    </div>


    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        <fieldset class="fieldset">
            <legend class="fieldset-legend">排除字符 - Platform Id</legend>
            <input class="input"
                   id="input_password"
                   type="text"/>
        </fieldset>

        <div>
            <fieldset class="fieldset">
                <legend class="fieldset-legend">密码长度 - Password Length</legend>
            </fieldset>
            <input type="range" min="8" max="32" class="range w-full" step="4"/>
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

    <!-- 操作按钮和输出区域 - 使用 Flexbox 布局 -->
    <!--
      flex:             启用 Flexbox 布局。
      flex-col:         默认（移动端）为垂直排列 (列)。
      md:flex-row:      在中等屏幕 (>=768px) 及以上，变为水平排列 (行)。
      gap-4:            在 flex 项目之间添加 1rem (16px) 的间距。
      md:items-center:  在水平排列时，垂直居中对齐项目。
      mb-12:            保留或调整下外边距。
    -->
    <div class="flex flex-col md:flex-row gap-6">
        <button id="btn_gencode" class="btn btn-primary w-auto" onclick={handleGenerate}>生成 - Generate</button>

        <div class="join flex-1 w-full">
            <label class="input validator join-item">
                <input id="input_epassword" type="text"
                       bind:value={passwordEOutput}
                       placeholder="Password"
                       disabled>
            </label>
            <button class="btn btn-neutral join-item" onclick="{handleCopy}">Copy</button>
        </div>

    </div>
</div>

