<template>
  <a-icon @click.prevent.stop type="filter" :style="{ color: filtered ? 'rgba(255, 255, 255, 0.5)' : '#ffffff' }" class="table-filter-search-icon" />
</template>

<script>
export default {
  name: 'STableColumnSearchIcon',
  props: {
    filtered: {
      type: Boolean,
      default: false
    }
  }
}
</script>
