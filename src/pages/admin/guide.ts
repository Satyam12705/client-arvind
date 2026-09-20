/**
 * Plain-English help shown inside the admin panel.
 *
 * Written for a non-technical editor: each entry says what a section controls,
 * where on the public site it appears, and what visibly changes when it is
 * edited. Keep the wording concrete ("the dark band under the menu on the
 * About page") rather than structural ("aboutContent.journey.heading") — the
 * person reading it is looking at the website, not the data.
 */

export interface SectionGuide {
  /** One line: what this screen controls. */
  what: string;
  /** Where the visitor sees it. */
  where: string;
  /** What changes on the live site, and anything to be careful of. */
  effect: string;
}

export const SECTION_GUIDE: Record<string, SectionGuide> = {
  siteSettings: {
    what: "Your logo, the big background video on the home page, and the small certification strip at the very top.",
    where: "Every page — the logo and top strip appear site-wide; the video only on the home page.",
    effect:
      "Changing the logo replaces it in the menu and the footer at once. The hero video is the large moving background behind the home page headline; if you replace it, upload a wide (landscape) file, and keep it short and quiet — it plays silently on a loop. The poster image is what visitors see while the video loads, and what people with reduced-motion settings see instead of the video.",
  },
  footerContent: {
    what: "The large closing statement and the contact prompt in the dark footer.",
    where: "The bottom of every page.",
    effect:
      "The big statement uses one line per line you type — press Enter to control where it breaks. The 'Start a conversation' block is hidden on the home page only, because the home page already ends with its own large call-to-action.",
  },
  nav: {
    what: "The menu links across the top of the site.",
    where: "The top of every page, and the link list in the footer.",
    effect:
      "Removing a link hides that page from the menu but does NOT delete the page — visitors with the direct address can still reach it, and Google may still list it. Order here is the order shown. 'Home' and 'Contact' are handled separately by the logo and the Contact button, so they are not repeated in the menu.",
  },
  home: {
    what: "Everything on the home page: the headline over the video, the large numbers, and each section's heading and link.",
    where: "The home page only.",
    effect:
      "The headline sits directly on the video, so keep it short — two lines reads best. The large numbers animate upward as visitors scroll to them. Section headings use one line per line you type; press Enter where you want the break.",
  },
  pageHeroes: {
    what: "The title and the short introduction in the dark band at the top of each page.",
    where: "The top of About, Services, Projects, Capabilities, Quality & Safety, Certifications, Gallery and Contact.",
    effect:
      "Titles are automatically split across two lines at the most even point, so they look consistent from page to page. A one-word title stays on one line. The introduction below is the short paragraph explaining the page.",
  },
  aboutContent: {
    what: "The headings and wording for each block on the About page.",
    where: "The About page.",
    effect: "Only changes headings and short intro text — the timeline, team and approach steps are edited on their own screens.",
  },
  timeline: {
    what: "The company milestones (year, title, short description).",
    where: "The About page, and the shorter list on the home page.",
    effect: "Appears in the order listed here. Use the arrows to reorder and Remove to delete a milestone from both places at once.",
  },
  methodology: {
    what: "The numbered steps describing how you work.",
    where: "The 'How we work' grid on the About page, and on each individual service page.",
    effect: "Adding a step adds it to every service page too, since they share this list.",
  },
  commitment: {
    what: "The single commitment statement.",
    where: "The dark band near the bottom of the About page.",
    effect: "Plain paragraph — no headings or formatting.",
  },
  company: {
    what: "Your legal and contact details: registered name, address, GST and LLP numbers, phone numbers, email addresses and partners.",
    where: "The footer of every page, the Contact page, and the corporate details table on About.",
    effect:
      "These appear in many places at once. The first phone number is used by the Call button on mobile and the top strip; the first email is used by every 'email us' link. Changing them here changes them everywhere — worth double-checking before saving.",
  },
  specializations: {
    what: "Your services: title, short subtitle, description and photo.",
    where: "The Services page, the home page service list, the Contact form's service dropdown, and each service's own page.",
    effect:
      "Each service automatically gets its own page, and its web address comes from the title. Renaming a service changes that address, so any existing link to the old address will stop working — rename sparingly. The first service in the list is the large featured one on the home page.",
  },
  projectsContent: {
    what: "The headings above the project sections.",
    where: "The Projects page.",
    effect: "Headings only — the projects themselves are on their own screens.",
  },
  concurrentCommitments: {
    what: "The work currently in execution, shown as large highlighted cards.",
    where: "Near the top of the Projects page.",
    effect: "Meant for a small number of active jobs. Remove them as they complete and add them to the Project Archive instead.",
  },
  projects: {
    what: "The full project archive: year, title, client, location and value.",
    where: "The Projects page table, the Project Explorer slideshow, each service page, and the regional pages.",
    effect:
      "This list drives a lot of the site. The regional pages are built automatically from the location you type, so keep the state name consistent (for example always 'Gujarat', not sometimes 'Gujrat'), or a new region page will appear. The value is used to total up figures shown elsewhere.",
  },
  projectFilters: {
    what: "The filter buttons above the project table.",
    where: "The Projects page.",
    effect: "These must match the categories used on your projects, otherwise a filter will show nothing. 'All' should stay first.",
  },
  capabilitiesContent: {
    what: "The headings on the Capabilities page, and whether the financial chart is shown.",
    where: "The Capabilities page.",
    effect: "Turning the financial section off hides the whole chart from visitors without deleting the figures.",
  },
  team: {
    what: "Your headcount by role.",
    where: "The 'Our team' figures on the Capabilities page.",
    effect: "Numbers count up as visitors scroll to them. Keep role names short — they sit under the number in a narrow column.",
  },
  equipment: {
    what: "The full machinery list (name, quantity, make, condition).",
    where: "The pop-out equipment table on the Capabilities page.",
    effect: "Shown only when a visitor opens the equipment table, so a long list is fine here.",
  },
  equipmentHighlights: {
    what: "The handful of headline equipment figures.",
    where: "The sliding row on the home page and the figures on Capabilities.",
    effect: "Keep this short — it is the summary, not the full list. The full list is on the Equipment screen.",
  },
  financials: {
    what: "Turnover by financial year.",
    where: "The bar chart on the Capabilities page.",
    effect: "Bar heights are worked out automatically from the largest figure, so you only enter the numbers.",
  },
  financialNote: {
    what: "The small print under the financial chart.",
    where: "The Capabilities page.",
    effect: "Use this for any caveat about how the figures are stated.",
  },
  qualitySafetyContent: {
    what: "Headings and the two photographs on the Quality & Safety page.",
    where: "The Quality & Safety page.",
    effect: "The policy points themselves are on the HSE Policy and Quality Policy screens.",
  },
  hsePolicy: {
    what: "Your health, safety and environment motto and its bullet points.",
    where: "The first half of the Quality & Safety page.",
    effect: "The motto is shown as a quote; each point becomes a bullet underneath.",
  },
  qualityPolicy: {
    what: "Your quality motto and its bullet points.",
    where: "The second half of the Quality & Safety page.",
    effect: "Same layout as the HSE policy above it.",
  },
  certificationsContent: {
    what: "The headings on the Certifications page.",
    where: "The Certifications page.",
    effect: "Headings only.",
  },
  certifications: {
    what: "Your ISO certificates — standard, name, scope and a photo of the certificate.",
    where: "The Certifications page, and the three preview cards on the home page.",
    effect:
      "If you leave the certificate image empty, the card still shows the text but the picture and the 'View Certificate' link disappear — nothing looks broken. Photograph certificates straight-on in portrait; they are shown whole, not cropped.",
  },
  statutoryRegistrations: {
    what: "Registration documents such as LLP, GST and Udyam.",
    where: "The middle section of the Certifications page.",
    effect: "Same as certificates — with no document image, the card shows text only and the view link is hidden.",
  },
  awards: {
    what: "Awards and letters of appreciation.",
    where: "The dark section at the bottom of the Certifications page, and the recognition row on the home page.",
    effect: "With no image the card keeps its text and simply shows no picture.",
  },
  completionCertificate: {
    what: "The featured project completion certificate.",
    where: "The Certifications page.",
    effect: "Shown as one wide highlighted card. With no image attached it is not clickable.",
  },
  clients: {
    what: "The client logos that slide across the home page.",
    where: "The pale band in the middle of the home page.",
    effect:
      "Logos scroll slowly and pause when a visitor hovers over them. Upload logos with a transparent or white background; they are shown in grey and turn full colour on hover. If a client has no logo yet, leave the logo field empty and the name is shown as text instead — nothing appears broken. The strip repeats itself automatically to fill wide screens.",
  },
  galleryItems: {
    what: "The site photographs, each with a caption, location and category.",
    where: "The Gallery page.",
    effect:
      "The category must match one of the Gallery filter buttons or the photo will not appear under any filter. Clicking a photo opens it full screen.",
  },
  contactContent: {
    what: "The Contact page headings and the message that is pre-filled when someone opens WhatsApp.",
    where: "The Contact page, and every WhatsApp button across the site.",
    effect:
      "The WhatsApp message is what appears already typed in the visitor's chat window — keep it short and friendly. Enquiries from the form are saved and emailed to you; that is not configured here.",
  },
};

