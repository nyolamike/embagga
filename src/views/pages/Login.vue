<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="5">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm class="text-center">
                  <img class="w-25" :src="LogoImg" alt="logo" />
                  <h4 class="text-medium-emphasis mb-5">
                    Administration Login
                  </h4>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon :content="cilPhone" />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Phone Number"
                      autocomplete="phonenumber"
                      type="tel"
                      v-model="form.phoneNumber"
                    />
                  </CInputGroup>
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autocomplete="current-password"
                      v-model="form.password"
                    />
                  </CInputGroup>
                  <CRow>
                    <CCol :xs="6" class="text-start">
                      <CButton
                        type="button"
                        @click.prevent="onHandleSubmit"
                        color="primary"
                        class="px-4"
                      >
                        Login
                      </CButton>
                    </CCol>
                    <CCol :xs="6" class="text-end">
                      <CButton color="link" class="px-0">
                        Forgot password?
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import LogoImg from '@/assets/images/logo.jpg'
import { cilPhone } from '@coreui/icons'
import Bee from '@/utils/Bee'
export default {
  name: 'Login',
  data: function () {
    return {
      LogoImg: LogoImg,
      cilPhone,
      form: {
        phoneNumber: '',
        password: '',
      },
    }
  },
  methods: {
    onHandleSubmit() {
      //
      var vm = this;
      var data = {
        _f_login: {
          email: vm.form.phoneNumber,
          password: vm.form.password,
        },
      }
      console.log("data:", data);
      //remove token
      Bee.token = ''
      Bee.post(data, false, vm)
        .then((res) => {
          let user = res._f_login.user
          var isAdmin = false
          for (let index = 0; index < user.user_roles.length; index++) {
            const user_role = user.user_roles[index]
            if (parseInt(user_role.role_id) <= 2) {
              isAdmin = true
              break
            }
          }
          if (isAdmin) {
            localStorage.setItem("token", res._f_login.token);
            localStorage.setItem("user", JSON.stringify(user));
            vm.$router.push("/dashboard");
          } else {
            console.log("Account Not Found");
          }
        })
        .catch((errors) => {
          console.log("Errors", errors);
        })
    },
  },
  mounted() { 
  },
}
</script>
