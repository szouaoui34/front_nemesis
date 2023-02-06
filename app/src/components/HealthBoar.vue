<template>
    <div class="row">
      <div class="col-1">
        <vxe-table
            style="max-width:380px;"
            ref="tree_cols"
            show-overflow
            height="98%"
            row-key
            :show-header="true"
            :data="tree_cols"
            :checkbox-config="{labelField: 'title',checkAll:true}"
            @checkbox-change="check_change"
            :tree-config="{children: 'children', line: true, expandAll: true}">
          <vxe-column type="checkbox" tree-node>
            <template #header="{ row }">
              <input v-model="tree_filter_str" type="type" placeholder="Filter" @keyup="tree_search">
            </template>
          </vxe-column>
        </vxe-table>

      </div>


      <div class="col-11">
        <vxe-toolbar>

          <template #buttons style="display: inline">

            <vxe-radio-group v-model="duration" @change="duration_change">
              <vxe-radio label="day" class="custom-radio" content="Day"></vxe-radio>
              <vxe-radio label="week" class="custom-radio" content="Week"></vxe-radio>
            </vxe-radio-group>
            <span style="margin-left:100px; color:#710E9A;font-size: 16px">Last Update : {{ update_date }} </span>
            <vxe-button class="export-button" @click="openExportEvent">Export</vxe-button>
          </template>


        </vxe-toolbar>

        <vxe-table
            border
            class="custom-table"
            ref="data_table"
            :key="Math.random()"
            height="95%"
            size="mini"
            :loading="tb_loading"
            :data="tableData">
          <vxe-column type="seq" width="40" fixed="left"></vxe-column>

          <vxe-column field="code_site" title="Site" width="120" fixed="left" type="html">
            <template #header="{ row }">
              <div>Site</div>
              <input style="width:80px;" v-model="tableData_filter_str" type="type" placeholder="Filter"
                     @keyup="data_search">
            </template>
          </vxe-column>
          <vxe-colgroup v-for="norme in tb_cols" :title="norme.title"
                        :headerClassName="'col_'+norme.title"
                        :visible="norme.checked">

            <vxe-colgroup v-for="domain in norme.children" :title="domain.title"
                          :visible="domain.checked">
              <vxe-colgroup v-for="kpi in domain.children" :title="kpi.title" :visible="kpi.checked">

                <vxe-column
                    v-for="frequency in kpi.children"
                    :visible="frequency.checked"
                    :sortable="true"
                    :field="frequency.field"
                    :title="frequency.title"
                    :width="100"
                ></vxe-column>


              </vxe-colgroup>

            </vxe-colgroup>

          </vxe-colgroup>
        </vxe-table>

      </div>
    </div>

</template>

<script>
import axios from 'axios'
import XEUtils from 'xe-utils'
import _ from 'lodash'

