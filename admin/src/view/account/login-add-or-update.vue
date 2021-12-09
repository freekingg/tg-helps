<template>
  <el-dialog v-model="visible" title="Tips" :close-on-click-modal="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" label-width="120px">
      <el-form-item prop="phone" label="电话号码">
        <el-input disabled v-model="dataForm.phone" placeholder="请输入手机号带 + " />
      </el-form-item>
      <el-form-item prop="loginType" label="登录">
        <el-radio-group v-model="dataForm.loginType">
          <el-radio :label="1">二维码</el-radio>
          <el-radio :label="2" disabled>验证码</el-radio>
        </el-radio-group>

        <p>请扫描以下二维码有登录</p>
        <el-image src="https://placekitten.cosm/300/300">
          <template #placeholder>
            <div class="image-slot">
              <el-button type="primary" :loading="loadQr">加载二维码</el-button>
            </div>
          </template>
          <template #error>
            <div class="image-slot">
             <el-button type="primary" @click="authLoginHandle" :loading="loadQr">重新加载</el-button>
            </div>
          </template>
        </el-image>
      </el-form-item>
      <el-form-item prop="authData" label="验权信息">
        <el-input
          size="medium"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 8 }"
          placeholder="此处理不需要填写"
          readonly
          v-model="dataForm.authData"
        ></el-input>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { reactive, toRefs, nextTick, ref } from 'vue'
import { ElMessage } from 'element-plus'
import accountModel from '@/model/account'

export default {
  emits: ['refreshDataList'],

  setup(props, context) {
    const dataFormRef = ref(null)
    const visible = ref(false)

    const data = reactive({
      dataForm: {
        id: '',
        phone: '',
        loginType: 1,
      },
      dataRule: {
        phone: [{ required: true, message: '请输入号码', trigger: 'blur' }],
      },
      loading: false,
      loadQr: false,
    })

    const init = () => {
      visible.value = true
      nextTick(async () => {
        dataFormRef.value.resetFields()
        console.log('dataForm', data.dataForm)
        if (data.dataForm.id) {
          const info = await accountModel.getAccount(data.dataForm.id)
          data.dataForm = info
          data.dataForm.loginType = 1
        }
      })
    }
    const resetForm = () => {
      dataFormRef.value.resetFields()
    }
    const authLoginHandle = async () => {
      const info = await accountModel.authLogin(data.dataForm)
      console.log('info: ', info);
    }

    // 表单提交
    const dataFormSubmitHandle = async () => {
      dataFormRef.value.validate(async valid => {
        if (!valid) {
          // this.$message.error('请将信息填写完整')
          return false
        }

        if (!data.dataForm.id) {
          try {
            data.loading = true
            await accountModel.createAccount(data.dataForm)
            ElMessage({
              message: '添加成功',
              type: 'success',
              duration: 500,
              onClose: () => {
                visible.value = false
                context.emit('refreshDataList')
              },
            })
          } catch (e) {
            data.loading = false
            console.log(e)
          }
        } else {
          try {
            data.loading = true
            await accountModel.editAccount(data.dataForm.id, data.dataForm)
            ElMessage({
              message: '修改成功',
              type: 'success',
              duration: 500,
              onClose: () => {
                visible.value = false
                context.emit('refreshDataList')
              },
            })
          } catch (e) {
            data.loading = false
            console.log(e)
          }
        }
      })
    }

    return {
      ...toRefs(data),
      dataFormRef,
      init,
      resetForm,
      dataFormSubmitHandle,
      authLoginHandle,
      visible,
    }
  },
}
</script>
