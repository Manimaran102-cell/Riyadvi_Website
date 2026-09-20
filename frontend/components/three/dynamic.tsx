'use client';
import dynamic from 'next/dynamic';

/** Code-split entry points: three.js only downloads on pages/sections that actually render a scene. */
export const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });
export const ServiceScene = dynamic(() => import('./ServiceScene'), { ssr: false });
export const TechConstellation = dynamic(() => import('./TechConstellation'), { ssr: false });
export const CaseStudyScene = dynamic(() => import('./CaseStudyScene'), { ssr: false });
