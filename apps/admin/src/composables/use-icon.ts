import iconMap from 'src/configs/icon'

/**
 * @param key - コンテキストキー（例: 'masters.carriers'）
 * @returns アイコン名
 */
export const resolveIcon = (key: string): string => iconMap[key] ?? 'sym_o_help_outline'

export const useIcon = () => ({ resolveIcon })