export default {
  name: "HealthBoar",
  data() {
    return {
      show_aside: true,
      radio: '1',
      default_tree: {
        children: 'children',
        label: 'title'
      },
      show_drawer: true,
      duration: 'week',
      tableData_src: null,
      tableData: null,
      tree_cols_src: null,
      tree_cols: null,
      tb_cols: null,
      tree_filter_str: '',
      tableData_filter_str: '',
      tb_loading: false,
      update_date: '',

    }
  },
  methods: {
    duration_change() {
      this.get_tb_data()
    },
    get_tb_data() {
      this.tb_loading = true
      let self = this
      let url = '/get_report/health_dash/' + self.duration

      axios
          .get(url)
          .then(function (response) {
            self.tb_cols = response.data.cols
            self.tree_cols_src = _.cloneDeep(response.data.cols)
            self.tree_cols = _.cloneDeep(response.data.cols)
            self.tableData_src = _.cloneDeep(response.data.table)
            self.tableData = response.data.table
            self.update_date = response.data.update_date
            self.refresh_tree()
            self.tb_loading = false

          })
          .catch(function (e) {
            alert('erreur de chargement', e)
            self.tb_loading = false
          })

    },
    check_change() {
      console.log('check')
      let cols = _.cloneDeep(this.tb_cols)
      let indetermined_full = this.$refs.tree_cols.getCheckboxIndeterminateRecords(true)
      let checked = this.$refs.tree_cols.getCheckboxRecords(true)
      let id_to_show = _.concat(_.map(checked, 'id'), _.map(indetermined_full, 'id'))

      function iter_node(node, id_to_show) {

        if (id_to_show.indexOf(node.id) > -1) {
          node.checked = true
        } else {
          node.checked = false
        }

        if (node.hasOwnProperty('children')) {
          for (let child of node.children) {
            iter_node(child, id_to_show)

          }
        }
      }

      for (let nrm_collection of cols) {
        iter_node(nrm_collection, id_to_show)
      }
      this.tb_cols = cols
    },
    data_search_fn() {
      this.tableData = this.tableData_src
      const filterName = XEUtils.toValueString(this.tableData_filter_str).trim().toLowerCase()
      if (filterName) {
        const searchProps = ['code_site']
        const rest = this.tableData.filter(item => searchProps.some(key => XEUtils.toValueString(item[key]).toLowerCase().indexOf(filterName) > -1))
        this.tableData = rest.map(row => {
          const item = Object.assign({}, row)
          searchProps.forEach(key => {
            item[key] = XEUtils.toValueString(item[key]).replace(filterName, match => `<span style="background-color: #FFFF33;">${match}</span>`)
          })
          return item
        })
      }
    },
    handleSearch() {
      let tree_filter_str = XEUtils.toValueString(this.tree_filter_str).toLowerCase().trim()
      if (tree_filter_str) {
        let options = {children: 'children'}
        let searchProps = ['title']
        this.tree_cols = XEUtils.searchTree(this.tree_cols_src, item => searchProps.some(key => XEUtils.toValueString(item[key]).toLowerCase().indexOf(tree_filter_str) > -1), options)
        this.$nextTick(() => {
          this.$refs.tree_cols.setAllTreeExpand(true)
          this.$refs.tree_cols.setAllCheckboxRow(true)
          this.check_change()
        })
      } else {

        this.$nextTick(() => {
              this.tree_cols = this.tree_cols_src

              this.$nextTick(() => {

                this.$refs.tree_cols.setAllTreeExpand(true)
                this.$refs.tree_cols.setAllCheckboxRow(true)
                this.check_change()
              })
            }
        )
      }
    },
    refresh_tree() {
      this.tb_loading = true
      this.$nextTick(() => {
        this.$refs.tree_cols.setAllTreeExpand(true)
        this.$refs.tree_cols.setAllCheckboxRow(true)
      })

    },
    openExportEvent() {
      this.$refs.data_table.exportData({type: 'csv'})()
    },

    tree_search: XEUtils.debounce(function () {
      this.handleSearch()
    }, 500, {leading: false, trailing: true}),
    data_search: XEUtils.debounce(function () {
      this.data_search_fn()
    }, 1500, {leading: false, trailing: true})
  },

  mounted() {
    this.get_tb_data()
  }

}
</script>

<style scoped>
.custom-radio {
  font-weight: bold;
  border-radius: 10px;
  margin-right: 10px;
  margin-top: 8px;
  padding: 10px;
  font-size: 12px;
  background-color: #D3CEFC;

}

.export-button {
  font-weight: bold;
  border-radius: 6px;
  margin-right: 10px;
  margin-top: 10px;
  padding: 10px;
  font-size: 14px;
  background-color: #D3CEFC;
  margin-left: 600px
}

.custom-table {
  width: 100%;
  border-radius: 2px;
  font-size: 12px;
  margin-top: 15px;
}

/*.vxe-header--column {*/
/*  padding: 4px 0;*/
/*  font-size: 12px;*/
/*  transition: none;*/
/*  cursor: default;*/
/*}*/

/*.col-1{*/
/*  display: block;*/
/*  width: 170px;*/
/*}*/

</style>