// Business details, used across the site and in the search-engine data. Edit them here only.
const address = {
  street: "Canara Trade Centre, First Floor, Door No 5-106-72/73/82/83, Near Market",
  locality: "Moodbidri, Mangalore",
  region: "Karnataka",
  postalCode: "574227",
  country: "IN",
};

export const contact = {
  phones: ["+91-9967121288"],
  whatsapp: "919967121288", // country code + number, digits only (used for wa.me links)
  email: "hr@aadhiconsultingservices.com",
  address: `${address.street}, ${address.locality} ${address.postalCode}`,
  addressParts: address,
  // PLACEHOLDERS — paste the real profile links (leave "" to hide an icon)
  instagram: "https://www.instagram.com/",
  facebook: "https://www.facebook.com/",
  hours: "Mon – Sat · 9:00 am – 5:00 pm",
};

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const whatsappHref = `https://wa.me/${contact.whatsapp}`;

// WhatsApp chat link with a pre-filled message (lines are joined with new lines, blanks dropped)
export const whatsappLink = (lines: string[]) =>
  `${whatsappHref}?text=${encodeURIComponent(lines.filter(Boolean).join("\n"))}`;
