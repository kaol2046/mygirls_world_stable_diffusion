<script setup lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'

import { computed, ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import type { FormInstance, UploadFile } from 'element-plus'

import promptsPaths from '@/assets/prompt'
import sdPics from '@/assets/sd_pics'

import { PictureRounded } from '@element-plus/icons-vue'

import { useDark, useToggle } from '@vueuse/core'
const isDark = useDark()

const i18n = useI18n()
const { messages, locale }: any = useI18n()

const supportLocales = [
  {"name": "en", "label": "English"}, 
  {"name": "ko", "label": "한국어"}, 
  {"name": "ja", "label": "日本語"},
]

const elLocale = ref(messages.value[localStorage.getItem('language') || 'en']) 

const toggleLanguage = (command: string) => {
  localStorage.setItem('language', command)
  
  locale.value = localStorage.getItem('language')
  elLocale.value = messages.value[locale.value]
}



const activeName = ref(promptsPaths[0].label)

const promptClick = (prompt: { label: string; value: string; }) => {
  // console.log("click " + prompt)

  if(form1Generating.value === true) {
    return
  }

  const index = value.value.indexOf(prompt.value)

  if(index >= 0) {
    value.value.splice(index, 1);
  } else {
    value.value.push(prompt.value)
  }
}


const value = ref<string[]>([])
const options = computed(() => (promptsPaths.map((category) => {
  const label = i18n.t(category.label)
  return {
    value: `${category.label}`,
    label: `${label}`,
    options: category.prompts.map((prompt) => ({
      value: `${prompt.value}`,
      label: `${i18n.t(prompt.label)}`,
    })),
  }
})))

const DiscordURL = "https://discord.gg/VnYYSmZ3KB"

const MyGirlsHostURL = "http://www.mygirls.world"
const seed = Math.floor(Math.random() * (90808+1))

// App1 Form
const form1  = reactive({
  "prompt": value,
  "prompt_zh": [],
  "seed": seed,
  "image_proportion": "2:3",
  "lora": []
})

const form1Ref = ref<FormInstance>()
const form1Generating = ref(false)
const form1ResultImageSrc = ref<string>()

const submitForm1 = (formEl: FormInstance | undefined) => {
  form1Generating.value = true
  axios.post(`${MyGirlsHostURL}:8005/generate_DAN/`, form1)
    .then((response) => {
      // console.log(response);

      form1Generating.value = false

      if(!response.data['image_url']) {
        ElMessage.error(`Error ${response.data["code"] }: ${response.data["msg"] }`)
        return
      }

      form1ResultImageSrc.value = response.data['image_url']
    })
    .catch((error) => {

      form1Generating.value = false

      console.error(error);

      ElMessage.error(error)
    })
}

const resetForm1 = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  form1ResultImageSrc.value = ''
}



// App2 Form
const form2  = reactive({
  "width": 0,
  "height": 0,
  "seed": seed,
  "base64": ""
})

const handleChange = (uploadFile: UploadFile) => {
  // console.log(uploadFile)

  form2ResultImageSrc.value = ''

  const reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw as File)
  reader.onload = () => {
    // console.log('file base64 ' + reader.result)

    form2.base64 = reader.result as string

    const image = new Image()
    image.onload = () => {
      const width = image.width
      const height = image.height

      console.log(`width ${width} height ${height}`)

      form2.width = width
      form2.height = height
    }

    image.src = form2.base64

  }
  reader.onerror = function (error) {
    console.log('Error: ', error)
  }
}


const form2Ref = ref<FormInstance>()
const form2Generating = ref(false)
const form2ResultImageSrc = ref<string>()

const submitForm2 = (formEl: FormInstance | undefined) => {
  form2Generating.value = true
  axios.post(`${MyGirlsHostURL}:8005/generate_2DTO3D_DAN/`, form2)
    .then((response) => {
      console.log(response);
      
      form2Generating.value = false

      if(!response.data['image_url']) {
        ElMessage.error(`Error ${response.data["code"] }: ${response.data["msg"] }`)
        return
      }

      form2ResultImageSrc.value = response.data['image_url']
    })
    .catch((error) => {

      form2Generating.value = false

      console.error(error);

      ElMessage.error(error)
    })
}

const resetForm2 = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  // console.log('form2 clean')
  formEl.resetFields()
  form2ResultImageSrc.value = ''
}

</script>

