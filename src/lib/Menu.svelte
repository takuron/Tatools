<script>
    import active from 'svelte-spa-router/active'
</script>

<ul class="menu bg-base-200 rounded-box w-56">
    <li><a href="#/" use:active = "{ {className: 'menu-active', inactiveClassName: 'inactive'}}">欢迎 - Wealcome</a></li>
    <li>
        <h2 class="menu-title">密码工具 - Password Tools</h2>
        <ul>
            <li><a use:active = "{ {className: 'menu-active', inactiveClassName: 'inactive'}}" href="#/seekpassword">SeekPassword</a></li>
            <li><a use:active = "{ {className: 'menu-active', inactiveClassName: 'inactive'}}" href="#/mokapassword">MokaPasswordV2</a></li>
            <li class="menu-disabled" ><a use:active = "{ {className: 'menu-active', inactiveClassName: 'inactive'}}" href="#/randompassword">RandomPassword</a></li>
        </ul>
    </li>
    <li>
        <h2 class="menu-title">文本工具 - Textual Tools</h2>
        <ul>
            <li class="menu-disabled" ><a use:active = "{ {className: 'menu-active', inactiveClassName: 'inactive'}}" href="#/talkwithbuddha">与佛论禅<br>TalkWithBuddha</a></li>
            <li class="menu-disabled" ><a use:active = "{ {className: 'menu-active', inactiveClassName: 'inactive'}}" href="#/randompassword">RandomPassword</a></li>
        </ul>
    </li>
</ul>