<script>
  import TierList from './components/TierList.svelte';
  import Pool from './components/Pool.svelte';
</script>

<main>
  <header>
    <h1>Tierlist</h1>
  </header>
  <TierList />
  <Pool />
</main>

<style>
  :global(*, *::before, *::after) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :global(body) {
    background: #1a1a1a;
    color: #f0f0f0;
    font-family: system-ui, sans-serif;
    min-height: 100vh;
  }

  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 1.5rem;
    color: #fff;
  }
</style>
