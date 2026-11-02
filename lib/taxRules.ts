export function getCalculatedTax(sellerCountry: string, clientCountry: string): number {
  // Agar International transaction hai toh 0% Export tax
  if (sellerCountry.toLowerCase() !== clientCountry.toLowerCase()) {
    return 0;
  }

  // Domestic India (18% GST)
  if (sellerCountry.toLowerCase() === "india") {
    return 18;
  }

  // Domestic USA default
  if (sellerCountry.toLowerCase() === "usa") {
    return 8;
  }

  return 10;
}