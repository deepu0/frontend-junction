import React from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';

interface CardProps {
  title: string;
  imageSrc?: string;
  description: string;
  tags: string[];
  status?: string;
  link?: string;
  company?: string;
  companyDomain?: string;
  source?: string;
  date?: string;
}

const LOCAL_LOGOS: Record<string, string> = {
  accenture: '/companies/Accenture.png',
  acko: '/companies/Acko.png',
  adobe: '/companies/Adobe.png',
  agoda: '/companies/Agoda.png',
  airtel: '/companies/Airtel.png',
  andela: '/companies/Andela.png',
  'angel one': '/companies/Angel_One.png',
  apple: '/companies/Apple.png',
  atlan: '/companies/Atlan.png',
  atlassian: '/companies/Atlassian.png',
  'bajaj finserv': '/companies/Bajaj_Finserv.png',
  blinkit: '/companies/Blinkit.png',
  blueshift: '/companies/Blueshift.png',
  bookmyshow: '/companies/BookMyShow.png',
  'brick & bolt': '/companies/Brick_and_Bolt.png',
  broadridge: '/companies/Broadridge.png',
  cars24: '/companies/CARS24.png',
  canonical: '/companies/Canonical.png',
  capgemini: '/companies/Capgemini.png',
  chewy: '/companies/Chewy.png',
  cloudsek: '/companies/Cloudsek.png',
  coditas: '/companies/Coditas.png',
  coinswitch: '/companies/CoinSwitch.png',
  'credit karma': '/companies/Credit_Karma.png',
  'd.e. shaw': '/companies/DE_Shaw.png',
  'dp world': '/companies/DP_World.png',
  deel: '/companies/Deel.png',
  docusign: '/companies/DocuSign.png',
  dotpe: '/companies/DotPe.png',
  dream11: '/companies/Dream11.png',
  dunzo: '/companies/Dunzo.png',
  ey: '/companies/EY.png',
  'ernst & young (ey)': '/companies/EY.png',
  enterpret: '/companies/Enterpret.png',
  flipkart: '/companies/Flipkart.png',
  'fluid cloud': '/companies/Fluid_Cloud.png',
  fulcrum: '/companies/Fulcrum.png',
  giftpack: '/companies/Giftpack.png',
  gojek: '/companies/Gojek.png',
  google: '/companies/Google.png',
  'graviton research': '/companies/Graviton_Research.png',
  groww: '/companies/Groww.png',
  hcl: '/companies/HCL.png',
  hanseaticsoft: '/companies/Hanseaticsoft.png',
  headout: '/companies/Headout.png',
  'housing.com': '/companies/Housing.png',
  housing: '/companies/Housing.png',
  hubspot: '/companies/HubSpot.png',
  ibm: '/companies/IBM.png',
  intuit: '/companies/Intuit.png',
  'jio cinema': '/companies/Jio_Cinema.png',
  'l&t': '/companies/LT.png',
  lt: '/companies/LT.png',
  loch: '/companies/Loch.png',
  meesho: '/companies/Meesho.png',
  'mercer mettl': '/companies/Mercer_Mettl.png',
  meta: '/companies/Meta.png',
  microsoft: '/companies/Microsoft.png',
  mindtickle: '/companies/Mindtickle.png',
  mphasis: '/companies/Mphasis.png',
  myntra: '/companies/Myntra.png',
  neurowyzr: '/companies/Neurowyzr.png',
  ninjacart: '/companies/NinjaCart.png',
  nutanix: '/companies/Nutanix.png',
  paypal: '/companies/PayPal.png',
  payu: '/companies/PayU.png',
  paytm: '/companies/Paytm.png',
  'persistent systems': '/companies/Persistent_Systems.png',
  phonepe: '/companies/PhonePe.png',
  project44: '/companies/Project44.png',
  prudential: '/companies/Prudential.png',
  quince: '/companies/Quince.png',
  quizizz: '/companies/Quizizz.png',
  rakuten: '/companies/Rakuten.png',
  razorpay: '/companies/Razorpay.png',
  rippling: '/companies/Rippling.png',
  'saas labs': '/companies/SaaS_Labs.png',
  salesforce: '/companies/Salesforce.png',
  servicenow: '/companies/ServiceNow.png',
  sharechat: '/companies/ShareChat.png',
  simform: '/companies/SimForm.png',
  snapchat: '/companies/Snapchat.png',
  spinny: '/companies/Spinny.png',
  'stable money': '/companies/Stable_Money.png',
  swiggy: '/companies/Swiggy.png',
  'tata 1mg': '/companies/Tata_1mg.png',
  tekion: '/companies/Tekion.png',
  thoughtspot: '/companies/ThoughtSpot.png',
  'trade republic': '/companies/Trade_Republic.png',
  truefoundry: '/companies/TrueFoundry.png',
  uber: '/companies/Uber.png',
  uipath: '/companies/UiPath.png',
  upstox: '/companies/Upstox.png',
  veeam: '/companies/Veeam.png',
  viacom18: '/companies/Viacom18.png',
  walmart: '/companies/Walmart.png',
  wishlink: '/companies/Wishlink.png',
  zepto: '/companies/Zepto.png',
  zeta: '/companies/Zeta.png',
  zomato: '/companies/Zomato.png',
  zscaler: '/companies/Zscaler.png',
  tesla: '/companies/tesla.png',
  amazon: '/companies/amazon.png',
};