/**
 * Hints for individual fields, matched on the field name. Kept generic because
 * the same names recur across sections (every section has a "heading").
 */
export const FIELD_GUIDE: Record<string, string> = {
  eyebrowIndex: "The small number above a heading (01, 02…). Decorative only.",
  eyebrowLabel: "The small label above a heading, e.g. 'OUR JOURNEY'.",
  eyebrow: "The small line of text above the main title.",
  heading: "The large heading for this section. Press Enter to choose where it breaks onto the next line.",
  title: "The main name shown to visitors.",
  subtitle: "The short line under the title.",
  intro: "The short paragraph under the title.",
  body: "The main descriptive paragraph.",
  detail: "Extra description shown under the main text.",
  note: "Small print shown underneath.",
  image: "Photo shown here. Use 'Upload new' for a new file, or pick one already uploaded.",
  logo: "Logo file. A transparent background looks best.",
  photo: "Portrait photograph.",
  backgroundImage: "Large photo used as the background behind this section's text.",
  heroVideo: "The moving background on the home page. Use a wide, short, silent clip.",
  heroPoster: "Still image shown while the video loads, and instead of it for reduced-motion visitors.",
  heroVideoAlt: "Description of the video for screen readers and search engines.",
  heroVideoMobile:
    "Optional upright version of the hero film, used on phones only. Upload 1080 x 1920 (9:16 portrait), under about 20 seconds and under 8 MB, silent. A phone hero is roughly twice as tall as it is wide, so a normal widescreen film has to lose about three quarters of its width to fill it — an upright cut keeps the whole picture and looks sharper. Keep anything that matters within the middle 80%, and start on a lit frame rather than a fade up from black. Leave this empty to use the main hero video on phones as well.",
  linkLabel: "The wording of the link at the end of this section.",
  slideSeconds:
    "How long each photograph stays on screen in the fieldwork slider, in seconds. Around 6 to 8 reads as unhurried; below 4 starts to feel restless behind the heading. Autoplay pauses by itself while a visitor is hovering, using the arrows, or has reduced motion switched on in their system, so this is the unattended pace only.",
  ctaLabel: "The wording on the button.",
  ctaPrimaryLabel: "The wording on the main (filled) button.",
  ctaSecondaryLabel: "The wording on the outlined button next to it.",
  whatsappDefaultMessage: "The message already typed in when a visitor opens WhatsApp.",
  navCtaLabel: "The wording on the Contact button in the menu.",
  certBarItems: "The certifications listed in the thin strip at the very top of the page.",
  introEnabled: "Whether the animated logo plays once when someone first arrives.",
  show: "Turn this section on or off for visitors without deleting anything.",
  url: "Full web address, starting with https://",
  year: "Financial or calendar year as you want it displayed.",
  count: "A number. It counts up as visitors scroll to it.",
  value: "The figure shown in large type.",
  label: "The short caption under the figure.",
  number: "The small reference number shown beside this item.",
  location: "Town and state. Keep state names spelled consistently — regional pages are built from them.",
  client: "Client or main contractor name.",
  workDoneCr: "Value of work done, in crore. Numbers only.",
  workOrderValue: "Work order value as you want it displayed.",
  categories: "Which filter buttons this project appears under. Must match the filter names exactly.",
  category: "Which filter this appears under. Must match a filter name exactly.",
  caption: "The short description shown under or over the photo.",
  motto: "The single sentence shown as a quote.",
  points: "The bullet points listed underneath.",
  scope: "What the certificate covers.",
  standard: "The standard's reference, e.g. ISO 9001:2015.",
  issuer: "Who issued it.",
  period: "When it was awarded.",
  pillar: "The one-word grouping shown above the name.",
  name: "Name as you want it displayed.",
  role: "Job title.",
  to: "Which page this link opens.",
  diameter: "The headline figure shown in large type on the card.",
};
