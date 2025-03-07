declare module "*.typ?parts" {}

declare module "*.typ?html" {
    const html: string;
    export default html;
}
