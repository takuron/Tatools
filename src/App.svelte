<script lang="ts">
    import Menu from "./lib/Menu.svelte";

    import Wealcome from './page/PageWealcome.svelte'
    import PageSeekPassword from "./page/PageSeekPassword.svelte";
    import PageMokaPassword from "./page/PageMokaPassword.svelte";
    import Router from "svelte-spa-router";

    const routes = {
        '/': Wealcome,
        '/seekpassword': PageSeekPassword,
        '/mokapassword': PageMokaPassword,
    }
</script>

<main data-theme="winter">

    <div class="drawer-content">
        <div class="max-w-screen-2xl mx-auto">
            <div class="flex flex-col">
                <div class="navbar w-full bg-base-100 shadow-sm">
                    <div class="navbar-start drawer-content">
                        <label for="side-drawer" tabindex="0" role="button"
                               class="btn btn-ghost drawer-button lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M4 6h16M4 12h8m-8 6h16"/>
                            </svg>
                        </label>
                        <a class="btn btn-ghost text-xl" href="./">TaTools</a>
                    </div>
                    <div class="navbar-end">

                    </div>
                </div>

                <div class="flex flex-row">
                    <div class="hidden lg:indicator lg:w-56 flex-1 mx-auto mt-6 ml-4 mr-4">
                        <Menu></Menu>
                    </div>

                    <div class="card bg-base-100 shadow-sm w-max flex-100 mt-6 ml-4 mr-4">
                        <Router {routes}/>
                    </div>

                </div>

            </div>
        </div>
    </div>


    <input id="side-drawer" type="checkbox" class="drawer-toggle"/>

    <div class="drawer-side">
        <label for="side-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
        <ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            <Menu></Menu>
        </ul>
    </div>

</main>