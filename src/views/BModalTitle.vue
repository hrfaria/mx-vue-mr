<!-- ====================================================================== -->
<!-- BModalTitle.vue -->
<!-- Component used to dinamically render the title of the profile dialog
     box to include the name of the logged in user. -->
<!-- ====================================================================== -->
<template>
  <div>{{ title }}</div>
</template>

<script>
export default {
  name: "BModalTitle",
  props: {
    title: String
  }
};
</script>
