/* =====================================================================
   js/config.js — PUBLIC client-side configuration
   ---------------------------------------------------------------------
   Everything in this file is shipped to the browser, so only PUBLIC
   values belong here (EmailJS public key, service ID, template ID, URLs).

   NEVER put the EmailJS *private* key — or any other secret — in this
   file or anywhere else in the front-end.

   Setup guide for the contact form: see README.md → "Contact form".
   ===================================================================== */
window.PORTFOLIO_CONFIG = {
  profile: {
    name: 'James Felix',
    title: 'Software Engineer',
    email: 'jamefelix1262002@gmail.com',

    // Profile photo (4:5 portrait recommended, ~800×1000px, JPG/WebP).
    // Example: 'assets/images/profile/james-felix.jpg'. null shows a monogram placeholder.
    image: 'assets/images/profile/james-felix-profile.jpeg',

    // Optional — leave null to hide from the About card and Contact list.
    location: null,

    // Shown in the hero status pill and About facts. Set to null to hide.
    availability: 'Open to opportunities',

    // Optional CV/PDF link — shows a "Download CV" button on the About card when set.
    cvUrl: null
  },

  social: {
    facebook: 'https://www.facebook.com/profile.php?id=61585894787080',
    instagram: 'https://www.instagram.com/jalixtech/',
    whatsapp: 'https://wa.me/2348155141240'
  },

  // EmailJS (https://www.emailjs.com) — public, client-side identifiers only.
  // The form stays disabled (with a clear message) until all three values are real.
  emailjs: {
    publicKey: 'YOUR_EMAILJS_PUBLIC_KEY',
    serviceId: 'YOUR_EMAILJS_SERVICE_ID',
    templateId: 'YOUR_EMAILJS_TEMPLATE_ID'
  },

  contactForm: {
    minSecondsBeforeSubmit: 3,  // time-based bot check (submissions faster than this are rejected)
    duplicateWindowSeconds: 60  // an identical message cannot be re-sent within this window
  }
};
