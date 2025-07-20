declare module "khalti-checkout-web" {
  interface KhaltiSuccessPayload {
    token: string;
    amount: number;
    product_identity: string;
    product_name: string;
    mobile?: string;
    purchase_order_id?: string;
    purchase_order_name?: string;
  }

  interface KhaltiEventHandler {
    onSuccess: (payload: KhaltiSuccessPayload) => void;
    onError?: (error: any) => void;
    onClose?: () => void;
  }

  interface KhaltiConfig {
    publicKey: string;
    productIdentity: string;
    productName: string;
    productUrl?: string;
    eventHandler: KhaltiEventHandler;
  }

  export default class KhaltiCheckout {
    constructor(config: KhaltiConfig);
    show(options: { amount: number }): void;
  }
}
