import { createI18n } from 'vue-i18n'
// import zhCn from './zh-cn'
import en from './en'
import ko from './ko'
import ja from './ja'


import el_en from 'element-plus/lib/locale/lang/en'
import el_ko from 'element-plus/lib/locale/lang/ko'
import el_ja from 'element-plus/lib/locale/lang/ja'

const messages = {
	[el_en.name]: {
		...el_en,
		...en,
	},

  [el_ko.name]: {
		...el_ko,
		...ko,
	},

  [el_ja.name]: {
		...el_ja,
		...ja,
	},
}


// 创建 i18n
const i18n = createI18n({
  legacy: false,
  globalInjection: true, // 全局模式，可以直接使用 $t
  silentFallbackWarn: true,
	fallbackWarn: false,
  locale: localStorage.getItem('language') || el_en.name,
  fallbackLocale: el_en.name,
	messages,

  // messages: {
  //   'zh-cn': zhCn,
  //   'en': en,
  //   'ko': ko,
  //   'ja': ja
  // }
})

export default i18n