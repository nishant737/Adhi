// Used by the Contact section, the footer and the FAQ.
export const contact = {
  phones: ["+91 99671 21288", "+91 91803 22517"],
  whatsapp: "919967121288", // country code + number, digits only (used for wa.me links)
  email: "info@aadhiconsultingservices.com",
  address: "Canara Trade Centre, First Floor, Door No 5-106-72/73/82/83, Near Market, Moodbidri, Mangalore 574227",
  // PLACEHOLDERS — paste the real profile links (leave "" to hide an icon)
  instagram: "https://www.instagram.com/",
  facebook: "https://www.facebook.com/",
  hours: "Mon – Sat · 9:30 am – 6:00 pm", // PLACEHOLDER — confirm real opening hours
};

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const whatsappHref = `https://wa.me/${contact.whatsapp}`;
