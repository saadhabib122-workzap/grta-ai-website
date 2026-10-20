/* Legal copy, ported from the previous site and updated for the new site's
   features (Lab demos, AI processing, cookie-free analytics). Draft: requires
   legal review before the platform launches. */

export type LegalBlock = { h: string; p?: string[]; list?: string[]; after?: string[] };

export const legalUpdated = '20 October 2026';

export const privacy: LegalBlock[] = [
  {
    h: 'What data we collect',
    p: ['GRTA collects personal data you give us directly when you use this website, try the Lab, or request a demo. This may include:'],
    list: [
      'Name, work email address and organisation',
      'Organisation size, your role and the message you send us',
      'Text you type into the Lab demos, and your two-minute pulse answers',
      'Basic, cookie-free usage statistics such as pages visited',
      'Communications you send us, including support requests',
    ],
    after: ['We do not collect special categories of personal data under GDPR Article 9. Please do not enter personal data about other people into the Lab: it runs on a fictional company.'],
  },
  {
    h: 'How we use your data',
    list: [
      'To answer your request and arrange a demo or partnership conversation',
      'To run the Lab demos you start, and to improve them',
      'To understand how the website is used, in aggregate',
      'To keep the website secure and prevent abuse',
      'To meet legal obligations',
    ],
  },
  {
    h: 'AI processing',
    p: [
      'Some Lab demos send the text you enter to an AI model provider (Anthropic) to generate a result. The provider processes the request to return an answer and does not use it to train its models. Lab text is stored anonymously, and only if you allow it, to improve the demos.',
    ],
  },
  {
    h: 'Storage and security',
    p: ['Your data is stored within the European Economic Area. We use appropriate technical and organisational measures to protect it, and we never sell personal data.'],
    list: [
      'Access is limited to people who need it',
      'Data is encrypted in transit (TLS) and at rest',
      'We review our infrastructure and sub-processors regularly',
    ],
  },
  {
    h: 'Cookies',
    p: ['This website does not use tracking or advertising cookies. Our usage statistics are cookie-free. We store your light or dark preference in your own browser only.'],
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
      'Scrape or harvest data by automated means, or overload the Lab demos',
      'Impersonate anyone or misrepresent your affiliation',
    ],
  },
  {
    h: 'Lab demos',
    p: ['The Lab uses a fictional organisation and AI-generated output. Results are illustrations, not advice, and may contain errors. Do not rely on them for decisions.'],
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
