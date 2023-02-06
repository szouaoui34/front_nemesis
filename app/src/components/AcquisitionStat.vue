<template>
  <div class="container-fluid">
    <el-radio-group v-model="current_view" @change="view_change">
      <el-radio-button class="custom-radio" label="na_ac_status">   NA Acquisition Status </el-radio-button>
      <el-radio-button class="custom-radio" label="na_ac_log">  NA Acquisition Log </el-radio-button>
      <el-radio-button class="custom-radio" label="daemon">  Server Daemon </el-radio-button>
      <el-radio-button class="custom-radio" label="table_sync">  ES / SQL table sync </el-radio-button>
    </el-radio-group>


    <vxe-table
        :key="Math.random()"
        border
        class="custom-table"
        :data="tableData"
        ref="acq_table"
        size="normal"
        header-row-class-name="booking-table-header">

      <vxe-table-column
          v-for="(column, index) in table_columns"
          :key="index"
          :type="column.type"
          :field="column.field"
          :title="column.title"
          :fixed="column.fixed"
          :width="column.width"
          :filters="column.filters"
          :filter-method="column.filterNameMethod"
          :sortable="column.sortable"

      ></vxe-table-column>
    </vxe-table>


  </div>


</template>

<script>
import axios from 'axios'
import _ from 'lodash'


export default {

  name: "AcquisitionStat",

  data() {
    return {
      pre_table_data: [],
      tableData: [],
      table_columns: [],
      view_store: {
        na_ac_status: {
          url: 'task/na_ac_status', table_columns: [
            {
              field: 'task_name',
              title: 'Task Name',
              sortable: true,
              resizable: true,
              has_filter: true,
              'filter-method': this.filterNameMethod
            },
            {
              field: 'netact',
              title: 'Netact',
              sortable: true,
              resizable: true,
              has_filter: true,
              'filter-method': this.filterNameMethod
            },
            {
              field: 'acquisition_date',
              title: 'Acquisition Date',
              sortable: true,
              resizable: true,

            },
            {
              field: 'current_hour',
              title: 'DB Date',
              sortable: true,
              resizable: true,
            }, {
              field: 'etat',
              title: 'State',
              sortable: true,
              resizable: true,
              has_filter: true,
              'filter-method': this.filterNameMethod
            },
            {
              field: 'duration',
              title: 'Duration',
              sortable: true,
              has_filter: true,
            }
          ]
        },
        na_ac_log: {
          url: 'task/na_ac_log', table_columns: [
            {
              field: 'task_name',
              title: 'Task Name',
              sortable: true,
              resizable: true,
              has_filter: true,
              'filter-method': this.filterNameMethod
            },
            {
              field: 'netact',
              title: 'Netact',
              sortable: true,
              resizable: true,
              has_filter: true,
              'filter-method': this.filterNameMethod
            },
            {

              field: 'ac_date',
              title: 'Acquisition Date',
              sortable: true,
              resizable: true,
            },
            {
              field: 'request_date',
              title: 'Requested Date',
              sortable: true,
              resizable: true,
            },
            {
              field: 'available_date',
              title: 'Available Date',
              sortable: true,
              resizable: true,
            },
            {
              field: 'ac_status',
              title: 'Status',
              sortable: true,
              resizable: true,
              has_filter: true,
              'filter-method': this.filterNameMethod
            },
            {
              field: 'username',
              title: 'UserName',
              sortable: true,
              resizable: true,
              has_filter: true,
            },

          ]
        },
        daemon: {
          url: 'task/daemon_status', table_columns: [
            {
              field: 'id',
              title: 'ID',
              sortable: true,
              resizable: true,
            },
            {
              field: 'task_name',
              title: 'Task Name',
              sortable: true,
              resizable: true,
            },
            {
              field: 'etat',
              title: 'State',
              sortable: true,
              resizable: true,
              has_filter: true,
            },
            {
              field: 'update_date',
              title: 'Refresh Date',
              sortable: true,
              resizable: true,
            },
            {
              field: 'check_periods_mn',
              title: 'Refresh Period (mn)',
              sortable: true,
              resizable: true,
            },
            {
              field: 'max_age_hour',
              title: 'Max age (H)',
              sortable: true,
              resizable: true,
            },
            {
              field: 'hour_range',
              title: 'activity hour permission',
              sortable: true,
              resizable: true,
            },
            {
              field: 'comment',
              title: 'Description',
              sortable: true,
              resizable: true,
            },
          ]
        },
        table_sync: {
          url: 'task/table_sync', table_columns: [
            {
              // key: 1,
              field: 'task_name',
              title: 'Report Name',
              sortable: true,
              resizable: true,

            },
            {

              field: 'last_report_date',
              title: 'SQL Last Date',
              sortable: true,
              resizable: true,

            },
            {
              field: 'last_es_date',
              title: 'ES Last Date',
              sortable: true,
              resizable: true,

            },
            {
              field: 'es_sync',
              title: 'ES Synchro',
              sortable: true,
              resizable: true,
            },

          ]
        }
      },
      current_view: 'na_ac_status',

    }

  },
  methods: {

    resetFilters() {
      this.$refs.acq_table.clearFilter();
        this.$nextTick(() => {
                    this.$refs.acq_table.refresh()
                })

    },
    get_view_data(view_name) {

      let url = this.view_store[view_name]['url']
      axios
          .get(url)
          .then(response => {
            this.pre_table_data = response.data
          })
          .catch(function (e) {
            alert('erreur de chargement', e)
          })

    },
    set_filter(current_view) {
      let cols = this.view_store[current_view].table_columns
      let self = this
      _.map(cols, (c) => {
        if (!_.has(c, 'has_filter')) {
          return false
        }
        c.filters = self.getnametask(c.field)
      })
      this.table_columns = cols
    },
    getnametask(name) {

      let filter_list = {}
      let tb_data = this.pre_table_data
      let value_list = _.uniq(_.map(tb_data, name))

      filter_list = _.map(value_list, (e) => {
        return {label: e, value: e}
      })

      return filter_list
    },
    filterNameMethod({value, row, column}) {
      return row[column.property] === value
    },
    view_change() {
      this.resetFilters()
      this.get_view_data(this.current_view)
    },
  },
  watch: {
    pre_table_data() {
      this.tableData = this.pre_table_data
      this.set_filter(this.current_view)
    },
  },
  created() {
    this.get_view_data('na_ac_status')
  }
}

</script>

<style scoped>
.custom-radio {
  font-weight: bold;
  font-family: Cambria;
  border-radius: 10px;
  margin-right: 10px;
  margin-bottom: 8px;
  margin-top: 5px;
  padding: 10px;
  font-size: 12px;
  background-color: #D3CEFC;

}

.custom-table {
  width: 100%;
  border-radius: 2px;
  font-size: 12px;
  /*padding: 5px;*/
}

.custom-table booking-table-header th {
  text-transform: uppercase;
  background-color: #D3CEFC;
}


</style>