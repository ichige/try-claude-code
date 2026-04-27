/**
 * iconMap は、ワードに対して icon を設定することで、アプリ全体での表記揺れを防ぎます。
 * また動的要素では任意のアイコンワードが指定しにくいケースがありますが、
 * その場合はその場で利用可能なキーワードに対してアイコンを指定します。
 * 例) パンくず作成では URL や動的パラメータに対してアイコンを設定。
 */
const iconMap: Record<string, string> = {
  // 汎用アイコン
  address: 'sym_o_location_on',
  basic: 'sym_o_article',
  building: 'sym_o_apartment',
  city: 'sym_o_location_on',
  cityStreet: 'sym_o_location_home',
  companyCode: 'sym_o_settings_ethernet',
  companyName: 'sym_o_domain',
  contact: 'sym_o_id_card',
  dashboard: 'sym_o_dashboard',
  delete: 'sym_o_delete',
  edit: 'sym_o_edit',
  email: 'sym_o_email',
  invoiceNumber: 'sym_o_tag',
  lineId: 'sym_o_chat',
  logout: 'sym_o_logout',
  masters: 'sym_o_table',
  other: 'sym_o_notes',
  paymentRate: 'sym_o_percent',
  phone: 'sym_o_phone',
  postalCode: 'sym_o_local_post_office',
  prefecture: 'sym_o_map',
  restore: 'sym_o_restore_from_trash',
  search: 'sym_o_search',
  website: 'sym_o_language',
  'dark-mode': 'sym_o_dark_mode',
  // 動的ルート解決用
  'masters-container.carriers': 'sym_o_local_shipping',
  'masters-container.consignees': 'sym_o_store',
  'masters-container.consignors': 'sym_o_domain',
  'masters-container.forwarders': 'sym_o_warehouse',
  'masters-container.tariffs': 'sym_o_price_change',
}

export default iconMap
