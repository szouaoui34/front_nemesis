<template>
<div id="test">
  {{ info }}
</div>
</template>

<script>
import axios from "axios";

export default {
  name: "test",
   data () {
    return {
      info: "hello from test"
    }
  },
  // mounted () {
  //   axios.get('task/na_ac_status')
  //     .then(response => (this.info = response))
  // }
}
</script>
<!--<template>-->


<!--&lt;!&ndash;    <vxe-table :data="tableData" ref="table" :columns="columns" class="custom-table">&ndash;&gt;-->
<!--&lt;!&ndash;    </vxe-table>&ndash;&gt;-->
<!--&lt;!&ndash;  <vxe-table :data="tableData">&ndash;&gt;-->
<!--&lt;!&ndash;    <vxe-table-column v-for="column in columns" :field="column.field" :title="column.title"></vxe-table-column>&ndash;&gt;-->
<!--&lt;!&ndash;  </vxe-table>&ndash;&gt;-->
<!--  test-->
<!--</template>-->


<style scoped>

</style>