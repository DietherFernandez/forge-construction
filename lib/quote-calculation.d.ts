export type QuoteItemInput={category:string;description:string;quantity:string;unit:string;unit_price:string};
export function calculateQuote(items:QuoteItemInput[],discount?:string,taxRate?:string):{items:Array<QuoteItemInput&{amount:string}>;subtotal:string;discount:string;tax:string;total:string};
export function formatPhp(amount:string|number):string;
