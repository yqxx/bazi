<script setup lang="ts">
import { computed, ref } from 'vue'
import { marked } from 'marked'
import { areaList } from '@vant/area-data'
import type { BaziResult } from '@/services/deepseek'
import type { BaziFormState, Gender } from '@/composables/useBaziAnalysis'

marked.setOptions({ gfm: true, breaks: true })

const props = defineProps<{
  modelValue: BaziFormState
  loading: boolean
  canSubmit: boolean
  error: string | null
  result: BaziResult | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: BaziFormState): void
  (e: 'submit'): void
}>()

const showTopic = ref(false)
const showGender = ref(false)
const showDate = ref(false)
const showTime = ref(false)
const showArea = ref(false)

const areaListData = areaList

const topicOptions = [
  '感情走向 / 复合可能',
  '未来 3 个月整体运势',
  '事业与工作选择',
  '人际 / 合作关系',
  '单纯想找人聊聊',
]

const genderOptions: Array<{ text: string; value: Gender }> = [
  { text: '女性', value: 'female' },
  { text: '男性', value: 'male' },
]

const topicColumns = computed(() => topicOptions.map((t) => ({ text: t, value: t })))
const genderColumns = computed(() => genderOptions.map((g) => ({ text: g.text, value: g.value })))

function update(patch: Partial<BaziFormState>) {
  emit('update:modelValue', { ...props.modelValue, ...patch })
}

const birthDateLabel = computed(() => props.modelValue.birthDate || '请选择')

/** 日期选择器绑定值：未选时默认 1990-01-01，避免打开时显示 1900 年 */
const datePickerValue = computed({
  get(): string[] {
    const d = props.modelValue.birthDate
    if (d) {
      const [y, m, day] = d.split('-')
      return [y || '1990', m?.padStart(2, '0') || '01', day?.padStart(2, '0') || '01']
    }
    return ['1990', '01', '01']
  },
  set(v: string[]) {
    if (v?.length >= 3) update({ birthDate: v.join('-') })
  },
})
const birthTimeLabel = computed(() => props.modelValue.birthTime || '可不填')
const birthPlaceLabel = computed(() => props.modelValue.city || '请选择')

/** 时间选择器列显示为「08 时」「30 分」 */
function timeFormatter(type: string, option: { text?: string | number }) {
  const t = option.text != null ? String(option.text) : ''
  if (type === 'hour') return { ...option, text: `${t} 时` }
  if (type === 'minute') return { ...option, text: `${t} 分` }
  return option
}
const genderLabel = computed(
  () => genderOptions.find((g) => g.value === props.modelValue.gender)?.text || '请选择',
)

const resultHtml = computed(() => {
  if (!props.result?.rawText) return ''
  return marked.parse(props.result.rawText) as string
})
</script>

