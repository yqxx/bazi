import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import { showToast } from 'vant'
import type { BaziRequest, BaziResult } from '@/services/deepseek'
import { analyzeBaziWithDeepSeek } from '@/services/deepseek'

// 性别：仅支持男性 / 女性，空字符串表示“未选择”
export type Gender = 'male' | 'female' | ''

export interface BaziFormState {
  name: string
  gender: Gender
  birthDate: string // YYYY-MM-DD
  birthTime: string // HH:mm
  city: string // 出生地（省市区拼接）
  topic: string
  question: string
}

function toIsoDatetime(dateStr: string, timeStr: string) {
  if (!dateStr) return ''
  const safeTime = /^\d{2}:\d{2}$/.test(timeStr) ? timeStr : '00:00'
  const merged = dayjs(`${dateStr}T${safeTime}:00`)
  return merged.isValid() ? merged.format('YYYY-MM-DDTHH:mm:ss') : `${dateStr}T${safeTime}:00`
}

export function useBaziAnalysis() {
  const form = ref<BaziFormState>({
    name: '',
    gender: '',
    birthDate: '',
    birthTime: '',
    city: '',
    topic: '未来 3 个月整体运势',
    question: '',
  })

  const loading = ref(false)
  const error = ref<string | null>(null)
  const result = ref<BaziResult | null>(null)

  // 必填：出生日期 + 出生地 + 性别
  const canSubmit = computed(
    () => !!form.value.birthDate && !!form.value.city && !!form.value.gender && !loading.value,
  )

  async function submit() {
    error.value = null
    result.value = null

    if (!form.value.birthDate) {
      error.value = '请先选择出生日期哦。'
      showToast({ message: error.value, duration: 2000 })
      return
    }

    if (!form.value.city) {
      error.value = '请选择出生地。'
      showToast({ message: error.value, duration: 2000 })
      return
    }

    if (!form.value.gender) {
      error.value = '请选择性别。'
      showToast({ message: error.value, duration: 2000 })
      return
    }

    const birthdayIso = toIsoDatetime(form.value.birthDate, form.value.birthTime)
    if (!birthdayIso) {
      error.value = '出生日期格式有点问题，请重新选择。'
      showToast({ message: error.value, duration: 2000 })
      return
    }

    const payload: BaziRequest = {
      name: form.value.name.trim() || undefined,
      gender: form.value.gender || undefined,
      birthday: birthdayIso,
      city: form.value.city.trim() || undefined,
      topic: form.value.topic.trim() || undefined,
      question: form.value.question.trim() || undefined,
    }

    loading.value = true
    try {
      const res = await analyzeBaziWithDeepSeek(payload)
      result.value = res
      showToast({ message: '推演完成', duration: 1200 })
    } catch (e: any) {
      error.value = e?.message || '请求失败，请稍后再试。'
      showToast({ message: error.value ?? '请求失败，请稍后再试。', duration: 2600 })
    } finally {
      loading.value = false
    }
  }

  return {
    form,
    loading,
    error,
    result,
    canSubmit,
    submit,
  }
}

