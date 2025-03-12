<script lang="ts">
  let count: number = $state(0)
  const increment = () => {
    count += 6
  }
</script>

<button class="btn" onclick={increment}>
  count is {count}
</button>
