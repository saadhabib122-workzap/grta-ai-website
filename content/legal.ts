/* Legal copy for the one-page site: contact form, news updates and cookie-free
   analytics. Draft: requires legal review before launch. */

export type LegalBlock = { h: string; p?: string[]; list?: string[]; after?: string[] };

export const legalUpdated = '10 November 2026';

export const privacy: LegalBlock[] = [
  {
    h: 'What data we collect',
    p: ['GRTA collects personal data you give us directly when you contact us, book a demo or sign up for news updates. This may include:'],
    list: [
      'Name, work email address and organisation',
      'Organisation size, your role and the message you send us',
      'Basic, cookie-free usage statistics such as pages visited',
      'Communications you send us, including support requests',
    ],
    after: ['We do not collect special categories of personal data under GDPR Article 9.'],
  },
  {
    h: 'How we use your data',
    list: [
      'To answer your request and arrange a demo or partnership conversation',
      'To send you news updates, if you signed up for them. You can unsubscribe at any time',
      'To understand how the website is used, in aggregate',
      'To keep the website secure and prevent abuse',
      'To meet legal obligations',
    ],
  },
  {
    h: 'Storage and security',
    p: ['Your data is stored with providers that meet the requirements of GDPR. We use appropriate technical and organisational measures to protect it, and we never sell personal data.'],
    list: [
      'Access is limited to people who need it',
      'Data is encrypted in transit (TLS) and at rest',
      'We review our infrastructure and sub-processors regularly',
    ],
  },
  {
    h: 'Cookies',
    p: ['This website does not use tracking or advertising cookies. Our usage statistics are cookie-free.'],
  },
  {
    h: 'Your rights under GDPR',
    p: ['If you are in the European Economic Area, you have these rights:'],
    list: [
      'Access: request a copy of the personal data we hold about you',
      'Rectification: correct inaccurate or incomplete data',
      'Erasure: ask us to delete your data in certain circumstances',
      'Restriction: ask us to limit how we use your data',
      'Portability: receive your data in a structured, machine-readable format',
      'Objection: object to processing based on legitimate interest',
      'Withdrawal of consent: withdraw consent at any time where processing is based on it',
    ],
    after: ['To use any of these rights, contact us at the address below. We reply within 30 days. You may also complain to your national data protection authority.'],
  },
  {
    h: 'Contact',
    p: ['Questions or requests about privacy: privacy@grta.ai'],
  },
];

export const terms: LegalBlock[] = [
  {
    h: 'Acceptance of terms',
    p: [
      'By using the GRTA website and services ("the Service"), you agree to these Terms. If you do not agree, please do not use the Service.',
      'We may update these Terms and will give reasonable notice of material changes. Additional terms may apply to specific features or pilot programmes; where they conflict, the more specific terms apply.',
    ],
  },
  {
    h: 'Use of the Service',
    p: ['GRTA grants you a limited, non-exclusive, non-transferable licence to use the Service for your organisation’s internal purposes. You agree not to:'],
    list: [
      'Use the Service unlawfully or against applicable regulations',
      'Copy, distribute or create derivative works from the Service without written permission',
      'Try to gain unauthorised access to the Service or its systems',
      'Send viruses, malware or other harmful code',
      'Scrape or harvest data by automated means, or overload the Service',
      'Impersonate anyone or misrepresent your affiliation',
    ],
  },
  {
    h: 'Intellectual property',
    p: [
      'The Service, including its software, design, content, methods and trademarks, belongs to GRTA and is protected by intellectual property law. Nothing in these Terms transfers ownership to you.',
      'You keep ownership of the data you enter. You give GRTA a limited licence to process it as needed to provide the Service, as described in the privacy notice.',
    ],
  },
  {
    h: 'Limitation of liability',
    p: ['To the extent permitted by law, GRTA and its directors, employees and partners are not liable for:'],
    list: [
      'Indirect, incidental, special, consequential or punitive damages',
      'Loss of profits, revenue, data or business opportunities',
      'Damages from using, or being unable to use, the Service',
      'Errors or inaccuracies in outputs or recommendations',
    ],
  },
  {
    h: 'Governing law',
    p: [
      'These Terms are governed by the laws of the country where GRTA is incorporated, and disputes fall under the courts there. If you live in the European Union, mandatory consumer protection laws of your country may also apply.',
    ],
  },
  {
    h: 'Contact',
    p: ['Questions about these Terms: legal@grta.ai'],
  },
];
