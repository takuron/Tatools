<script lang="ts">
    import Menu from "./lib/Menu.svelte";
    import Wealcome from './page/PageWealcome.svelte';
    import PageSeekPassword from "./page/PageSeekPassword.svelte";
    import PageMokaPassword from "./page/PageMokaPassword.svelte";
    import Router from "svelte-spa-router";
    import PageRandomPassword from "./page/PageRandomPassword.svelte";

    const routes = {
        '/': Wealcome,
        '/seekpassword': PageSeekPassword,
        '/mokapassword': PageMokaPassword,
        '/randompassword': PageRandomPassword,
    }
</script>

<div class="drawer lg:drawer-open" data-theme="winter">
    <input id="side-drawer" type="checkbox" class="drawer-toggle" />

    <div class="drawer-content flex flex-col h-screen">
        <div class="navbar bg-base-100 shadow-sm w-full flex-shrink-0">
            <div class="flex-none lg:hidden">
                <label for="side-drawer" aria-label="open sidebar" class="btn btn-square btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16"/>
                    </svg>
                </label>
            </div>
            <div class="flex-1">
                <a class="btn btn-ghost text-xl" href="./">TaTools</a>
            </div>
            <div class="flex-none">

            </div>
        </div>

        <main class="flex-1 overflow-y-auto p-4 md:p-6">
            <Router {routes}/>
        </main>

    </div>

    <div class="drawer-side">
        <label for="side-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
        <ul class="menu p-4 w-64 min-h-full bg-base-200 text-base-content">
            <li class="mb-4">
                <a class="text-lg font-semibold" href="#/">Menu</a>
            </li>
            <Menu></Menu>
        </ul>
    </div>
</div>

<style>
    /* 可选: 如果需要更精细的控制，可以在这里添加全局样式 */
    /* 例如，确保 html 和 body 也是全高的 */
    :global(html), :global(body) {
        height: 100%;
        margin: 0;
        padding: 0;
        /* 防止在某些情况下出现不必要的滚动条 */
        overflow: hidden;
    }
    /* 强制 drawer-content 也有 overflow:hidden 防止双重滚动条 */
    .drawer-content {
        overflow: hidden;
    }
    /* 确保主滚动区域能正常工作 */
    .drawer-content > main {
        -webkit-overflow-scrolling: touch; /* 为了在 iOS 上平滑滚动 */
    }

</style>