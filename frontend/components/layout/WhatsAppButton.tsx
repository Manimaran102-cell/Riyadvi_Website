import { whatsappLink } from '@/lib/site';

export function WhatsAppButton() {
  return (
    <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="Chat with Riyadvi on WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-black shadow-lg shadow-black/50 transition-transform hover:scale-105">
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden>
        <path d="M12 2a9.9 9.9 0 0 0-8.5 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.6-1.2.1-.2 0-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.900 11.900 0 0 0 4.600 4c1.700.7 2.400.8 3.200.700a2.700 2.700 0 0 0 1.800-1.300 2.200 2.200 0 0 0 .2-1.300c-.100-.100-.3-.200-.5-.300Z" />
      </svg>
    </a>
  );
}
