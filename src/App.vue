<script setup lang="ts">
import { ref } from 'vue'
import HeroBaziForm from '@/components/HeroBaziForm.vue'
import { useBaziAnalysis } from '@/composables/useBaziAnalysis'

const { form, loading, error, result, canSubmit, submit } = useBaziAnalysis()
const showNavPopup = ref(false)

function scrollToForm() {
  document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' })
  showNavPopup.value = false
}

function scrollToStories() {
  document.getElementById('stories')?.scrollIntoView({ behavior: 'smooth' })
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  showNavPopup.value = false
}
</script>

<template>
  <div class="page">
    <header>
      <div class="brand">
        <div class="brand-icon"></div>
        <div>
          <div class="brand-name">温柔八字解读</div>
          <div class="brand-sub">不吓人·看清自己·慢慢来</div>
        </div>
      </div>
      <button
        type="button"
        class="nav-menu-btn"
        aria-label="打开菜单"
        @click="showNavPopup = true"
      >
        <span class="nav-menu-icon"></span>
        菜单
      </button>
    </header>

    <van-popup
      v-model:show="showNavPopup"
      position="left"
      :style="{ width: '72%', maxWidth: '280px', height: '100%' }"
      :duration="0.25"
    >
      <div class="nav-drawer">
        <div class="nav-drawer-header">
          <span class="brand-name">温柔八字解读</span>
          <van-icon name="cross" class="nav-drawer-close" @click="showNavPopup = false" />
        </div>
        <nav class="nav-drawer-list">
          <a href="#services" @click.prevent="scrollToSection('services')">测什么</a>
          <a href="#flow" @click.prevent="scrollToSection('flow')">怎么测</a>
          <a href="#stories" @click.prevent="scrollToSection('stories')">真实故事</a>
          <a href="#faq" @click.prevent="scrollToSection('faq')">常见疑问</a>
          <button type="button" class="btn-primary nav-drawer-cta" @click="scrollToForm">
            <span class="icon">☾</span>
            立即体验
          </button>
        </nav>
      </div>
    </van-popup>

    <main>
      <section class="hero" id="top">
        <div class="hero-copy">
          <div class="hero-copy-eyebrow">
            <span class="eyebrow-dot">✦</span>
            传统八字·温柔解读·仅供理性参考
          </div>
          <h1 class="hero-title">
            当你迷路时，<br />
            <span class="highlight">让命盘的线索</span>，给你一点指引
          </h1>
          <p class="hero-desc">
            我们不把人生写死成「对错」，只试着用子平八字的语言，帮你看清自己真正的节奏与需求。
            不恐吓、不夸大，更多是陪伴与建议。你的故事会被温柔对待，也只属于你自己。
          </p>
          <div class="hero-actions">
            <button class="btn-primary" type="button" @click="scrollToForm">
              <span class="icon">☾</span>
              <span>立即免费测一卦</span>
            </button>
            <button
              class="btn-secondary"
              type="button"
              @click="scrollToStories"
            >
              看看真实故事
            </button>
          </div>
          <p class="hero-note">
            <b>3 分钟填写</b> · 隐私不落盘 · DeepSeek 温柔解读
          </p>
          <div class="hero-metrics">
            <div class="metric-item">
              <div class="metric-title">不吓人</div>
              <div>更关注可调整的部分</div>
            </div>
            <div class="metric-item">
              <div class="metric-title">可复读</div>
              <div>同一主题可多次追问</div>
            </div>
            <div class="metric-item">
              <div class="metric-title">传统体系</div>
              <div>子平八字 + 十神语境</div>
            </div>
          </div>
        </div>

        <div class="hero-visual">
          <div class="hero-orbit"></div>
          <div class="hero-crystal" aria-hidden="true">
            <div class="hero-crystal-inner">
              <span class="big">𓁿</span>
              <span class="text">BAZI ORACLE</span>
            </div>
          </div>
          <HeroBaziForm
            v-model="form"
            :loading="loading"
            :can-submit="canSubmit"
            :error="error"
            :result="result"
            @submit="submit"
          />
        </div>
      </section>

      <section class="section" id="services">
        <div class="section-header">
          <div class="section-eyebrow">测什么 · 不是算命，而是陪你看清路</div>
          <h2 class="section-title">为你此刻的课题，点一盏小灯</h2>
          <p class="section-desc">
            不管是感情、工作还是自我怀疑，我们都试着用八字与流年的语言，
            帮你看到更多可能，而不是只有「要或不要」。
          </p>
        </div>
        <div class="service-grid">
          <div class="card">
            <div class="card-icon">♡</div>
            <div class="card-title">情感走向 · 心的去向</div>
            <div class="card-text">
              看看这段关系里，你真正的需求是什么，对方的状态可能在哪里。
              给你更清晰的边界与更温柔的表达方式。
            </div>
          </div>
          <div class="card">
            <div class="card-icon">✦</div>
            <div class="card-title">未来 3 个月运势</div>
            <div class="card-text">
              了解近期可能出现的机会、挑战与提醒，用更从容的节奏安排生活，
              不追命运，只顺应当下。
            </div>
          </div>
          <div class="card">
            <div class="card-icon">☽</div>
            <div class="card-title">事业与选择岔路口</div>
            <div class="card-text">
              在裸辞、转行或跳槽前后，看看这条路带给你的是什么，
              把焦虑拆成可执行的下一步。
            </div>
          </div>
          <div class="card">
            <div class="card-icon">☁</div>
            <div class="card-title">情绪安抚 · 只是想被听懂</div>
            <div class="card-text">
              当你只是很累很难过，想有人认真听完你的故事，
              也可以把这里当作一封写给自己的信。
            </div>
          </div>
        </div>
      </section>

      <section class="section" id="flow">
        <div class="section-header">
          <div class="section-eyebrow">流程 · 温柔但不复杂</div>
          <h2 class="section-title">4 步，完成一场只属于你的推演</h2>
          <p class="section-desc">每一份回答，都会被当作真正的人生故事，而不是冷冰冰的题目。</p>
        </div>
        <div class="flow-steps">
          <div class="card flow-step">
            <div class="flow-step-number">步骤 01</div>
            <div class="flow-dot">1</div>
            <div class="flow-title">写下你的故事与困惑</div>
            <div class="flow-text">
              尽量具体，也可以匿名。你写下的每句话，
              都会帮助解读更完整地贴近你的处境。
            </div>
          </div>
          <div class="card flow-step">
            <div class="flow-step-number">步骤 02</div>
            <div class="flow-dot">2</div>
            <div class="flow-title">生成命理语境的推演线索</div>
            <div class="flow-text">
              依据出生信息与主题，组织成八字/十神/流年的解释框架，
              让输出更有结构、也更好读。
            </div>
          </div>
          <div class="card flow-step">
            <div class="flow-step-number">步骤 03</div>
            <div class="flow-dot">3</div>
            <div class="flow-title">DeepSeek 温柔解读与书写</div>
            <div class="flow-text">
              用更贴近日常的语言解释命理术语，
              把“可能的挑战”转化为“可照顾自己的提醒”。
            </div>
          </div>
          <div class="card flow-step">
            <div class="flow-step-number">步骤 04</div>
            <div class="flow-dot">4</div>
            <div class="flow-title">收到建议与可执行下一步</div>
            <div class="flow-text">
              你会收到一份结构化的建议清单，
              以及更适合你的节奏与边界提醒。
            </div>
          </div>
        </div>
      </section>

      <section class="section" id="stories">
        <div class="section-header">
          <div class="section-eyebrow">真实故事 · 来自和你一样迷茫的人</div>
          <h2 class="section-title">我们见过很多夜晚，也见过很多重启</h2>
          <p class="section-desc">这些故事不会被当作「个案」，而是一个个在努力生活的人。</p>
        </div>
        <div class="testimonials-grid">
          <div class="card testimonial">
            <span class="badge-tag">感情 · 复合</span>
            <div class="testimonial-header">
              <div class="avatar">M</div>
              <div>
                <div class="testimonial-name">Mila · 28 岁</div>
                <div class="testimonial-meta">和前任分开 4 个月</div>
              </div>
            </div>
            <div class="stars">★★★★★</div>
            <div class="testimonial-text">
              结果没有一句话把我“判死”，而是让我看见自己的执念在哪里。
              我第一次觉得，迷茫也可以被理解、被拆解。
            </div>
          </div>

          <div class="card testimonial">
            <span class="badge-tag">工作 · 选择</span>
            <div class="testimonial-header">
              <div class="avatar">K</div>
              <div>
                <div class="testimonial-name">K 同学 · 24 岁</div>
                <div class="testimonial-meta">准备转行设计</div>
              </div>
            </div>
            <div class="stars">★★★★★</div>
            <div class="testimonial-text">
              文案里给的建议很具体：先做什么、再试什么、什么时候该停一下。
              它没有替我做决定，但让我更有底气做决定。
            </div>
          </div>

          <div class="card testimonial">
            <span class="badge-tag">心情 · 疗愈</span>
            <div class="testimonial-header">
              <div class="avatar">L</div>
              <div>
                <div class="testimonial-name">L · 31 岁</div>
                <div class="testimonial-meta">长期焦虑失眠</div>
              </div>
            </div>
            <div class="stars">★★★★★</div>
            <div class="testimonial-text">
              像一封写给我的长信。不是魔法，但让我没那么害怕夜里。
              我愿意慢慢把自己照顾回来。
            </div>
          </div>
        </div>
      </section>

      <section class="section" id="faq">
        <div class="section-header">
          <div class="section-eyebrow">FAQ · 你可能在意的</div>
          <h2 class="section-title">算命会改变命运吗？我们不这么看</h2>
          <p class="section-desc">我们更倾向把这理解为一次「深度对话」，而不是把人生交给某个神秘答案。</p>
        </div>
        <div class="faq-list">
          <div class="faq-item">
            <div class="faq-q"><span>Q1</span> 会不会不准？如果推演结果很可怕怎么办？</div>
            <div class="faq-a">
              我们会刻意避免“恐吓式表达”。更关注你此刻的状态和可以调整的部分，而不是制造新的恐惧。
              你永远有选择权，不会被任何一句话“定死”。
            </div>
          </div>
          <div class="faq-item">
            <div class="faq-q"><span>Q2</span> 隐私会被泄露吗？</div>
            <div class="faq-a">
              你的信息只用于本次推演，不会对外展示、分享或用于广告。你也可以使用昵称与模糊信息。
            </div>
          </div>
          <div class="faq-item">
            <div class="faq-q"><span>Q3</span> 出生时间不确定还能测吗？</div>
            <div class="faq-a">
              可以。时间越精确，细节越丰富；若只知道大概时段，我们会以“趋势”的方式呈现，并说明局限性。
            </div>
          </div>
          <div class="faq-item">
            <div class="faq-q"><span>Q4</span> 一定要相信命理吗？</div>
            <div class="faq-a">
              不需要。你可以把它当作一个温柔的视角来重新整理自己的处境。相信你自己，比相信任何工具更重要。
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer>
      <div>
        © 2026 温柔八字解读
        <br />
        本服务不承诺改变命运，仅提供情绪安抚与生活建议，请理性参考。
      </div>
      <div>
        <a href="#top">返回顶部</a> ·
        <a href="javascript:void(0)">关于我们</a> ·
        <a href="javascript:void(0)">使用条款与隐私</a>
      </div>
    </footer>
  </div>
</template>

<style scoped>
</style>
