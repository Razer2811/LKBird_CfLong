import { ArrowUp, Facebook, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

const floatingLinks = {
  zalo: "https://zalo.me/0378605343",
  facebook: "https://www.facebook.com/long.tran.493610",
  messenger: "https://www.facebook.com/long.tran.493610",
} as const;

function ZaloIcon() {
  return <span className="text-xs font-black">Zalo</span>;
}

export function FloatingWidgets() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 320);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col items-center gap-3 sm:bottom-6 sm:right-6">
      <a
        href={floatingLinks.zalo}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat qua Zalo"
        title="Zalo"
        className="flex size-11 items-center justify-center rounded-full bg-[#0068ff] text-white shadow-lg transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0068ff] focus-visible:ring-offset-2"
      >
        <ZaloIcon />
      </a>
      <a
        href={floatingLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Mở Facebook của shop"
        title="Facebook"
        className="flex size-11 items-center justify-center rounded-full bg-[#1877f2] text-white shadow-lg transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1877f2] focus-visible:ring-offset-2"
      >
        <Facebook className="size-5" />
      </a>
      <a
        href={floatingLinks.messenger}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Nhắn tin qua Messenger"
        title="Messenger"
        className="flex size-11 items-center justify-center rounded-full bg-[#0084ff] text-white shadow-lg transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0084ff] focus-visible:ring-offset-2"
      >
        <MessageCircle className="size-5" />
      </a>
      {showScrollTop ? (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Cuộn lên đầu trang"
          title="Lên đầu trang"
          className="flex size-11 items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
        >
          <ArrowUp className="size-5" />
        </button>
      ) : null}
    </div>
  );
}
