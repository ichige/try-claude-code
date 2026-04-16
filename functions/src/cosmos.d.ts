export {}

declare module '@azure/cosmos' {
  interface Resource {
    _attachments: string
  }
}
