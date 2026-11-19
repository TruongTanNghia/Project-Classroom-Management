import { kimEnv, type KimPageProps } from "../env";
import { pageMetadata } from "../page-meta";

import KimShell from "@/components/kim/KimShell";
import { KimPageHero } from "@/components/kim/KimPageHero";

/* Trang Liên hệ (/contact). Khối Liên hệ là chân trang của mọi trang, nên ở đây chỉ cần phần
   mở đầu: ngay bên dưới là khối đó. Bấm "Liên hệ" ở trang khác thì KimRouter cuộn xuống chân
   trang của chính trang đó; trang này dành cho ai mở thẳng địa chỉ /contact. */
export const generateMetadata = () => pageMetadata("contact");

export default async function KimContactPage({ searchParams }: KimPageProps) {
  const { lang, dark, jewel } = await kimEnv(searchParams);
  return (
    <KimShell lang={lang} dark={dark} jewel={jewel} current="contact">
      <KimPageHero lang={lang} page="contact" />
    </KimShell>
  );
}