<template>
  <el-config-provider :locale="elLocale">
    <el-container>
      <el-header>

        <div class="nav">
          
          <div class="nav-item-center">
            <el-link :underline="false" :href="DiscordURL" target="_blank">
              <img alt="Discord" class="" :src="`https://img.shields.io/badge/Discord-${$t('Discord.JoinChat')}-brightgreen?style=for-the-badge&logo=discord&labelColor=ffffff`" />
            </el-link>
          </div>
          
          
          
          <el-dropdown size="large" @command="toggleLanguage">
            <span class="el-dropdown-link">

              <el-button circle size="large">
                <el-icon class="" :size="24">
                  <icon-material-symbols-language-korean-latin-rounded />
                </el-icon>
              </el-button>
            </span>

            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="(item, index) in supportLocales" :key="index" :command="item.name">{{item.label}}</el-dropdown-item>
                <!-- <el-dropdown-item command="en">English</el-dropdown-item>
                <el-dropdown-item command="ko">한국어</el-dropdown-item>
                <el-dropdown-item command="ja">日本語</el-dropdown-item> -->
              </el-dropdown-menu>
            </template>
          </el-dropdown>

        </div>

        <img alt="MyGirls.AI Logo" class="logo" src="@/assets/logo.png" width="186" height="186" />
        
      </el-header>
      <el-main>


        <el-space direction="vertical" style="width: 100%;">
          <el-text size="large" tag="b"><em>Special Thanks</em></el-text>

          <el-link :underline="false" href="https://opendan.ai" target="_blank">
            <img src="@/assets/LOGO_DAN.svg"  width="180" height="71" />
          </el-link>
          
          <el-text>GPU computing power provider</el-text>
        </el-space>


        <section class="section-panel">

          <el-text class="" size="large" tag="b">1. {{$t('Title.AppA')}}</el-text>

          <!-- <el-empty :image-size="200" /> -->

          <el-tabs v-model="activeName" class="keywords-tabs"
            style="margin-top: 12px;">
            <el-tab-pane v-for="(item, index) in promptsPaths" :label="$t(item.label)" :key="index" :name="item.label" class="prompt-tab-pane">
              <el-tag v-for="(prompt, indexPath) in item.prompts" :key="indexPath" size="large" round effect="plain" @click="promptClick(prompt)">
                {{$t(prompt.label)}}
              </el-tag>
            </el-tab-pane>
          </el-tabs>



          <div style="margin-top: 24px;">
            <el-form
              ref="form1Ref"
              label-position="top"
              style="max-width: 100%"
              :model="form1"
            >
              <el-form-item :label="$t('Form.Prompt.Tag')">
                <el-select-v2
                  v-model="value"
                  :options="options"
                  :placeholder="$t('Form.Prompt.EnterKeywords')"
                  style="width: 100%"
                  size="large"
                  multiple
                  :disabled="form1Generating"
                />
              </el-form-item>

              <el-form-item label="" prop="prompt">
                <el-input
                  name="message"
                  v-model="form1.prompt"
                  :autosize="{ minRows: 4 }"
                  type="textarea"
                  placeholder=""
                  size="large"
                  readonly
                />
              </el-form-item>

              
              <el-button-group size="large">
                <el-button type="primary" @click="submitForm1(form1Ref)" 
                  :disabled="form1.prompt.length <= 0"
                  :loading="form1Generating"
                  >
                  {{ $t("Button.Generate") }}
                </el-button>

                <el-button @click="resetForm1(form1Ref)"
                  :disabled="form1Generating">
                  {{ $t("Button.Clear") }}
                </el-button>
              </el-button-group>
              

              <div v-if="form1ResultImageSrc" style="margin-top: 24px;">
                <el-image :src="form1ResultImageSrc" style="width: 100%;"
                  :zoom-rate="1.2"
                  :preview-src-list="[form1ResultImageSrc]"
                  :initial-index="0"
                  preview-teleported=true
                  >
                </el-image>
              </div>
              
              
            </el-form>
            
          </div>
          
        </section>

        <section class="section-panel">

          <el-text class="" size="large" tag="b">2. {{$t('Title.AppB')}}</el-text>


          <el-form-item label="" style="width: 100%;margin-top: 12px;">
            <el-upload
              drag
              style="width: 100%;"
              :show-file-list=false
              :auto-upload=false
              accept=".jpg,.jpeg,.png"
              :on-change="handleChange"
              :disabled="form2Generating"
            >
              <el-icon class="el-icon--upload"><PictureRounded /></el-icon>
              <div class="el-upload__text">
                {{ $t("Form.Upload.DropOr") }} <em>{{ $t("Form.Upload.Click") }}</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  <!-- jpg/png files with a size less than 500kb -->
                </div>
              </template>
            </el-upload>
          </el-form-item>

          <el-button-group size="large" >
            <el-button type="primary" @click="submitForm2(form2Ref)"
                :disabled="form2.base64.length <= 0"
                :loading="form2Generating">
              {{ $t("Button.Generate") }}
            </el-button>

            <el-button @click="resetForm2(form2Ref)"
              :disabled="form2Generating"
              >
              {{ $t("Button.Clear") }}
            </el-button>
          </el-button-group>


          <el-form hidden
              ref="form2Ref"
              label-position="top"
              :model="form2">
            <el-form-item label="" prop="base64">
              <el-input v-model="form2.base64"></el-input>
            </el-form-item>

            <el-form-item label="" prop="height">
              <el-input v-model="form2.height"></el-input>
            </el-form-item>
            <el-form-item label="" prop="width">
              <el-input v-model="form2.width"></el-input>
            </el-form-item>
          </el-form>


          <div class="pic2pic-result-panel" v-if="form2.base64">
            <el-image
              :src="form2.base64"
              :zoom-rate="1.2"
              :preview-src-list="[form2.base64]"
              :initial-index="0"
              fit="cover"
              lazy=true
              preview-teleported=true
            />


            <el-image :src="form2ResultImageSrc"
              :zoom-rate="1.2"
              :preview-src-list="[form2ResultImageSrc]"
              :initial-index="0"
              preview-teleported=true
              v-loading="form2Generating"
              >
              
              <template #error>
                <div class="image-slot el-image__error">
                  <!-- <el-icon><icon-picture /></el-icon> -->
                </div>
              </template>
            </el-image>
          </div>
          
        </section>


        <section class="sd-pic-panel">


          <div class="pic-wrap" shadow="always" v-for="(picItem, index) in sdPics"
              :key="index">
            <el-image
              :src="picItem.src"
              :zoom-rate="1.2"
              :preview-src-list="[picItem.src]"
              :initial-index="0"
              fit="cover"
              lazy=true
              preview-teleported=true
            />
            <el-tag size="large"><em># {{ picItem.name }}</em></el-tag>
          </div>

          

        </section>

      </el-main>
      <el-divider />
      <el-footer>
        <div style="margin-bottom: 12px;">
          <el-link :href="DiscordURL" target="_blank" :underline="false">
            <el-icon class="" :size="32">
              <icon-ic-baseline-discord />
            </el-icon>
          </el-link>


          <el-link :underline="false" style="margin-left: 12px;">
            <el-icon class="" :size="32">
              <icon-mdi-github />
            </el-icon>
          </el-link>
          
        </div>
        <el-text size="large">Copyright © 2023 MyGirls.AI. All rights reserved.</el-text>
      </el-footer>
    </el-container>

    <el-backtop />


    <!-- <header>
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

      <div class="wrapper">
        <HelloWorld msg="You did it!" />

        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/about">About</RouterLink>
        </nav>
      </div>
    </header> 

    <RouterView /> -->

    
  </el-config-provider>

