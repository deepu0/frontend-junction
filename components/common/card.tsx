import React from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';

interface CardProps {
  id?: string;
  rawId?: string;
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
  isAdmin?: boolean;
  isExclusive?: boolean;
  blogLink?: string;
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

import { supabase } from '@/lib/supabase';
import { toast } from '../ui/use-toast';
import { Loader2, Wand2, CheckCircle2, Trash2 } from 'lucide-react';
import ViewCounter from '../view-counter';

const CardComponent: React.FC<CardProps> = ({
  id,
  rawId,
  title,
  imageSrc,
  description: initialDescription,
  tags,
  status,
  link,
  company,
  companyDomain,
  source,
  date,
  isAdmin,
  isExclusive,
  blogLink,
}) => {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [description, setDescription] = React.useState(initialDescription);
  const [currentStatus, setCurrentStatus] = React.useState(status);

  const handleSummarize = async () => {
    if (!blogLink || isProcessing) return;
    setIsProcessing(true);
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        body: JSON.stringify({ url: blogLink }),
      });
      const data = await res.json();
      if (data.summary) {
        // Update DB
        const { error } = await supabase
          .from('new_interview')
          .update({ description: data.summary })
          .eq('id', rawId);

        if (error) throw error;
        setDescription(data.summary);
        toast({
          title: 'AI Summary Generated!',
          description: 'The description has been updated.',
        });
      }
    } catch (err: any) {
      toast({
        title: 'Summrization Failed',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApprove = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('new_interview')
        .update({ approval_status: 'accepted' })
        .eq('id', rawId);

      if (error) throw error;
      setCurrentStatus('accepted');
      toast({
        title: 'Post Approved!',
        description: 'It is now live on the feed.',
      });
    } catch (err: any) {
      toast({
        title: 'Approval Failed',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        'Are you sure you want to delete this experience? This action cannot be undone.'
      )
    )
      return;
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('new_interview')
        .delete()
        .eq('id', rawId);

      if (error) throw error;
      toast({
        title: 'Post Deleted',
        description: 'Experience has been removed from the database.',
      });
      window.location.reload();
    } catch (err: any) {
      toast({
        title: 'Delete Failed',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };
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
            <div className='w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-lg font-bold text-primary border border-primary/20'>
              {(company || title).charAt(0)}
            </div>
          )}
        </div>

        {/* Status / Source Badge / Admin Actions */}
        <div className='flex flex-col items-end gap-2'>
          <div className='flex gap-2'>
            {currentStatus && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider ${
                  currentStatus === 'accepted' || currentStatus === 'approved'
                    ? 'bg-green-500/10 text-green-600 border-green-500/20'
                    : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                }`}
              >
                {currentStatus}
              </span>
            )}
            {isExclusive && (
              <span className='px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-600 border border-blue-500/20 uppercase tracking-wider'>
                Exclusive
              </span>
            )}
          </div>

          {source && (
            <span
              className='text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border'
              suppressHydrationWarning
            >
              via {source}
            </span>
          )}

          {isAdmin && (
            <div className='flex flex-col gap-2 mt-2'>
              {currentStatus === 'pending' && (
                <>
                  {!isExclusive && blogLink && (
                    <button
                      onClick={handleSummarize}
                      disabled={isProcessing}
                      className='flex items-center gap-1 text-[10px] bg-violet-600 hover:bg-violet-700 text-white px-2 py-1.5 rounded-md transition-colors disabled:opacity-50 font-semibold'
                    >
                      {isProcessing ? (
                        <Loader2 className='w-3 h-3 animate-spin' />
                      ) : (
                        <Wand2 className='w-3 h-3' />
                      )}
                      AI Summarize
                    </button>
                  )}
                  <button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className='flex items-center gap-1 text-[10px] bg-green-600 hover:bg-green-700 text-white px-2 py-1.5 rounded-md transition-colors disabled:opacity-50 font-semibold'
                  >
                    {isProcessing ? (
                      <Loader2 className='w-3 h-3 animate-spin' />
                    ) : (
                      <CheckCircle2 className='w-3 h-3' />
                    )}
                    Approve
                  </button>
                </>
              )}
              <button
                onClick={handleDelete}
                disabled={isProcessing}
                className='flex items-center gap-1 text-[10px] bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-2 py-1.5 rounded-md transition-all disabled:opacity-50 border border-red-600/20'
              >
                {isProcessing ? (
                  <Loader2 className='w-3 h-3 animate-spin' />
                ) : (
                  <Trash2 className='w-3 h-3' />
                )}
                Delete Record
              </button>
            </div>
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

        <div className='flex flex-wrap items-center justify-between gap-2 mt-auto'>
          <div className='flex flex-wrap gap-2'>
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className='px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20'
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
          {rawId && (
            <div className='opacity-80 group-hover:opacity-100 transition-opacity'>
              <ViewCounter
                slug={rawId}
                apiPath='/api/interview/view'
                noIncrement={true}
              />
            </div>
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
