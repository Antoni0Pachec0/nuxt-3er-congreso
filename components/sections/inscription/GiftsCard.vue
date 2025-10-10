<template>
    <article class="insc-card" :style="cssVars">
        <div class="insc-cap"></div>
        <header class="insc-head">
            <h3 class="insc-card-title">{{ title }}</h3>
            <p class="insc-card-desc">{{ description }}</p>
        </header>
        <figure class="insc-media">
            <img :src="imageSrc" :alt="imageAlt" loading="lazy" />
        </figure>
    </article>
</template>

<script setup lang="ts">
type Accent = 'blue' | 'indigo' | 'sky' | 'green' | 'purple' | 'custom'

const props = defineProps<{
    title: string
    description: string
    imageSrc: string
    imageAlt?: string
    accent?: Accent
    accentFrom?: string
    accentTo?: string
}>()

const palette: Record<Exclude<Accent, 'custom'>, { from: string; to: string }> = {
    blue: { from: '#1e66ff', to: '#10308b' },
    indigo: { from: '#6366f1', to: '#4338ca' },
    sky: { from: '#38bdf8', to: '#0ea5e9' },
    green: { from: '#22c55e', to: '#16a34a' },
    purple: { from: '#a855f7', to: '#7e22ce' },
}

const from = props.accent === 'custom'
    ? (props.accentFrom || '#1e66ff')
    : palette[props.accent || 'blue'].from
const to = props.accent === 'custom'
    ? (props.accentTo || '#10308b')
    : palette[props.accent || 'blue'].to

const cssVars = { '--cap-from': from, '--cap-to': to } as Record<string, string>
</script>
