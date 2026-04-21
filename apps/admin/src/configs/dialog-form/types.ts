import type { VNode } from 'vue'

export type DialogFormField = { col: string; component: () => VNode }

export type DialogFormSection = {
  header: { icon: string; label: string }
  fields: DialogFormField[]
}