<template>
  <div class="hero-form" id="form">
    <div class="hero-form-title">简单写下你此刻最在意的一个问题</div>

    <van-form @submit="() => emit('submit')">
      <div class="form-row">
        <div class="form-field">
          <van-field
            label="主题"
            readonly
            clickable
            :model-value="modelValue.topic"
            placeholder="请选择"
            @click="showTopic = true"
          />
        </div>
      </div>

      <div class="form-group form-group-birth">
        <div class="form-row">
          <div class="form-field">
            <van-field
              label="出生日期"
              readonly
              clickable
              :model-value="birthDateLabel"
              placeholder="请选择"
              :rules="[{ required: true, message: '请先选择出生日期哦。' }]"
              @click="showDate = true"
            />
          </div>
          <div class="form-field">
            <van-field
              label="出生时间"
              readonly
              clickable
              :model-value="birthTimeLabel"
              placeholder="选填"
              @click="showTime = true"
            />
          </div>
        </div>
      </div>

      <div class="form-row">
        <div class="form-field">
          <van-field
            label="出生地"
            readonly
            clickable
            :model-value="birthPlaceLabel"
            placeholder="请选择"
            :rules="[{ required: true, message: '请选择出生地。' }]"
            @click="showArea = true"
          />
        </div>
      </div>

      <div class="form-row">
        <div class="form-field">
          <van-field
            :model-value="modelValue.name"
            label="称呼"
            placeholder="选填"
            @update:model-value="(v) => update({ name: v })"
          />
        </div>
        <div class="form-field">
          <van-field
            label="性别"
            readonly
            clickable
            :model-value="genderLabel"
            placeholder="请选择"
            :rules="[{ required: true, message: '请选择性别。' }]"
            @click="showGender = true"
          />
        </div>
      </div>

      <div class="form-field">
        <van-field
          :model-value="modelValue.question"
          name="question"
          label="故事"
          type="textarea"
          rows="3"
          autosize
          placeholder="选填，例如：是否换工作、感情进展…"
          @update:model-value="(v) => update({ question: v })"
        />
      </div>

      <div class="form-row form-row-actions">
        <div class="hero-note">结果会在 <b>几秒内</b> 返回；请理性参考、温柔对待自己。</div>
        <van-button class="vant-btn" native-type="submit" type="primary" :loading="loading" :disabled="!canSubmit" round>
          <span class="icon">✶</span>
          <span v-if="!loading">发送给宇宙与命盘</span>
          <span v-else>正在为你推演中…</span>
        </van-button>
      </div>
    </van-form>

    <van-notice-bar v-if="error" class="error-bar" color="#a23c55" background="rgba(255,183,197,0.18)">
      {{ error }}
    </van-notice-bar>

    <div v-if="result" class="result-box" aria-live="polite">
      <div class="result-header">
        <h2 class="result-title">你的八字小人生说明书</h2>
        <p class="result-summary">{{ result.summary }}</p>
      </div>
      <div class="result-body" v-html="resultHtml" />
    </div>

    <!-- Topic Picker -->
    <van-popup v-model:show="showTopic" position="bottom" round>
      <van-picker
        title="选择主题"
        :columns="topicColumns"
        @confirm="(v) => { update({ topic: (v as any).value ?? (v as any).text }); showTopic = false }"
        @cancel="showTopic = false"
      />
    </van-popup>

    <!-- Gender Picker -->
    <van-popup v-model:show="showGender" position="bottom" round>
      <van-picker
        title="选择性别"
        :columns="genderColumns"
        @confirm="(v) => { update({ gender: (v as any).value as Gender }); showGender = false }"
        @cancel="showGender = false"
      />
    </van-popup>

    <!-- Date Picker：生日日期，最小 1950，未选时默认显示 1990 -->
    <van-popup v-model:show="showDate" position="bottom" round>
      <van-date-picker
        v-model="datePickerValue"
        title="选择出生日期"
        :min-date="new Date(1950, 0, 1)"
        :max-date="new Date()"
        @confirm="(v) => { update({ birthDate: (v as any).selectedValues?.join('-') || '' }); showDate = false }"
        @cancel="showDate = false"
      />
    </van-popup>

    <!-- Time Picker：生日时间，列显示为「时」「分」 -->
    <van-popup v-model:show="showTime" position="bottom" round>
      <van-time-picker
        title="选择出生时间"
        :formatter="timeFormatter"
        @confirm="(v) => { update({ birthTime: (v as any).selectedValues?.join(':') || '' }); showTime = false }"
        @cancel="showTime = false"
      />
    </van-popup>

    <!-- Area Picker -->
    <van-popup v-model:show="showArea" position="bottom" round>
      <van-area
        title="选择出生地"
        :area-list="areaListData"
        @confirm="(e) => { const opts = (e && (e as { selectedOptions?: Array<{ text?: string }> }).selectedOptions) || []; update({ city: opts.map((v: { text?: string }) => v?.text ?? '').filter(Boolean).join(' ') || '' }); showArea = false }"
        @cancel="showArea = false"
      />
    </van-popup>
  </div>
</template>

<style lang="less" scoped>
.form-group {
  margin-bottom: var(--space-3);
}
/* 防止 label 换行，统一宽度 */
:deep(.van-cell__title) {
  flex: 0 0 4.2em;
  max-width: 4.2em;
}
:deep(.van-field__label) {
  white-space: nowrap;
}
.error-bar {
  margin-top: var(--space-3);
  border-radius: 12px;
}

/* 结果区：Markdown 渲染样式 */
.result-box {
  .result-header {
    margin-bottom: var(--space-3);
    padding-bottom: var(--space-2);
    border-bottom: 1px solid rgba(122, 104, 143, 0.15);
  }
  .result-title {
    font-size: 15px;
    font-weight: 700;
    margin: 0 0 6px;
    color: var(--color-text-main);
  }
  .result-summary {
    font-size: 12px;
    color: var(--color-text-sub);
    margin: 0;
    line-height: 1.5;
  }
  .result-body {
    font-size: 13px;
    line-height: 1.75;
    color: var(--color-text-main);
    word-break: break-word;
    :deep(p) {
      margin: 0 0 0.75em;
      &:last-child { margin-bottom: 0; }
    }
    :deep(strong) {
      font-weight: 600;
      color: var(--color-text-main);
    }
    :deep(h2) {
      font-size: 14px;
      font-weight: 600;
      margin: 1em 0 0.5em;
      color: var(--color-text-main);
      &:first-child { margin-top: 0; }
    }
    :deep(h3) {
      font-size: 13px;
      font-weight: 600;
      margin: 1em 0 0.4em;
      color: var(--color-text-main);
    }
    :deep(ul) {
      margin: 0.4em 0 0.75em;
      padding-left: 1.2em;
    }
    :deep(li) {
      margin-bottom: 0.25em;
    }
    :deep(blockquote) {
      margin: 1em 0;
      padding: 0.6em 0.8em;
      border-left: 3px solid rgba(200, 155, 255, 0.5);
      background: rgba(200, 155, 255, 0.06);
      border-radius: 0 8px 8px 0;
      font-size: 12px;
      color: var(--color-text-sub);
      :deep(p) { margin: 0; }
    }
  }
}
</style>