const COMPANY_WEBSITES: Record<string, string> = {
  accenture: 'https://www.accenture.com',
  acko: 'https://www.acko.com',
  adobe: 'https://www.adobe.com',
  agoda: 'https://www.agoda.com',
  airtel: 'https://www.airtel.in',
  andela: 'https://www.andela.com',
  'angel one': 'https://www.angelone.in',
  apple: 'https://www.apple.com',
  atlan: 'https://atlan.com',
  atlassian: 'https://www.atlassian.com',
  'bajaj finserv': 'https://www.bajajfinserv.in',
  blinkit: 'https://blinkit.com',
  blueshift: 'https://blueshift.com',
  bookmyshow: 'https://bookmyshow.com',
  'brick & bolt': 'https://www.bricknbolt.com',
  broadridge: 'https://www.broadridge.com',
  cars24: 'https://www.cars24.com',
  canonical: 'https://canonical.com',
  capgemini: 'https://www.capgemini.com',
  chewy: 'https://www.chewy.com',
  cloudsek: 'https://www.cloudsek.com',
  coditas: 'https://coditas.com',
  coinswitch: 'https://coinswitch.co',
  'credit karma': 'https://www.creditkarma.com',
  'd.e. shaw': 'https://www.deshaw.com',
  'dp world': 'https://www.dpworld.com',
  deel: 'https://www.deel.com',
  docusign: 'https://www.docusign.com',
  dotpe: 'https://dotpe.in',
  dream11: 'https://www.dream11.com',
  dunzo: 'https://www.dunzo.com',
  enterpret: 'https://enterpret.com',
  'ernst & young (ey)': 'https://www.ey.com',
  ey: 'https://www.ey.com',
  flipkart: 'https://www.flipkart.com',
  'fluid cloud': 'https://fluidcloud.com',
  fulcrum: 'https://fulcrumapp.com',
  groww: 'https://groww.in',
  giftpack: 'https://giftpack.io',
  gojek: 'https://www.gojek.com',
  google: 'https://www.google.com',
  'graviton research': 'https://gravitonresearch.com',
  hcl: 'https://www.hcltech.com',
  hanseaticsoft: 'https://hanseaticsoft.com',
  headout: 'https://www.headout.com',
  'housing.com': 'https://housing.com',
  hubspot: 'https://www.hubspot.com',
  ibm: 'https://www.ibm.com',
  intuit: 'https://www.intuit.com',
  'jio cinema': 'https://www.jiocinema.com',
  'l&t': 'https://www.larsentoubro.com',
  loch: 'https://loch.one',
  meesho: 'https://www.meesho.com',
  'mercer mettl': 'https://mettl.com',
  meta: 'https://about.meta.com',
  microsoft: 'https://www.microsoft.com',
  mindtickle: 'https://www.mindtickle.com',
  mphasis: 'https://www.mphasis.com',
  myntra: 'https://www.myntra.com',
  neurowyzr: 'https://neurowyzr.com',
  ninjacart: 'https://ninjacart.com',
  nutanix: 'https://www.nutanix.com',
  paypal: 'https://www.paypal.com',
  payu: 'https://payu.in',
  paytm: 'https://paytm.com',
  'persistent systems': 'https://www.persistent.com',
  phonepe: 'https://www.phonepe.com',
  project44: 'https://www.project44.com',
  prudential: 'https://www.prudential.com',
  quince: 'https://www.onequince.com',
  quizizz: 'https://quizizz.com',
  rakuten: 'https://www.rakuten.com',
  razorpay: 'https://razorpay.com',
  rippling: 'https://www.rippling.com',
  'saas labs': 'https://www.saaslabs.com',
  salesforce: 'https://www.salesforce.com',
  servicenow: 'https://www.servicenow.com',
  sharechat: 'https://sharechat.com',
  simform: 'https://www.simform.com',
  snapchat: 'https://www.snapchat.com',
  spinny: 'https://www.spinny.com',
  'stable money': 'https://stablemoney.in',
  swiggy: 'https://www.swiggy.com',
  'tata 1mg': 'https://www.1mg.com',
  tekion: 'https://tekion.com',
  thoughtspot: 'https://www.thoughtspot.com',
  'trade republic': 'https://traderepublic.com',
  truefoundry: 'https://truefoundry.com',
  uber: 'https://www.uber.com',
  uipath: 'https://www.uipath.com',
  upstox: 'https://upstox.com',
  veeam: 'https://www.veeam.com',
  viacom18: 'https://www.viacom18.com',
  walmart: 'https://www.walmart.com',
  wishlink: 'https://wishlink.com',
  zepto: 'https://www.zeptonow.com',
  zeta: 'https://www.zeta.tech',
  zomato: 'https://www.zomato.com',
  zscaler: 'https://www.zscaler.com',
};

