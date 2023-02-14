declare module "language-colors" {
  declare const colors: Partial<{
    [key: string]: { model: `rgb`; color: [number, number, number] }
  }>

  export default colors
}