</template>

<style scoped>
.el-image {
  border-radius: var(--el-border-radius-base);
}

.el-header {
  background: var(--el-color-primary);
  background-image: url('@/assets/banner.jpg');
  background-size: 95% auto;
  height: 250px;
}


.logo {
  display: block;
  margin: 0 auto 2rem;
}

.nav {
  padding-top: 18px;
  padding-bottom: 0;
  display: flex;
  align-items:center;
}

.nav .nav-item-center {
    flex-grow: 1;
}




.section-panel {
  border: 1px solid var(--border-color);
  border-radius: var(--el-border-radius-base);
  background-color: var(--bg-color);
  padding: 1.5rem;
  margin-top: 1.5rem;
}
.prompt-tab-pane {
  display: flex;
  flex-wrap: wrap;
  column-gap: 6px;
  row-gap: 4px;
}

.prompt-tab-pane .el-tag {
  cursor: pointer;
}


.pic2pic-result-panel {
  margin-top: 24px;
  column-count: 2;
  column-gap: 12px;
  display: flex;
}

.pic2pic-result-panel > .el-image {
  width: 100%;
}

.sd-pic-panel {
  margin-top: 24px;
  column-count: 2;
  column-gap: 8px;
}

.sd-pic-panel .pic-wrap, .sd-pic-panel .el-image {
  width: 100%;
}



.pic-wrap .el-tag {
  position: absolute;
  left: 12px;
  top: 12px;
  text-transform: uppercase;
}

.pic-wrap .el-image>:hover {
  transform: scale(1.06);
  transition: 0.5s ease;
}

.el-footer {
  text-align: center;
  height: 120px;
}


@media (max-width: 768px) {
  .nav {
    text-align: center;
    padding-left: 40px;
  }

  .section-panel {
    border: none;
    padding: 1em 0;
  }
}

@media (min-width: 768px) {
  .sd-pic-panel {
    column-count: 3;
  }
}


@media (min-width: 992px) {

  .el-main {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .section-panel, .sd-pic-panel {
    width: 952px;
  }
}


</style>