const CardComponent: React.FC<CardProps> = ({
  title,
  imageSrc,
  description,
  tags,
  status,
  link,
  company,
  companyDomain,
  source,
  date,
}) => {
  // Helper for logo URL
  const getLogoUrl = () => {
    // 1. Check Local Mapping first (Highest Priority for curated logos)
    if (company) {
      const lowerCompany = company.toLowerCase().trim();
      if (LOCAL_LOGOS[lowerCompany]) return LOCAL_LOGOS[lowerCompany];
    }

    // 2. Use Image Source if provided (Legacy)
    if (imageSrc) return imageSrc;

    // 3. Use Clearbit if domain exists
    if (companyDomain) return `https://logo.clearbit.com/${companyDomain}`;

    // 4. Fallback based on company name
    if (company && !company.includes(' '))
      return `https://logo.clearbit.com/${company.toLowerCase()}.com`;

    return null;
  };

  const logoUrl = getLogoUrl();

  return (
    <div
      className={`group relative flex flex-col justify-between h-full rounded-2xl overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-2xl border border-border bg-card`}
    >
      {/* Glow */}
      <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none' />

      <div className='p-6 pb-2 flex items-start justify-between gap-4'>
        {/* Company Logo */}
        <div className='flex-shrink-0'>
          {logoUrl ? (
            <a
              href={
                (company && COMPANY_WEBSITES[company.toLowerCase().trim()]) ||
                (companyDomain ? `https://${companyDomain}` : '#')
              }
              target='_blank'
              rel='noopener noreferrer'
              className='cursor-pointer hover:opacity-80 transition-opacity'
            >
              <div className='w-14 h-14 rounded-xl overflow-hidden bg-muted/50 backdrop-blur-sm p-2 border border-border/50 shadow-sm relative'>
                <Image
                  src={logoUrl}
                  alt={company || 'Company'}
                  fill
                  className='object-contain p-0.5'
                  unoptimized={logoUrl.includes('clearbit.com')}
                />
              </div>
            </a>
          ) : (
            <div className='w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center text-lg font-bold text-secondary border border-border'>
              {(company || title).charAt(0)}
            </div>
          )}
        </div>

        {/* Status / Source Badge */}
        <div className='flex flex-col items-end gap-1'>
          {status && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider ${
                status === 'approved'
                  ? 'bg-green-500/10 text-green-600 border-green-500/20'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {status}
            </span>
          )}
          {source && (
            <span
              className='text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border'
              suppressHydrationWarning
            >
              via {source}
            </span>
          )}
        </div>
      </div>

      <div className='relative p-6 pt-2 flex-grow flex flex-col'>
        <h3
          className='text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2'
          suppressHydrationWarning
        >
          {title}
        </h3>

        {company && (
          <a
            href={companyDomain ? `https://${companyDomain}` : '#'}
            target='_blank'
            rel='noopener noreferrer'
            className={`text-sm font-semibold text-muted-foreground mb-3 inline-block ${companyDomain ? 'hover:text-foreground hover:underline' : ''}`}
          >
            <span suppressHydrationWarning>{company}</span>
          </a>
        )}

        {description && (
          <p
            className='text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3'
            suppressHydrationWarning
          >
            {description}
          </p>
        )}

        <div className='flex flex-wrap gap-2 mt-auto'>
          {tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className='px-2.5 py-1 rounded-md text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20'
              suppressHydrationWarning
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className='px-2 py-1 text-xs text-muted-foreground'>
              +{tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {link && (
        <div className='p-6 pt-0 mt-2'>
          <Link
            href={link}
            legacyBehavior={false}
            target={link.startsWith('/') ? undefined : '_blank'}
            rel={link.startsWith('/') ? undefined : 'noopener noreferrer'}
            className='block w-full py-2.5 px-4 rounded-xl text-center text-sm font-semibold transition-all bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 hover:border-primary'
          >
            {link.startsWith('/') ? 'Read Experience' : 'Read Full Story'}
          </Link>
        </div>
      )}
    </div>
  );
};

export default CardComponent;
