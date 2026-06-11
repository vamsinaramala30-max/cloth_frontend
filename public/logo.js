import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="flex items-center">
      <Image
        src="/images/rare.jpeg"
        alt="VKGROUPS Logo"
        width={150}
        height={50}
        priority
      />
    </nav>
  );
}