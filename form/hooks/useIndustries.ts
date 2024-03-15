import { useEffect, useState } from 'react';
const frontendRoles = [
  'Junior Frontend Developer (SDE 1)',
  'Mid-Level Frontend Developer (SDE 2)',
  'Senior Frontend Developer (SDE 3)',
  'Lead Frontend Developer',
  'UI Engineer 1',
  'UI Engineer 2',
  'UI Engineer 3',
  'Senior UI Engineer',
  'UX Developer',
  'Front-End Engineer',
  'React Developer',
  'Angular Developer',
  'Vue.js Developer',
  'JavaScript Developer (Frontend)',
  'Web Designer (Frontend Focused)',
  'Front-End Architect',
  'Front-End Performance Engineer',
  'Accessibility Specialist (Frontend)',
  'Mobile Frontend Developer',
];
export function useIndustries() {
  const [industries, setIndustries] = useState<string[]>([]);
  const industryResourceURL =
    'https://gist.githubusercontent.com/gxt-admin/758c1973293f54322c054bbd8119e80c/raw/7e819e47a60217130347743fd43ae91c3e3e1ede/industries.txt';

  // useEffect(() => {
  //   (async function () {
  //     try {
  //       const response = await fetch(industryResourceURL);
  //       const data = await response.text();
  //       setIndustries(data.split('\n'));
  //     } catch (e) {
  //       //
  //     }
  //   })();
  // }, []);

  return { industries: frontendRoles };
}
