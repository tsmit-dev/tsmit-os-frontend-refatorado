
import Image from 'next/image';
import logo from '@/assets/logo_TSMIT_Nova.png';

export function TsmitLogo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Image src={logo} alt="TSMIT Logo" />
    </div>
  );
}
