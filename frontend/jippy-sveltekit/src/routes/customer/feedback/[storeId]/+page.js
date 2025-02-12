import { browser } from "$app/environment";

export const prerender = false;

export function load({ params }) {
  let customerId = "";

  if (browser) {
    customerId = localStorage.getItem("customerId") || crypto.randomUUID();
    localStorage.setItem("customerId", customerId);
  }

  return {
    storeId: params.storeId,
    customerId: customerId,
  };
}
