<template>
  <CRow>
    <CCol :xs="3">
      <CCard class="mb-4">
        <CCardHeader class="flex justify-between p-2">
          <span class="mb-1"> <strong>Event Types</strong> </span>
        </CCardHeader>
        <CCardBody>
          <CTable small>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">NAME</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="(row, index) in data" :key="index">
                <CTableDataCell
                  @click="setSelectedItem(row)"
                  :class="
                    (row.id === selectedItemId ? 'selected' : '') +
                    ' capitalize cursor-pointer'
                  "
                >
                  {{ row.name }}
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </CCol>
    <CCol :xs="9">
      <CCard class="mb-4">
        <CCardHeader class="flex justify-between">
          <span> Configure <strong>Budget Template</strong> </span>
          <CButton
            color="primary"
            class="float-right"
            size="sm"
            @click.prevent="handleClickAdd()"
          >
            Add
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CTable small>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Item Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
                <CTableHeaderCell scope="col"></CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="(row, index) in templateData" :key="index">
                <CTableHeaderCell scope="row">{{ index + 1 }}</CTableHeaderCell>
                <CTableDataCell>{{ row.title }}</CTableDataCell>
                <CTableDataCell>{{
                  parseFloat(row.unit_price_amount).toLocaleString()
                }}</CTableDataCell>
                <CTableDataCell width="200 text-end">
                  <CButton
                    color="warning"
                    size="sm"
                    class="mr-2"
                    @click.prevent="handleClickEdit(row)"
                  >
                    Edit
                  </CButton>
                  <CButton
                    color="danger"
                    size="sm"
                    @click.prevent="handleClickDelete(row)"
                  >
                    Delete
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </CCol>

    <CModal :visible="showModal" @close="handleModalClose">
      <CModalHeader dismiss @close="handleModalClose" class="flex">
        <CModalTitle>
          {{ mode === 'add' ? 'Add' : 'Edit' }} Budget Template Items
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm class="text-center">
          <CInputGroup class="mb-3">
            <CInputGroupText> Name: </CInputGroupText>
            <CFormInput v-model="form.title" />
          </CInputGroup>
          <CInputGroup class="mb-4">
            <CInputGroupText> Amount </CInputGroupText>
            <CFormInput v-model="form.unit_price_amount" />
          </CInputGroup>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="handleModalClose"> Close </CButton>
        <CButton color="primary" @click="onHandleSubmit">{{
          mode === 'add' ? 'Submit' : 'Save Changes'
        }}</CButton>
      </CModalFooter>
    </CModal>
  </CRow>
</template>

<script>
import Bee from '@/utils/Bee'
const getFormData = () => {
  return {
    title: '',
    unit_price_amount: 0,
    id: 1,
  }
}
export default {
  name: 'Expense Types',
  data: function () {
    return {
      data: [],
      showModal: false,
      form: getFormData(),
      mode: 'add',
      selectedItemId: 0,
      templateData: [],
    }
  },
  methods: {
    loadData() {
      var vm = this
      var data = {
        event_types: {},
      }
      //add token
      Bee.token = localStorage.getItem('token')
      Bee.get(data, false, vm)
        .then((res) => {
          vm.data = res.event_types
          vm.handleModalClose()
        })
        .catch((errors) => {
          console.log('Errors', errors)
        })
    },
    setSelectedItem(row) {
      this.selectedItemId = row.id
      //load template items
      this.loadTemplateItems()
    },
    loadTemplateItems() {
      var vm = this
      var data = {
        budget_templates: {
          _w: [['event_type_id', 'e', vm.selectedItemId]],
        },
      }
      //add token
      Bee.token = localStorage.getItem('token')
      Bee.get(data, false, vm)
        .then((res) => {
          vm.templateData = res.budget_templates
        })
        .catch((errors) => {
          console.log('Errors', errors)
        })
    },
    handleClickEdit(row) {
      this.form.id = row.id
      this.form.title = row.title
      this.form.unit_price_amount = row.unit_price_amount
      this.mode = 'edit'
      this.showModal = true
    },
    handleClickDelete(row) {
      var vm = this
      var data = {
        budget_template: {
          _w: [['id', 'e', row.id]],
        },
      }
      //add token
      Bee.token = localStorage.getItem('token')
      Bee.delete(data, false, vm)
        .then((res) => {
          vm.loadTemplateItems()
        })
        .catch((errors) => {
          console.log('Errors', errors)
        })
    },
    handleModalClose() {
      this.form = getFormData()
      this.showModal = false
    },
    onHandleSubmit() {
      var thisVM = this
      var method = 'post'
      var data = {
        budget_template: {
          event_type_id: thisVM.selectedItemId,
          is_group: 0,
          title: thisVM.form.title,
          quatity_needed: 0,
          unit_price_amount: thisVM.form.unit_price_amount,
          total_cost_price_amount: thisVM.form.unit_price_amount,
          remarks: '',
        },
      }
      if (thisVM.mode === 'edit') {
        data.budget_template._w = [['id', 'e', thisVM.form.id]]
        method = 'update'
      }
      //add token
      Bee.token = localStorage.getItem('token')
      Bee[method](data, false, thisVM)
        .then((res) => {
          thisVM.form = getFormData()
          thisVM.showModal = false
          thisVM.loadTemplateItems()
        })
        .catch((errors) => {
          console.log('Errors', errors)
        })
    },
    handleClickAdd() {
      this.mode = 'add'
      this.form = getFormData()
      this.showModal = true
    },
  },
  mounted() {
    this.loadData()
  },
}
</script>