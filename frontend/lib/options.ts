/** Option lists for forms. Values mirror backend/src/validators/schemas.ts. */
export interface Opt { value: string; label: string }
const o = (pairs: [string, string][]): Opt[] => pairs.map(([value, label]) => ({ value, label }));

export const requirementOptions = o([
  ['web-development', 'Web Development'], ['app-development', 'App Development'], ['digital-marketing', 'Digital Marketing'],
  ['ar-vr', 'AR / VR'], ['3d-modeling', '3D Modeling'], ['ui-ux-design', 'UI/UX Design'], ['other', 'Something else'],
]);

export const timeSlots = o([['morning', 'Morning (9 am to 12 pm)'], ['afternoon', 'Afternoon (12 pm to 4 pm)'], ['evening', 'Evening (4 pm to 7 pm)']]);

export const hc = {
  industry: o([['retail-ecommerce', 'Retail and e-commerce'], ['healthcare', 'Healthcare'], ['education', 'Education'], ['real-estate', 'Real estate'], ['manufacturing', 'Manufacturing'], ['hospitality', 'Hospitality'], ['professional-services', 'Professional services'], ['technology', 'Technology'], ['other', 'Other']]),
  size: o([['1-10', '1 to 10 people'], ['11-50', '11 to 50'], ['51-200', '51 to 200'], ['200+', 'More than 200']]),
  hasWebsite: o([['yes', 'Yes, it is live'], ['planned', 'Not yet, but planned'], ['no', 'No website']]),
  mobile: o([['yes', 'Yes'], ['unsure', 'Not sure'], ['no', 'No']]),
  presence: o([['website', 'Website'], ['google-business', 'Google Business Profile'], ['facebook', 'Facebook'], ['instagram', 'Instagram'], ['linkedin', 'LinkedIn'], ['youtube', 'YouTube'], ['marketplaces', 'Marketplaces']]),
  channels: o([['seo', 'SEO'], ['social-media', 'Social media'], ['paid-ads', 'Paid ads'], ['email', 'Email marketing'], ['content', 'Content marketing'], ['none', 'None yet']]),
  budget: o([['none', 'No budget'], ['under-25k', 'Under \u20B925,000'], ['25k-100k', '\u20B925,000 to \u20B91,00,000'], ['100k-500k', '\u20B91 lakh to \u20B95 lakh'], ['500k+', 'Over \u20B95 lakh']]),
  tracks: o([['yes', 'Yes, every source'], ['partially', 'Partly'], ['no', 'No']]),
  stack: o([['wordpress', 'WordPress'], ['shopify-woocommerce', 'Shopify / WooCommerce'], ['custom-code', 'Custom-coded'], ['no-code', 'No-code builder'], ['none', 'Nothing yet'], ['not-sure', 'Not sure']]),
  needs: o([['new-website', 'New website'], ['redesign', 'Redesign'], ['mobile-app', 'Mobile app'], ['ecommerce', 'E-commerce'], ['automation', 'Automation'], ['ar-vr', 'AR / VR'], ['3d-content', '3D content'], ['marketing', 'Marketing support']]),
  crm: o([['yes', 'Yes'], ['no', 'No']]),
  challenge: o([['low-traffic', 'Not enough traffic'], ['low-conversion', 'Visitors do not convert'], ['outdated-design', 'Outdated design'], ['slow-performance', 'Slow or unreliable site'], ['manual-processes', 'Manual processes'], ['no-digital-strategy', 'No digital strategy'], ['scaling', 'Hard to scale'], ['brand-visibility', 'Low brand visibility']]),
  timeline: o([['asap', 'As soon as possible'], ['1-3-months', 'In 1 to 3 months'], ['3-6-months', 'In 3 to 6 months'], ['exploring', 'Just exploring']]),
  projectBudget: o([['under-1l', 'Under \u20B91 lakh'], ['1l-5l', '\u20B91 to \u20B95 lakh'], ['5l-15l', '\u20B95 to \u20B915 lakh'], ['15l+', 'Over \u20B915 lakh'], ['not-sure', 'Not sure yet']]),
};
