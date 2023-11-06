<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader class="flex  justify-between">
            <span>
                Manage <strong>Event Types</strong>
            </span>
          <CButton color="primary" class="float-right" size="sm" @click.prevent="handleClickAdd()">
            Add
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CTable small>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">NAME</CTableHeaderCell>
                <CTableHeaderCell scope="col">DESCRIPTION</CTableHeaderCell>
                <CTableHeaderCell scope="col"></CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="(row, index) in data" :key="index">
                <CTableHeaderCell scope="row">{{ index + 1 }}</CTableHeaderCell>
                <CTableDataCell>{{ row.name }}</CTableDataCell>
                <CTableDataCell>{{ row.description }}</CTableDataCell>
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
          {{ mode === 'add' ? 'Add' : 'Edit' }} Event Type
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm class="text-center">
          <CInputGroup class="mb-3">
            <CInputGroupText> Name: </CInputGroupText>
            <CFormInput v-model="form.name" />
          </CInputGroup>
          <CInputGroup class="mb-4">
            <CInputGroupText> Description </CInputGroupText>
            <CFormTextarea v-model="form.description" />
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
    name: '',
    description: '',
    id: 0,
  }
}
export default {
  name: 'Event Types',
  data: function () {
    return {
      data: [],
      showModal: false,
      form: getFormData(),
      mode: 'add',
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
    handleClickEdit(row) {
      this.form.id = row.id
      this.form.name = row.name
      this.form.description = row.description
      this.mode = 'edit'
      this.showModal = true
    },
    handleClickDelete(row) {
      var vm = this
      var data = {
        event_type: {
          _w: [['id', 'e', row.id]],
        },
      }
      //add token
      Bee.token = localStorage.getItem('token')
      Bee.delete(data, false, vm)
        .then((res) => {
          vm.loadData()
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
      var method = "post";
      var data = {
        event_type: {
          name: thisVM.form.name,
          description: thisVM.form.description
        },
      }
      if(thisVM.mode === "edit"){
        data.event_type._w = [['id', 'e', thisVM.form.id]];
        method = "update"
      }
      //add token
      Bee.token = localStorage.getItem('token')
      Bee[method](data, false, thisVM)
        .then((res) => {
          thisVM.loadData();
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