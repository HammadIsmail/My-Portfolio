import { Icon } from "@iconify/react";

const WhatsAppButton = () => {
  const phoneNumber = "+923207913314";
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, "")}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition-all duration-300 touch-manipulation animate-bounce-subtle"
      aria-label="Contact on WhatsApp"
    >
      <Icon icon="lucide:message-circle" className="w-7 h-7 sm:w-8 sm:h-8" />
    </a>
  );
};

export default WhatsAppButton;
